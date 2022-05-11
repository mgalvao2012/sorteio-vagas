const express = require("express");
const router = express.Router();
const { requiresAuth } = require("express-openid-connect");
const { pool } = require("../config");

router.get("/unidades", requiresAuth(), (request, response) => {
  // verifica se o usuario já definiu sua unidade para liberar o acesso a outras funcionalidades
  if (request.session.unidade_usuario == undefined) {
    let user_id = request.oidc.user.sub;
    pool.query(
      "SELECT codigo FROM vagas WHERE disponivel = true ORDER BY codigo;" +
        `SELECT * FROM unidades WHERE user_id = '${user_id}';` +
        "SELECT unidade FROM unidades WHERE user_id IS NULL ORDER BY unidade;",
      (error, results) => {
        if (error) {
          console.log(error.message);
        } else {
          if (
            results[1].rows[0] == undefined ||
            results[1].rows[0].unidade == null
          ) {
            response.render("meusdados.ejs", {
              user_id: user_id,
              email: request.oidc.user.email,
              name: request.oidc.user.name,
              unidade: null,
              vagas_escolhidas: null,
              mensagem: [
                "warning",
                "Atenção!",
                "Você precisa definir a sua unidade para ter acesso a outras funcionalidades!",
              ],
              lista_vagas: results[0].rows,
              lista_unidades: results[2].rows,
              vaga_sorteada: null,
              usuario_admin: request.session.usuario_admin,
            });
          } else {
            request.session.unidade_usuario = results[1].rows[0].unidade;
          }
        }
      }
    );
  }
  if (request.session.usuario_admin) {
    pool.query(
      "SELECT * FROM configuracao;" +
        "SELECT unidade, pne, adimplente, user_id FROM unidades ORDER BY unidade;",
      (error, results) => {
        if (error) {
          console.log(error.message);
        } else {
          if (results[0].rows[0] == undefined) {
            response.render("unidades.ejs", {
              email: request.oidc.user.email,
              name: request.oidc.user.name,
              lista_unidades: null,
              lista_ajustada_unidades: null,
              resultado_sorteio: null,
              mensagem: null,
              usuario_admin: request.session.usuario_admin,
            });
          } else {
            var mensagem;
            if (
              results[0].rows[0].resultado_sorteio != "Sorteio não realizado"
            ) {
              let ultimo_sorteio = util.formatDate(
                results[0].rows[0].ultimo_sorteio,
                1
              );
              mensagem = `As condições não podem ser alteradas porque o sorteio foi realizado em ${ultimo_sorteio}. É preciso reiniciar o processo!`;
            }
            let lista_unidades = []; // lista criada para facilitar o tratamento de presenca
            results[1].rows.forEach((row) => {
              lista_unidades.push(
                row.unidade +
                  "-" +
                  row.pne.toString() +
                  "-" +
                  row.adimplente.toString()
              );
            });
            response.render("unidades.ejs", {
              email: request.oidc.user.email,
              name: request.oidc.user.name,
              lista_unidades: results[1].rows,
              lista_ajustada_unidades: lista_unidades,
              resultado_sorteio: results[0].rows[0].resultado_sorteio,
              mensagem: mensagem,
              usuario_admin: request.session.usuario_admin,
            });
          }
        }
      }
    );
  } else {
    console.log("Você não está autorizado a acessar este recurso!");
    response.status(403).json({
      status: "error",
      message: "Você não está autorizado a acessar este recurso!",
    });
  }
});

router.post(
  "/unidades/atualizarPresenca",
  requiresAuth(),
  (request, response) => {
    if (request.session.usuario_admin) {
      const unidade = request.body.unidade;
      const presente = request.body.presente;
      const query = `UPDATE unidades SET presente = '${presente}' WHERE unidade = '${unidade}';`;
      console.log(query);
      pool.query(query, (error, results) => {
        if (error) {
          response.status(500).json({ status: "error", message: error });
        } else {
          response.status(200).json({
            status: "success",
            message: "registro atualizado com sucesso!",
          });
        }
      });
    } else {
      console.log("Você não está autorizado a acessar este recurso!");
      response.status(403).json({
        status: "error",
        message: "Você não está autorizado a acessar este recurso!",
      });
    }
  }
);

router.post("/unidades/atualizarPNE", requiresAuth(), (request, response) => {
  if (request.session.usuario_admin) {
    const unidade = request.body.unidade;
    const pne = request.body.pne;
    const query = `UPDATE unidades SET pne = '${pne}' WHERE unidade = '${unidade}';`;
    console.log(query);
    pool.query(query, (error, results) => {
      if (error) {
        response.status(500).json({ status: "error", message: error });
      } else {
        response.status(200).json({
          status: "success",
          message: "registro atualizado com sucesso!",
        });
      }
    });
  } else {
    console.log("Você não está autorizado a acessar este recurso!");
    response.status(403).json({
      status: "error",
      message: "Você não está autorizado a acessar este recurso!",
    });
  }
});

router.post(
  "/unidades/atualizarAdimplente",
  requiresAuth(),
  (request, response) => {
    if (request.session.usuario_admin) {
      const unidade = request.body.unidade;
      const adimplente = request.body.adimplente;
      const query = `UPDATE unidades SET adimplente = '${adimplente}' WHERE unidade = '${unidade}';`;
      console.log(query);
      pool.query(query, (error, results) => {
        if (error) {
          response.status(500).json({ status: "error", message: error });
        } else {
          response.status(200).json({
            status: "success",
            message: "registro atualizado com sucesso!",
          });
        }
      });
    } else {
      console.log("Você não está autorizado a acessar este recurso!");
      response.status(403).json({
        status: "error",
        message: "Você não está autorizado a acessar este recurso!",
      });
    }
  }
);

router.post("/unidades/liberarUnidade", requiresAuth(), (request, response) => {
  if (request.session.usuario_admin) {
    const unidade = request.body.unidade;
    const query = `UPDATE unidades SET user_id = NULL, vagas_escolhidas = NULL WHERE unidade = '${unidade}';`;
    console.log(query);
    pool.query(query, (error, results) => {
      if (error) {
        response.status(500).json({ status: "error", message: error });
      } else {
        response.status(200).json({
          status: "success",
          message: "registro atualizado com sucesso!",
        });
      }
    });
  } else {
    console.log("Você não está autorizado a acessar este recurso!");
    response.status(403).json({
      status: "error",
      message: "Você não está autorizado a acessar este recurso!",
    });
  }
});

module.exports = router;
