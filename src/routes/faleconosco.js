require("dotenv").config();
const express = require("express");
const router = express.Router();
const util = require("../util");
const rateLimit = require("express-rate-limit");

// limita chamadas das urls para bloquear ataques
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 2, // 2 requests,
});

router.post("/faleconosco", limiter, (request, response) => {
  const nome = request.body.nome;
  const email = request.body.email;
  const assunto = request.body.assunto;
  const mensagem = request.body.mensagem;
  if (nome == undefined || email == undefined || assunto == undefined || mensagem == undefined) {
    console.log("Parâmetro não fornecidos corretamente. Email não enviado!");
    response.status(500).json({
      status: "error",
      message: "Parâmetro não fornecidos corretamente. Email não enviado!",
    });
  } else {    
    util.enviarEmailHTML(
      process.env.EMAIL_FALECONOSCO,
      "Formulário Fale Conosco - Sorteio Vagas GLI",
      `Nome: ${nome} <br/>Email: ${email} <br/>Assunto: ${assunto} <br/>Mensagem: ${mensagem}`
    );
    response
      .status(200)
      .json({ status: "success", message: "Email enviado com sucesso!" });
  }
});

module.exports = router;
