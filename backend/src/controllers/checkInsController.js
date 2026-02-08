import { pool } from "../config/connectDB.js";

const checkInsController = {
  submitCheckIn: async (req, res) => {
    const client = await pool.connect();
    let inTx = false;

    try {
      const userId = req.user?.id;
      const { activityId } = req.params;

      const { evidenceUrls } = req.body;

      if (!userId) return res.status(401).json({ error: "Unauthorized" });
      if (!activityId)
        return res.status(400).json({ error: "Invalid activityId" });

      const evidence = Array.isArray(evidenceUrls) ? evidenceUrls : [];

      await client.query("BEGIN");
      inTx = true;
      // Load act + lock row
      const actRes = await client.query(
        `
                SELECT id, title, gem_amount, checkin_enabled, requires_evidence 
                FROM activities
                WHERE id = $1
                FOR UPDATE
                `,
        [activityId],
      );

      if (actRes.rowCount === 0) {
        await client.query("ROLLBACK");
        inTx = false;
        return res.status(404).json({ error: "Activity not found" });
      }
      const activity = actRes.rows[0];

      if (!activity.checkin_enabled) {
        await client.query("ROLLBACK");
        inTx = false;
        return res.status(400).json({ error: "Check-in is not enabled" });
      }

      if (activity.requires_evidence && evidence.length === 0) {
        await client.query("ROLLBACK");
        inTx = false;
        return res.status(400).json({ error: "Evidence is required" });
      }

      // Upsert check-ins(unique activity_id + user_id)
      const checkInRes = await client.query(
        `
                INSERT INTO check_ins (activity_id, user_id, status, evidence, checked_at)
                VALUES ($1, $2, 'attended', $3::text[], now())
                ON CONFLICT (activity_id, user_id)
                DO UPDATE SET
                    status = 'attended',
                    checked_at = now(),
                    evidence = (
                        SELECT array(
                            SELECT DISTINCT e
                            FROM unnest(check_ins.evidence || excluded.evidence) AS e
                        )
                    )
                RETURNING id, activity_id, user_id, status, evidence, checked_at, created_at
                `,
        [activityId, userId, evidence],
      );

      const checkIn = checkInRes.rows[0];

      // Award gemLog one time using idempotency_Key
      let gemAdded = 0;
      let newTotalGems = 0;
      const gemAmount = Number(activity.gem_amount || 0);
      if (gemAmount > 0) {
        const gemLogKey = `gemlog:checkin:${activityId}:${userId}`;

        //isert gemlog if conflict do nothing

        const logRes = await client.query(
          `
                    INSERT INTO gem_logs(user_id, amount, reason, source_kind, activity_id, checkin_id, evidence, idempotency_key) 
                    VALUES ($1, $2, $3, 'checkin', $4, $5, $6::text[], $7)
                    ON CONFLICT (idempotency_key) DO NOTHING 
                    RETURNING id, amount, created_at
                    `,
          [
            userId,
            gemAmount,
            `Check-in: ${activity.title}`,
            activityId,
            checkIn.id,
            checkIn.evidence,
            gemLogKey,
          ],
        );

        if (logRes.rowCount === 1) {
          gemAdded = gemAmount;

          const updateUserRes = await client.query(
            `
                        UPDATE users
                        SET total_gems = total_gems + $1,
                            regular_session_count = regular_session_count + 1,
                            updated_at = now()
                        WHERE id = $2
                        RETURNING total_gems
                        `,
            [gemAdded, userId],
          );
          newTotalGems = updateUserRes.rows[0]?.total_gems ?? null;
        } else {
          //if inserted
          const curUser = await client.query(
            `SELECT total_gems FROM users WHERE id = $1`,
            [userId],
          );
          newTotalGems = curUser.rows[0]?.total_gems ?? null;
        }
      }
      await client.query("COMMIT");
      inTx = false;
      return res.status(201).json({
        activity: { id: activity.id, title: activity.title },
        checkIn,
        gem: {
          added: gemAdded,
          newTotalGems,
        },
      });
    } catch (error) {
      if (inTx) await client.query("ROLLBACK");
      console.log("Submit check-in error:", error);
      return res.status(500).json({ error: error.message });
    } finally {
      client.release();
    }
  },
  //GET /v1/activities/checkins/me?status=finish/pending
  getMyActivities: async (req, res) => {
    const userId = req.user.id;
    const { status = "pending" } = req.query;
    const client = await pool.connect();

    let query;
    let params = userId;

    try {
      if (status === "finished") {
        query = `
        SELECT a.*
        FROM activities a JOIN check_ins ci ON a.id = ci.activity_id
        WHERE ci.user_id = $1 AND ci.status = 'attended'
        ORDER BY a.starts_at DESC
        `;
      } else if (status === "pending") {
        query = `
        SELECT a.*
        FROM activities a JOIN check_ins ci ON a.id = ci.activity_id
        WHERE ci.user_id = $1 AND ci.status IS NULL
        ORDER BY a.starts_at DESC
        `;
      } else {
        return res.status(400).json({ error: "Invalid status" });
      }
      const { rows } = await client.query(query, [params]);
      return res.json({ items: rows });
    } catch (error) {}
  },
};

export default checkInsController;
