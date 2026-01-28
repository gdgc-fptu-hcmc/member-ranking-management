import { pool } from "../config/connectDB.js";
import crypto from "crypto";


const gemLogsController = {
  // GET /v1/gem-logs/users/:id (admin only)
  getUserGemLogs: async (req, res) => {
    try {
      const { id } = req.params;

      const page = Math.max(parseInt(req.query.page || "1"), 1);

      const limit = Math.min(
        Math.max(parseInt(req.query.limit || "20"), 1),
        100,
      );
      const offset = (page - 1) * limit;

      const countResult = await pool.query(
        `
        select count(*)::int as total
        from gem_logs
        where user_id = $1
        `,
        [id],
      );

      const total = countResult.rows[0]?.total ?? 0;

      const result = await pool.query(
        `
        SELECT gl.id, gl.amount, gl.reason, gl.source_kind, gl.activity_id, a.title AS activity_title, a.type AS activity_type, gl.created_at 
        FROM gem_logs gl LEFT JOIN activities a ON gl.activity_id = a.id 
        WHERE gl.user_id = $1 
        ORDER BY gl.created_at DESC 
        LIMIT $2 OFFSET $3 
        `,
        [id, limit, offset],
      );

      return res.status(200).json({
        page,
        limit,
        total,
        items: result.rows,
      });
    } catch (error) {
      console.log("Get user's GemLogs error: ", error);
      return res.status(500).json({ error: error.message });
    }
  },
  // POST /v1/gem-logs/users/:id/adjust-gem(admin only)
  adjustUserGems: async (req, res) => {
    const client = await pool.connect();
    let inTx = false;
    try {
      const { id } = req.params;

      const {
        sign,
        amount,
        reason,
        activityId,
        evidenceUrls,
        idempotencyKey: bodyKey,
      } = req.body;

      //validation
      if (sign !== "+" && sign !== "-")
        return res.status(400).json({ error: "Invalid sign" });
      if (!amount || Number(amount) <= 0)
        return res.status(400).json({ error: "Invalid amount" });
      if (!reason || !reason.trim())
        return res.status(400).json({ error: "Reason can not be empty" });

      const amt = Number(amount);
      const delta = sign === "+" ? amt : -amt;
      const evidence = Array.isArray(evidenceUrls) ? evidenceUrls : [];

      const idempotencyKey = bodyKey || crypto.randomUUID();

      // Transaction
      await client.query("BEGIN");
      inTx = true;

      // Check user exists
      const userRes = await client.query(
        `SELECT total_gems FROM users WHERE id = $1`,
        [id],
      );
      if (userRes.rowCount === 0) {
        await client.query("ROLLBACK");
        inTx = false;
        return res.status(404).json({ error: "User not found" });
      }

      // Insert gem_logs
      let logRow;
      try {
        const insertRes = await client.query(
          `
                INSERT INTO gem_logs (user_id, amount, reason, source_kind, activity_id, evidence, idempotency_key) 
                VALUES ($1, $2, $3, 'manual', $4, $5, $6) 
                RETURNING id, amount, created_at
                `,
          [
            id,
            delta,
            reason.trim(),
            activityId || null,
            evidence,
            idempotencyKey,
          ],
        );
        logRow = insertRes.rows[0];
      } catch (error) {
        // Duplicate idempotency_key
        if (error.code === "23505") {
            //Select the previous log
          const oldLog = await client.query(
            `SELECT id, amount, created_at
           FROM gem_logs
           WHERE idempotency_key = $1`,
            [idempotencyKey],
          );
          // Select total gem 
          const curUser = await client.query(
            `SELECT total_gems FROM users WHERE id = $1`,
            [id],
          );
          // Cancel transaction
          await client.query("ROLLBACK");
          inTx = false;

          return res.status(200).json({
            message: "Duplicate submission (idempotent)",
            log: oldLog.rows[0] || null,
            newTotalGems: curUser.rows[0]?.total_gems ?? null,
          });
        }
        throw error;
      }

      //Update users.total_gems
      const updateRes = await client.query(
        `
        UPDATE users
        SET total_gems = total_gems + $1, updated_at = now() 
        WHERE id = $2
        RETURNING total_gems
        `,[delta, id]
      );
      await client.query("COMMIT");
      inTx = false;
      return res.status(201).json({
        id,
        delta,
        newTotalGems: updateRes.rows[0].total_gems,
        logId: logRow.id,
      });
    } catch (error) {
        if(inTx) await client.query("ROLLBACK");
        console.log("Adjust gems error:", error);
        return res.status(500).json({ error: error.message});
    } finally{
        client.release();
    }
  },
};
export default gemLogsController;
