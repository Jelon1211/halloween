import express, { Express, Request, Response } from "express";
import cors from "cors";
import mysql, { RowDataPacket } from "mysql2";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
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

const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, uploadDir);
  },
  filename: (req: any, file: any, cb: any) => {
    let fileExt = path.extname(file.originalname);

    if (!fileExt) {
      switch (file.mimetype) {
        case "image/jpeg":
          fileExt = ".jpg";
          break;
        case "image/png":
          fileExt = ".png";
          break;
        case "image/gif":
          fileExt = ".gif";
          break;
        default:
          fileExt = ".jpg";
      }
    }

    const uniqueSuffix = uuidv4() + fileExt;
    console.log("Generowana nazwa pliku:", uniqueSuffix);
    cb(null, uniqueSuffix);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Niewłaściwy typ pliku"));
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

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

app.post("/upload", upload.single("photo"), (req: any, res: any) => {
  if (!req.file) {
    return res.status(400).json({ message: "Nie przesłano pliku" });
  }

  res.status(200).json({
    message: "Obraz został pomyślnie przesłany",
    file: req.file.filename,
  });
});

app.get("/upload", (req: Request, res: Response) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Błąd podczas odczytywania katalogu" });
    }

    const fileUrls = files.map((file) => {
      return {
        filename: file,
        url: `${req.protocol}://${req.get("host")}/${uploadDir}${file}`,
      };
    });

    res.status(200).json({ files: fileUrls });
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

app.use("/uploads", express.static(path.resolve("uploads")));

app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
