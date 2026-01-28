import { pool } from "../config/connectDB.js";
import bcrypt from "bcrypt";

const userController = {
  // =========================================================
  // ADMIN ENDPOINTS
  // =========================================================

  // GET /v1/users - Get all users (Admin only)
  getAllUsers: async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT 
          id, username, email, roles, club_role, 
          total_gems, regular_session_count, is_active,
          join_club_at, avatar, is_male, address,
          created_at, updated_at
        FROM users 
        ORDER BY created_at DESC`,
      );

      return res.status(200).json({ users: rows });
    } catch (error) {
      console.log("Get all users error: ", error);
      return res.status(500).json({ error: error.message });
    }
  },

  // POST /v1/users - Create new user (Admin only)
  createUser: async (req, res) => {
    try {
      const {
        username,
        email,
        password,
        avatar,
        isMale,
        address,
        clubRole,
        roles,
      } = req.body;

      if (!username || !email || !password) {
        return res
          .status(400)
          .json({ error: "username, email, password are required" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);

      // Set default roles if not provided
      const userRoles = roles || ["member"];

      const { rows } = await pool.query(
        `
        INSERT INTO users
        (username, email, password, avatar, is_male, address, club_role, roles)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING 
          id, username, email, roles, club_role, 
          total_gems, regular_session_count, is_active,
          join_club_at, avatar, is_male, address,
          created_at, updated_at;
        `,
        [
          username,
          email,
          hashed,
          avatar || null,
          isMale || null,
          address || null,
          clubRole || null,
          userRoles,
        ],
      );

      return res.status(201).json({ user: rows[0] });
    } catch (error) {
      // Duplicate username/email
      if (error.code === "23505") {
        return res
          .status(400)
          .json({ error: "Username or email has already existed" });
      }
      console.log("Create user error: ", error);
      return res.status(500).json({ error: error.message });
    }
  },

  // DELETE /v1/users/:id - Delete user (Admin only)
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;

      const { rows } = await pool.query(
        "DELETE FROM users WHERE id = $1 RETURNING id, username",
        [id],
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({
        message: "User deleted successfully",
        deletedUser: rows[0],
      });
    } catch (error) {
      console.log("Delete user error: ", error);
      return res.status(500).json({ error: error.message });
    }
  },
  
  //
  // =========================================================
  // SELF ENDPOINTS
  // =========================================================

  // GET /v1/users/me - Get current user info
  getMe: async (req, res) => {
    try {
      const userId = req.user.id;

      const { rows } = await pool.query(
        `SELECT 
          id, username, email, roles, club_role, 
          total_gems, regular_session_count, is_active,
          join_club_at, avatar, is_male, address,
          created_at, updated_at
        FROM users 
        WHERE id = $1`,
        [userId],
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({ user: rows[0] });
    } catch (error) {
      console.log("Get me error: ", error);
      return res.status(500).json({ error: error.message });
    }
  },

  // POST /v1/users/me - Update current user info
  updateMe: async (req, res) => {
    try {
      const userId = req.user.id;
      const { avatar, isMale, address, clubRole } = req.body;

      // Build dynamic update query
      const updates = [];
      const values = [];
      let paramCount = 1;

      if (avatar !== undefined) {
        updates.push(`avatar = $${paramCount++}`);
        values.push(avatar);
      }
      if (isMale !== undefined) {
        updates.push(`is_male = $${paramCount++}`);
        values.push(isMale);
      }
      if (address !== undefined) {
        updates.push(`address = $${paramCount++}`);
        values.push(address);
      }
      if (clubRole !== undefined) {
        updates.push(`club_role = $${paramCount++}`);
        values.push(clubRole);
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: "No fields to update" });
      }

      values.push(userId);

      const { rows } = await pool.query(
        `
        UPDATE users 
        SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $${paramCount}
        RETURNING 
          id, username, email, roles, club_role, 
          total_gems, regular_session_count, is_active,
          join_club_at, avatar, is_male, address,
          created_at, updated_at;
        `,
        values,
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({ user: rows[0] });
    } catch (error) {
      console.log("Update me error: ", error);
      return res.status(500).json({ error: error.message });
    }
  },

  // =========================================================
  // PUBLIC ENDPOINTS
  // =========================================================

  // GET /v1/users/ranking - Get leaderboard
  getRanking: async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT 
          id, username, avatar, club_role, total_gems, roles
        FROM users 
        WHERE is_active = true
        ORDER BY total_gems DESC, created_at ASC
        LIMIT 100`,
      );

      return res.status(200).json({ ranking: rows });
    } catch (error) {
      console.log("Get ranking error: ", error);
      return res.status(500).json({ error: error.message });
    }
  },

  // GET /v1/users/:id - Get user profile with activity history
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;

      // Get user basic info
      const { rows: userRows } = await pool.query(
        `SELECT 
          id, username, email, roles, club_role, 
          total_gems, regular_session_count, is_active,
          join_club_at, avatar, is_male, address,
          created_at, updated_at
        FROM users 
        WHERE id = $1`,
        [id],
      );

      if (userRows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const user = userRows[0];

      // Get user's gem logs (activity history)
      const { rows: gemLogs } = await pool.query(
        `SELECT 
          gl.id, gl.amount, gl.reason, gl.source_kind,
          gl.activity_id, gl.checkin_id, gl.claim_id,
          gl.evidence, gl.created_at,
          a.title as activity_title, a.type as activity_type
        FROM gem_logs gl
        LEFT JOIN activities a ON gl.activity_id = a.id
        WHERE gl.user_id = $1
        ORDER BY gl.created_at DESC
        LIMIT 50`,
        [id],
      );

      // Get user's check-ins count
      const { rows: checkInStats } = await pool.query(
        `SELECT 
          COUNT(*) as total_checkins,
          COUNT(CASE WHEN status = 'attended' THEN 1 END) as attended_count,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count
        FROM check_ins
        WHERE user_id = $1`,
        [id],
      );

      // Remove sensitive fields for public view
      const { email, ...publicUser } = user;

      return res.status(200).json({
        user: publicUser,
        activityHistory: gemLogs,
        stats: {
          totalCheckIns: parseInt(checkInStats[0]?.total_checkins || 0),
          attendedCount: parseInt(checkInStats[0]?.attended_count || 0),
          pendingCount: parseInt(checkInStats[0]?.pending_count || 0),
        },
      });
    } catch (error) {
      console.log("Get user by id error: ", error);
      return res.status(500).json({ error: error.message });
    }
  },
};

export default userController;
