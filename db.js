import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.PORT,
});

try {
  const connection = await pool.getConnection();
  console.log("✅ Database connected successfully!");
  connection.release();
} catch (err) {
  console.error("❌ Database connection failed:", err.message);
}
