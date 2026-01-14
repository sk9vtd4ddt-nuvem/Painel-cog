import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/status", async (req, res) => {
  try {
    const { key } = req.query;

    if (!key) {
      return res.json({
        success: false,
        message: "Key não enviada"
      });
    }

    // 🔍 TESTE DA VARIÁVEL
    if (!process.env.COG_API_KEY) {
      return res.json({
        success: false,
        message: "COG_API_KEY NÃO CHEGOU NO BACKEND"
      });
    }

    // 🔥 TESTE CONTROLADO (sem COG ainda)
    return res.json({
      success: true,
      message: "Backend OK",
      key_recebida: key,
      cog_key_existe: true
    });

  } catch (err) {
    return res.json({
      success: false,
      error: err.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando");
});