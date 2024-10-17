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

app.post("/points", (req: Request, res: Response) => {
  const { name, user, game_mode } = req.body;

  console.log(name, user, game_mode);

  const insert = `CALL AddPoint(?,?,?)`;

  db.query(insert, [user, name, game_mode], (err, results) => {
    if (err) {
      console.error("Błąd podczas wykonywania zapytania:", err);
      return res
        .status(500)
        .json({ error: "Wystąpił błąd wewnętrzny serwera" });
    }

    res.status(200).json({ message: "Punkt dodany", results });
  });
});

app.get("/init", async (req: Request, res: Response) => {
  const initGames = `CALL fill_game_1()`;

  db.query(initGames, [], (err, results) => {
    if (err) {
      console.error("Błąd podczas wykonywania zapytania:", err);
      return res
        .status(500)
        .json({ error: "Wystąpił błąd wewnętrzny serwera" });
    }

    res.status(200).json({ message: "Init wywołany", results });
  });
});

app.get("/reset", async (req: Request, res: Response) => {
  const initGames = `CALL clear_game1()`;

  db.query(initGames, [], (err, results) => {
    if (err) {
      console.error("Błąd podczas wykonywania zapytania:", err);
      return res
        .status(500)
        .json({ error: "Wystąpił błąd wewnętrzny serwera" });
    }

    res.status(200).json({ message: "Init wywołany", results });
  });
});

app.get("/player", async (req: Request, res: Response) => {
  const { name } = req.query;

  const getUser = `CALL CheckUser(?)`;

  db.query(getUser, [name], (err, results) => {
    if (err) {
      console.error("Błąd podczas wykonywania zapytania:", err);
      return res
        .status(500)
        .json({ error: "Wystąpił błąd wewnętrzny serwera" });
    }

    res.status(200).json({ message: "Twój player", results });
  });
});

app.get("/points", async (req: Request, res: Response) => {
  const { name } = req.query;

  const canVote = `CALL CheckIsVoted(?)`;

  db.query(canVote, [name], (err, results) => {
    if (err) {
      console.error("Błąd podczas wykonywania zapytania:", err);
      return res
        .status(500)
        .json({ error: "Wystąpił błąd wewnętrzny serwera" });
    }

    res.status(200).json({ message: "Czy dodal", results });
  });
});

app.get("/users", async (req: Request, res: Response) => {
  const canVote = `CALL GetAllUsers()`;

  db.query(canVote, [], (err, results) => {
    if (err) {
      console.error("Błąd podczas wykonywania zapytania:", err);
      return res
        .status(500)
        .json({ error: "Wystąpił błąd wewnętrzny serwera" });
    }

    res.status(200).json({ message: "All users", results });
  });
});

app.get("/game_1", async (req: Request, res: Response) => {
  const { name } = req.query;

  const target = `CALL GetTarget(?)`;

  db.query(target, [name], (err, results) => {
    if (err) {
      console.error("Błąd podczas wykonywania zapytania:", err);
      return res
        .status(500)
        .json({ error: "Wystąpił błąd wewnętrzny serwera" });
    }

    res.status(200).json({ message: "There's target", results });
  });
});

app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
