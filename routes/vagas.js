const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const { requiresAuth } = require("express-openid-connect");
const { pool } = require("../config");
const util = require("../util");

router.get( "/vagas", requiresAuth(), async (request, response) => {
  util.usuarioDefiniuUnidade(request, response)
    .then((retorno) => {
      if (retorno == 'OK') {
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
                  ultimo_sorteio = util.formatDate(
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
      }
    })
});

router.post(
  "/vagas/atualiza_disponibilidade",
  [
    check("codigo")
      .isLength({ min: 5, max: 5 })
      .withMessage("O parâmetro código não está corretamente preenchido (tamanho)")      
      .matches(/S[1|2]G\d{2}/)
      .withMessage("O parâmetro código não está corretamente preenchido (formato)")      
      .trim(),
    check("disponivel")
      .matches(/true|false/)
      .withMessage("O parâmetro disponível não está corretamente preenchido (formato)")      
      .trim()
  ],
  requiresAuth(),
  (request, response) => {
    const _error = validationResult(request).formatWith(({ msg }) => msg);
    const hasError = !_error.isEmpty();
    if (hasError) {
      response.status(422).json({ error: _error.array() });
    } else {
      if (request.session.usuario_admin) {
        const codigo = request.body.codigo;
        const disponivel = request.body.disponivel;
        pool.query('UPDATE vagas SET disponivel = $1 WHERE codigo = $2;', 
          [disponivel, codigo], function(error, _results) {
          if (error) {
            console.log(error);
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
  }
);

module.exports = router;