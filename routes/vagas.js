const express = require("express");
const router = express.Router();
const { requiresAuth } = require("express-openid-connect");
const { pool } = require("../config");
const util = require("../util");

router.get("/vagas", requiresAuth(), (request, response) => {
  // verifica se o usuario já definiu sua unidade para liberar o acesso a outras funcionalidades
  if (request.session.unidade_usuario == undefined) {
    let user_id = request.oidc.user.sub;
    pool.query(
      `SELECT codigo FROM vagas WHERE disponivel = true ORDER BY codigo;
       SELECT * FROM unidades WHERE user_id = '${user_id}';
       SELECT unidade FROM unidades WHERE user_id IS NULL ORDER BY unidade;`,
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
  // verifica se a unidade foi prenchida pela leitura no banco de dados no passo anterior
  var mensagem = request.flash("success");
  let user_id = request.oidc.user.sub;
  pool.query(
    `SELECT * FROM configuracao;
                SELECT codigo, disponivel FROM vagas ORDER BY codigo;`,
    (error, results) => {
      if (error) {
        console.log(error.message);
      } else {
        if (results[0].rows[0] == undefined) {
          response.render("vagas.ejs", {
            email: request.oidc.user.email,
            name: request.oidc.user.name,
            ultimo_sorteio: null,
            resultado_sorteio: null,
            lista_vagas: null,
            lista_ajustada_vagas: null,
            mensagem: null,
            usuario_admin: request.session.usuario_admin,
          });
        } else {
          let ultimo_sorteio = util.formatDate(
            results[0].rows[0].ultimo_sorteio,
            1
          );
          var mensagem;
          if (results[0].rows[0].resultado_sorteio != "Sorteio não realizado") {
            let ultimo_sorteio = util.formatDate(
              results[0].rows[0].ultimo_sorteio,
              1
            );
            mensagem = `As condições não podem ser alteradas porque o sorteio foi realizado em ${ultimo_sorteio}. É preciso reiniciar o processo!`;
          }
          let lista_vagas = []; // lista criada para facilitar o tratamento da vaga
          results[1].rows.forEach((row) => {
            lista_vagas.push(row.codigo + "-" + row.disponivel.toString());
          });
          response.render("vagas.ejs", {
            email: request.oidc.user.email,
            name: request.oidc.user.name,
            ultimo_sorteio: ultimo_sorteio,
            resultado_sorteio: results[0].rows[0].resultado_sorteio,
            lista_vagas: results[1].rows,
            lista_ajustada_vagas: lista_vagas,
            mensagem: ["warning", "Atenção!", mensagem],
            usuario_admin: request.session.usuario_admin,
          });
        }
      }
    }
  );
});

router.post(
  "/vagas/atualiza_disponibilidade",
  requiresAuth(),
  (request, response) => {
    if (request.session.usuario_admin) {
      const codigo = request.body.codigo;
      const disponivel = request.body.disponivel;
      const query = `UPDATE vagas SET disponivel = '${disponivel}' WHERE codigo = '${codigo}';`;
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

module.exports = router;
