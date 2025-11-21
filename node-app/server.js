import express from "express";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();
const app = express();
app.use(express.json());

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "API running" });
});

// Test DB connection route
app.get("/api/dbtest", async (req, res) => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await conn.query("SELECT 1 + 1 AS result");
    res.json(rows); // Should return { result: 2 }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("API running on port 3000"));
