import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ===== CONFIG =====
const PORT = process.env.PORT || 3000;
const COG_API_KEY = process.env.COG_API_KEY || "";
const COG_BASE = "https://cog.api.br";
const PANEL_PASS = process.env.PANEL_PASS || "123456";

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ===== ROOT (EVITA LOOP) =====
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ===== PROTEÇÃO DO PAINEL =====
app.use((req, res, next) => {
  if (req.path.startsWith("/panel")) {
    const pass = req.headers["x-panel-pass"];
    if (!pass || pass !== PANEL_PASS) {
      return res.status(401).json({ success: false, message: "Não autorizado" });
    }
  }
  next();
});

// ===== STATUS =====
app.get("/panel/status", async (req, res) => {
  try {
    const r = await fetch(`${COG_BASE}/api/v1/status`, {
      headers: { "X-API-Key": COG_API_KEY },
    });
    const j = await r.json();
    res.json(j);
  } catch (e) {
    res.status(500).json({ error: "Erro ao consultar API" });
  }
});

// ===== START =====
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});