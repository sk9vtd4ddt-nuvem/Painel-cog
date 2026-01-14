import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});



const COG_API_KEY = process.env.COG_API_KEY; // key fica no Render (seguro)
const COG_BASE = "https://cog.api.br";

// Proteção simples: senha para acessar o painel
const PANEL_PASS = process.env.PANEL_PASS || "1234";

// middleware de proteção
app.use((req, res, next) => {
  if (req.path.startsWith("/panel")) {
    const pass = req.headers["x-panel-pass"];
    if (!pass || pass !== PANEL_PASS) {
      return res.status(401).json({ success: false, message: "Senha do painel inválida." });
    }
  }
  next();
});

// status
app.get("/panel/status", async (req, res) => {
  try {
    const r = await fetch(`${COG_BASE}/api/v1/consulta/status`, {
      headers: { "X-API-Key": COG_API_KEY }
    });
    const j = await r.json().catch(() => ({}));
    res.status(r.status).json(j);
  } catch (e) {
    res.status(500).json({ success: false, message: "Erro no servidor." });
  }
});

// consulta
app.get("/panel/consulta", async (req, res) => {
  try {
    const { type, dados } = req.query;
    if (!type || !dados) return res.status(400).json({ success: false, message: "type e dados são obrigatórios" });

    const url = `${COG_BASE}/api/v1/consulta?type=${encodeURIComponent(type)}&dados=${encodeURIComponent(dados)}`;
    const r = await fetch(url, { headers: { "X-API-Key": COG_API_KEY } });
    const j = await r.json().catch(() => ({}));
    res.status(r.status).json(j);
  } catch (e) {
    res.status(500).json({ success: false, message: "Erro no servidor." });
  }
});

app.listen(process.env.PORT || 3000, () => console.log("Painel rodando"));
