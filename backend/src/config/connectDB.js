import pkg, { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:{ rejectUnauthorized: false},
});

pool.on("connect", ()=>{
    console.log("Connected to pgSql");
})