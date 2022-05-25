const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const { requiresAuth } = require("express-openid-connect");
const { pool } = require("../config");

async function consultarDados(unidade) {
  try {
    // query1: verifica se o usuário já definiu sua unidade
    let myPromiseUnidadesResult,
      myPromiseVagasResult,
      myPromiseUnidadesSemUsuarioResult;
    let myPromiseUnidades = new Promise(function (resolve) {
      resolve(
        pool.query("SELECT user_id FROM unidades WHERE unidade = $1", [unidade])
      );
    });
    myPromiseUnidadesResult = await myPromiseUnidades;

    // query2: consulta todas as vagas disponiveis
    let myPromiseVagas = new Promise(function (resolve) {
      resolve(
        pool.query(
          "SELECT codigo FROM vagas WHERE disponivel = true ORDER BY codigo"
        )
      );
    });
    myPromiseVagasResult = await myPromiseVagas;

    // query3: consulta todas as unidades que ainda não foram selecionadas por usuários
    let myPromiseUnidadesSemUsuario = new Promise(function (resolve) {
      resolve(
        pool.query(
          "SELECT unidade FROM unidades WHERE user_id IS NULL ORDER BY unidade"
        )
      );
    });
    myPromiseUnidadesSemUsuarioResult = await myPromiseUnidadesSemUsuario;

    return [
      myPromiseUnidadesResult,
      myPromiseVagasResult,
      myPromiseUnidadesSemUsuarioResult,
    ];
  } catch (err) {
    console.log(err);
  }
}

const getMeusdados = (request, response) => {
  return new Promise((resolve, reject) => {
    // mensagem preenchida quando é realizada a atualização dos dados
    // na sequencia é retirada da sessão para evitar apresentá-la sem atualização nos dados
    var mensagem = request.session.meusdadosMensagem;
    request.session.meusdadosMensagem = "";
    let user_id = request.oidc.user.sub;
    pool.query(
      `SELECT codigo FROM vagas WHERE disponivel = true ORDER BY codigo;
       SELECT * FROM unidades WHERE user_id = '${user_id}';
       SELECT unidade FROM unidades WHERE user_id IS NULL ORDER BY unidade;`,
      (error, results) => {
        if (error) {
          console.log(error.message);
          reject(error.message);
          return;
        } else {
          //console.log('results[2].rows[0] '+results[2].rows[0].unidade)
          if (results[1].rows[0] == undefined) {
            response.render("meusdados.ejs", {
              user_id: user_id,
              email: request.oidc.user.email,
              name: request.oidc.user.name,
              unidade: null,
              vagas_escolhidas: null,
              mensagem: null,
              lista_vagas: results[0].rows,
              lista_unidades: results[2].rows,
              vaga_sorteada: null,
              usuario_admin: request.session.usuario_admin,
            });
          } else {
            // converte de '[{"vaga": "S1G27"},{"vaga": "S1G28"}]' -> ['S1G27, S1G28']
            let vagas_escolhidas_array = results[1].rows[0].vagas_escolhidas;
            let vagas_escolhidas = [];
            // console.log('vagas_escolhidas_array '+vagas_escolhidas_array)
            if (vagas_escolhidas_array != null) {
              vagas_escolhidas_array.forEach((item) => {
                vagas_escolhidas.push(item.vaga);
              });
            }
            response.render("meusdados.ejs", {
              user_id: user_id,
              email: request.oidc.user.email,
              name: request.oidc.user.name,
              unidade: results[1].rows[0].unidade,
              vagas_escolhidas: vagas_escolhidas,
              mensagem: ["success", "Informação!", mensagem],
              lista_vagas: results[0].rows,
              lista_unidades: results[2].rows,
              vaga_sorteada: results[1].rows[0].vaga_sorteada,
              usuario_admin: request.session.usuario_admin,
            });
          }
          resolve("ok");
        }
      }
    );
  });
};

router.get("/meusdados", requiresAuth(), (request, response) => {
  getMeusdados(request, response);
});

router.post(
  "/meusdados",
  [
    check("unidade")
      .isLength({ min: 5, max: 5 })
      .withMessage(
        "O parâmetro unidade não está corretamente preenchido (tamanho)"
      )
      .matches(/T[1|2][0-2]\d[1-4]/)
      .withMessage(
        "O parâmetro unidade não está corretamente preenchido (formato)"
      )
      .trim(),
  ],
  requiresAuth(),
  async function (request, response) {
    const error = validationResult(request).formatWith(({ msg }) => msg);
    const hasError = !error.isEmpty();
    if (hasError) {
      response.status(422).json({ error: error.array() });
    } else {
      var user_id = request.oidc.user.sub;
      var unidade = request.body.unidade;
      console.log("unidade " + unidade);
      console.log(
        "request.session.unidade_usuario " + request.session.unidade_usuario
      );
      console.log(
        `Vagas escolhidas pela unidade ${unidade} [${request.body.vagas_escolhidas}]`
      );
      var vagas_escolhidas_array = [];
      var vagas_escolhidas = null;
      if (request.body.vagas_escolhidas.length > 0) {
        let vagas_escolhidas_preenchida =
          request.body.vagas_escolhidas.split(",");
        if (vagas_escolhidas_preenchida.length > 0) {
          vagas_escolhidas_preenchida.forEach((vaga) => {
            vagas_escolhidas_array.push({ vaga: vaga });
          });
          vagas_escolhidas = JSON.stringify(vagas_escolhidas_array);
        }
      }

      var results_unidade;
      var results_vagas_disponiveis;
      var results_unidades_disponiveis;

      consultarDados(unidade).then((retorno) => {
        results_unidade = retorno[0];
        results_vagas_disponiveis = retorno[1].rows;
        results_unidades_disponiveis = retorno[2].rows;
      });

      console.log(
        `query UPDATE unidades SET user_id = '${user_id}', vagas_escolhidas = ${vagas_escolhidas} `+
        `WHERE unidade = '${unidade}' RETURNING *;`
      );
      pool.query(
        "UPDATE unidades SET user_id = $1, vagas_escolhidas = $2 WHERE unidade = $3 RETURNING *;",
        [user_id, vagas_escolhidas, unidade],
        (error, results) => {
          if (error) {
            console.log("erro: " + error.message);
          } else {
            if (results.rowCount == 0) {
              response.render("meusdados.ejs", {
                user_id: user_id,
                email: request.oidc.user.email,
                name: request.oidc.user.name,
                unidade: unidade,
                mensagem: [
                  "warning",
                  "Atenção!",
                  "Não foi possível atualizar os dados!",
                ],
                vagas_escolhidas:
                  vagas_escolhidas == undefined || vagas_escolhidas == []
                    ? null
                    : vagas_escolhidas,
                lista_vagas: results_vagas_disponiveis,
                lista_unidades: results_unidades_disponiveis,
                vaga_sorteada: null,
                usuario_admin: request.session.usuario_admin,
              });
            } else {
              request.session.unidade_usuario = unidade;
              request.session.meusdadosMensagem =
                "Dados atualizados com sucesso!";
              getMeusdados(request, response);
            }
          }
        }
      );
    }
  }
);

module.exports = router;
