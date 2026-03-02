import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Database
  const db = new Database("database.db");
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pseudo TEXT UNIQUE,
      password TEXT
    )
  `);

  // Insert default users if not exists
  const insertUser = db.prepare("INSERT OR IGNORE INTO users (pseudo, password) VALUES (?, ?)");
  insertUser.run("layi", "1212");
  insertUser.run("samir", "1210");

  app.use(express.json());

  // API routes
  app.post("/api/login", (req, res) => {
    const { pseudo, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE pseudo = ? AND password = ?").get(pseudo, password);
    
    if (user) {
      res.json({ success: true, user: { pseudo: user.pseudo } });
    } else {
      res.status(401).json({ success: false, message: "Pseudo ou mot de passe incorrect" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
