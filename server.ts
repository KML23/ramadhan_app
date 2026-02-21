import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "ramadhan-global-secret-key-123";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- Auth Middleware ---
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // --- API Routes ---

  // Auth
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { name, email, password, country } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword, country },
      });
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);
      res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);
      res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Ibadah Logs
  app.get("/api/logs", authenticateToken, async (req: any, res) => {
    const logs = await prisma.ibadahLog.findMany({
      where: { userId: req.user.userId },
      orderBy: { date: 'desc' }
    });
    res.json(logs);
  });

  app.post("/api/logs", authenticateToken, async (req: any, res) => {
    const { date, subuh, dzuhur, ashar, maghrib, isya, puasa, tarawih, tadarusAyat } = req.body;
    const log = await prisma.ibadahLog.upsert({
      where: { userId_date: { userId: req.user.userId, date } },
      update: { subuh, dzuhur, ashar, maghrib, isya, puasa, tarawih, tadarusAyat },
      create: { userId: req.user.userId, date, subuh, dzuhur, ashar, maghrib, isya, puasa, tarawih, tadarusAyat },
    });
    res.json(log);
  });

  // Zakat
  app.post("/api/zakat", authenticateToken, async (req: any, res) => {
    const { type, amount } = req.body;
    const log = await prisma.zakatLog.create({
      data: { userId: req.user.userId, type, amount }
    });
    res.json(log);
  });

  // AI History
  app.get("/api/ai-history", authenticateToken, async (req: any, res) => {
    const history = await prisma.aIHistory.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(history);
  });

  app.post("/api/ai-history", authenticateToken, async (req: any, res) => {
    const { question, answer } = req.body;
    const log = await prisma.aIHistory.create({
      data: { userId: req.user.userId, question, answer }
    });
    res.json(log);
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
