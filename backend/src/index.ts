import express, { Express, Request, Response } from "express";
import cors from "cors";
import mysql from "mysql2";

const app: Express = express();

app.use(cors());

app.use(express.json());

const PORT = 8000;

const db = mysql.createConnection({
  host: "halloween_db",
  user: "root",
  password: "password",
  database: "halloween_db",
});

db.connect((err) => {
  if (err) {
    console.error("Nie można połączyć z bazą danych:", err);
    return;
  }
  console.log("Połączono z bazą danych MySQL");
});

app.post("/route", (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "Nieprawidłowe dane" });
  }

  res.status(201).json({ message: "Dane zostały przyjęte", name });
});

app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
