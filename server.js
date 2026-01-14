const express = require("express");
const path = require("path");

const app = express();

// Porta que o Render usa automaticamente
const PORT = process.env.PORT || 3000;

// Diz que a pasta "public" é pública
app.use(express.static(path.join(__dirname, "public")));

// Rota principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});