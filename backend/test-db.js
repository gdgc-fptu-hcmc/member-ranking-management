import "dotenv/config";
import { pool } from "./src/config/connectDB.js";

(async () => {
  try {
    const r = await pool.query("select 1 as ok");
    console.log("✅ DB CONNECT OK:", r.rows);
    process.exit(0);
  } catch (e) {
    console.error("❌ DB CONNECT FAIL:", e.message);
    process.exit(1);
  }
})();
