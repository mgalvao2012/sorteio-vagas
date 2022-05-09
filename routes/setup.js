const express = require("express");
const router = express.Router();
const { requiresAuth } = require("express-openid-connect");
const { pool } = require("../config");
const util = require("../util");
const fs = require('fs');

// Gera secret para gerar chaves de desbloqueio de operações (setup)
var speakeasy = require("speakeasy");
var secretTOTP = speakeasy.generateSecret({ length: 20 });

function gerarToken(usuario_admin) {
  if (usuario_admin) {
    return speakeasy.totp({
      secret: secretTOTP.base32,
      encoding: "base32",
      step: 60,
      window: 3,
    });
  } else {
    console.log("Você não está autorizado a acessar este recurso!");
    response.status(403).json({
      status: "error",
      message: "Você não está autorizado a acessar este recurso!",
    });
  }
}

router.get("/setup", requiresAuth(), (request, response) => {
  if (request.session.usuario_admin) {
    response.render("setup.ejs", {
      email: request.oidc.user.email,
      name: request.oidc.user.name,
      usuario_admin: request.session.usuario_admin,
      mensagem: ["warning", "Atenção!", "Esta operação é irreversível!"],
    });
  } else {
    console.log("Você não está autorizado a acessar este recurso!");
    response.status(403).json({
      status: "error",
      message: "Você não está autorizado a acessar este recurso!",
    });
  }
});

router.get("/setup/gerarToken", requiresAuth(), (request, response) => {
  if (request.session.usuario_admin) {
    var token = gerarToken(true);
    //console.log(new Date().toJSON()+' - '+token);
    util.enviarEmail(
      request.oidc.user.email,
      "Código para autorização",
      `Utilize este código ${token} para autorizar a conclusão do setup do Sorteio de Vagas de Estacionamento do Condomínio Grandlife Ipiranga`
    );
    response
      .status(200)
      .json({ status: "success", message: "Token gerado com sucesso!" });
  } else {
    console.log("Você não está autorizado a acessar este recurso!");
    response.status(403).json({
      status: "error",
      message: "Você não está autorizado a acessar este recurso!",
    });
  }
});

router.post("/setup", requiresAuth(), (request, response) => {
  if (request.session.usuario_admin == true) {
    var chave = request.body.chave;
    var tokenValidates = speakeasy.totp.verify({
      secret: secretTOTP.base32,
      encoding: "base32",
      token: chave,
      step: 60,
      window: 3,
    });
    if (tokenValidates) {
      fs.readFile("init.sql", "utf8", function (error, data) {
        if (error) {
          response
            .status(500)
            .json({ status: "error", message: error.message });
        } else {
          const query = data;
          pool.query(query, (error, results) => {
            if (error) {
              response
                .status(500)
                .json({ status: "error", message: error.message });
            } else {
              console.log("Setup finalizado com sucesso!");
              response.render("setup.ejs", {
                email: request.oidc.user.email,
                name: request.oidc.user.name,
                usuario_admin: request.session.usuario_admin,
                mensagem: [
                  "success",
                  "Sucesso!",
                  "Setup finalizado com sucesso!",
                ],
              });
            }
          });
        }
      });
    } else {
      response.render("setup.ejs", {
        email: request.oidc.user.email,
        name: request.oidc.user.name,
        usuario_admin: request.session.usuario_admin,
        mensagem: [
          "warning",
          "Atenção",
          "A chave informada não é válida ou está expirada!",
        ],
      });
    }
  } else {
    console.log("Você não está autorizado a acessar este recurso!");
    response.status(403).json({
      status: "error",
      message: "Você não está autorizado a acessar este recurso!",
    });
  }
});

module.exports = router;
