import express, { Express, Request, Response } from "express";
import cors from "cors";
import mysql, { RowDataPacket } from "mysql2";

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

  const insert = `CALL InsertUser(?)`;

  db.query(insert, [name], (err, results) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res
          .status(400)
          .json({ message: "Użytkownik o takiej nazwie już istnieje" });
      }

      console.error("Błąd podczas wykonywania zapytania:", err);
      return res
        .status(500)
        .json({ error: "Wystąpił błąd wewnętrzny serwera" });
    }

    res.status(201).json({ message: "Użytkownik został dodany", results });
  });
});

app.post("/login", (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "Nieprawidłowe dane" });
  }

  const insert = `CALL CheckUser(?)`;

  db.query(insert, [name], (err, results) => {
    if (err) {
      console.error("Błąd podczas wykonywania zapytania:", err);
      return res
        .status(500)
        .json({ error: "Wystąpił błąd wewnętrzny serwera" });
    }

    res.status(200).json({ message: "Użytkownik istnieje", results });
  });
});

app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
