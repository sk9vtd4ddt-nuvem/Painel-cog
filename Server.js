import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// Ajuste do __dirname (necessário no Render quando usa "type": "module")
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Variáveis de ambiente
const PORT = process.env.PORT || 3000;
const COG_API_KEY = process.env.COG_API_KEY; // coloque no Render (Environment Variables)
const PANEL_PASS = process.env.PANEL_PASS || "123456"; // senha do painel
const COG_BASE = "https://cog.api.br";

app.use(express.json());

// Servir arquivos do painel (public/)
app.use(express.static(path.join(__dirname, "public")));

// Rota principal (ESSENCIAL para não ficar em loop no Render)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Proteção simples para as rotas do painel (não expõe sua key)
app.use("/panel", (req, res, next) => {
  const pass = req.headers["x-panel-pass"];
  if (!pass || pass !== PANEL_PASS) {
    return res.status(401).json({ success: false, message: "Senha do painel inválida." });
  }
  next();
});

// Status da API / Telegram
app.get("/panel/status", async (req, res) => {
  try {
    if (!COG_API_KEY) {
      return res.status(500).json({ success: false, message: "COG_API_KEY não configurada no Render." });
    }

    const r = await fetch(`${COG_BASE}/api/v1/consulta/status`, {
      method: "GET",
      headers: {
        "X-API-Key": COG_API_KEY
      }
    });

    const j = await r.json().catch(() => ({}));
    return res.status(r.status).json(j);
  } catch (e) {
    return res.status(500).json({ success: false, message: "Erro no servidor ao consultar status." });
  }
});

// Executar consulta
app.get("/panel/consulta", async (req, res) => {
  try {
    if (!COG_API_KEY) {
      return res.status(500).json({ success: false, message: "COG_API_KEY não configurada no Render." });
    }

    const { type, dados } = req.query;
    if (!type || !dados) {
      return res.status(400).json({ success: false, message: "Parâmetros obrigatórios: type e dados." });
    }

    const url = `${COG_BASE}/api/v1/consulta?type=${encodeURIComponent(type)}&dados=${encodeURIComponent(dados)}`;

    const r = await fetch(url, {
      method: "GET",
      headers: {
        "X-API-Key": COG_API_KEY
      }
    });

    const j = await r.json().catch(() => ({}));
    return res.status(r.status).json(j);
  } catch (e) {
    return res.status(500).json({ success: false, message: "Erro no servidor ao executar consulta." });
  }
});

app.listen(PORT, () => {
  console.log("Painel rodando na porta", PORT);
});