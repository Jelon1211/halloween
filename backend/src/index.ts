import express, { Express, Request, Response } from "express";
import cors from "cors";
import mysql, { RowDataPacket } from "mysql2";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { questIds, questList } from "./data/quests";
const app: Express = express();

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = 8000;

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.on("error", (err) => {
  console.error("Błąd połączenia z MySQL:", err);
  if (err.code === "PROTOCOL_CONNECTION_LOST") {
    console.log(
      "Połączenie z bazą danych zostało utracone, ponawianie połączenia..."
    );
    // Implementacja ponownego połączenia
  }
});

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
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

    const name = req.body.name ? req.body.name.replace(/\s+/g, "_") : "default";
    const uniqueSuffix = `${uuidv4()}_${name}${fileExt}`;
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

app.post("/upload", (req: any, res: any) => {
  // Uruchamiamy multer
  upload.single("photo")(req, res, (err: any) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const { name } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Nie przesłano pliku" });
    }

    res.status(200).json({
      message: "Obraz został pomyślnie przesłany",
      file: req.file.filename,
    });
  });
});

app.get("/upload", (req, res) => {
  if (!fs.existsSync(uploadDir)) {
    return res.status(404).json({ message: "Brak zdjęć" });
  }

  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Błąd podczas odczytywania katalogu" });
    }

    const fileUrls = files.map((file) => {
      return {
        filename: file,
        url: `${req.protocol}://${req.get("host")}/uploads/${file}`,
      };
    });

    res.status(200).json({ files: fileUrls });
  });
});

app.get("/init", async (req: Request, res: Response) => {
  try {
    const [users]: any = await db.promise().query("CALL GetAllUsers()");

    const userIds = users[0].map((user: { id: any }) => user.id);

    let availableTargets = [...userIds];
    let targetCount = availableTargets.length;

    let availableQuests = [...questList];
    let availableQuestIds = [...questIds];

    for (let i = 0; i < userIds.length; i++) {
      const u_id = userIds[i];

      const questRandomIndex = Math.floor(
        Math.random() * availableQuests.length
      );
      const currentQuest = availableQuests[questRandomIndex];
      const currentQuestId = availableQuestIds[questRandomIndex];

      availableQuests.splice(questRandomIndex, 1);
      availableQuestIds.splice(questRandomIndex, 1);

      if (availableQuests.length === 0) {
        availableQuests = [...questList];
        availableQuestIds = [...questIds];
      }

      let t_id = availableTargets[Math.floor(Math.random() * targetCount)];

      if (t_id === u_id) {
        const filteredTargets = availableTargets.filter((id) => id !== u_id);
        t_id =
          filteredTargets[Math.floor(Math.random() * filteredTargets.length)];
      }

      const insert = `CALL insert_game_1_data(?, ?, ?, ?)`;
      await db
        .promise()
        .query(insert, [u_id, t_id, currentQuest, currentQuestId]);

      availableTargets = availableTargets.filter((id) => id !== t_id);
      targetCount--;

      if (targetCount === 0) {
        availableTargets = [...userIds];
        targetCount = availableTargets.length;
      }
    }

    res.status(200).json({ message: "Zadania zostały przypisane losowo." });
  } catch (error) {
    console.error("Błąd podczas wykonywania zapytania:", error);
    res.status(500).json({ error: "Wystąpił błąd wewnętrzny serwera" });
  }
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

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
