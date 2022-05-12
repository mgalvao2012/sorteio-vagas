const express = require("express");
const router = express.Router();
const { requiresAuth } = require("express-openid-connect");
const { pool } = require("../config");
const util = require("../util");

const sorteia_vagas = (objetivo, vagas_disponiveis, query) => {
  return new Promise((resolve, reject) => {
    var unidades_e_vagas_sorteadas = [];
    pool.query(query, (error, results) => {
      if (error) {
        //response.status(500).json({ status: 'warning', message: error.message })
        reject(error.message);
        return;
      }
      var unidades = results.rows;
      // sorteia aleatoriamente a lista de unidades
      unidades.sort(function (a, b) {
        return 0.5 - Math.random();
      });
      unidades.forEach((unidades_element) => {
        var vagas_escolhidas = unidades_element.vagas_escolhidas;
        if (vagas_escolhidas != null) {
          vagas_escolhidas.forEach((vagas_element) => {
            if (unidades_element.vaga_sorteada === null) {
              var indice_lista_vagas_disponiveis = vagas_disponiveis.indexOf(
                vagas_element.vaga
              );
              if (indice_lista_vagas_disponiveis > -1) {
                unidades_element.vaga_sorteada =
                  vagas_disponiveis[indice_lista_vagas_disponiveis];
                vagas_disponiveis.splice(indice_lista_vagas_disponiveis, 1);
                //console.log('vagas_disponiveis (2) = '+vagas_disponiveis)
              }
            }
          });
          // se ao final todas as vagas escolhidas foram sorteadas, o apartamento recebe a primeira vaga disponivel
          if (unidades_element.vaga_sorteada === null) {
            unidades_element.vaga_sorteada = vagas_disponiveis[0];
            vagas_disponiveis.splice(0, 1);
            //console.log('vagas_disponiveis (3) = '+vagas_disponiveis)
          }
        } else {
          // se o apartamento sorteado não escolheu nenhuma vaga ele deverá pegar a primeira disponível
          unidades_element.vaga_sorteada = vagas_disponiveis[0];
          vagas_disponiveis.splice(0, 1);
          //console.log('vagas_disponiveis (4) = '+vagas_disponiveis)
        }
      });
      console.log(objetivo);
      unidades.forEach((unidade_element) => {
        console.log(
          "unidade: " +
            unidade_element.unidade +
            " vaga sorteada: " +
            unidade_element.vaga_sorteada
        );
        unidades_e_vagas_sorteadas.push([
          unidade_element.unidade,
          unidade_element.vaga_sorteada,
        ]);
      });
      let retorno = [];
      retorno.push(vagas_disponiveis);
      retorno.push(unidades_e_vagas_sorteadas);
      resolve(retorno);
    });
  });
};

router.get("/sorteio", requiresAuth(), (request, response) => {
  if (request.session.usuario_admin) {
    // mensagem preenchida quando é realizada o sorteio
    var mensagem = request.session.sorteioMensagem;
    let user_id = request.oidc.user.sub;
    pool.query(
      "SELECT * FROM configuracao;" +
        "SELECT unidade, vaga_sorteada, vagas_escolhidas, presente, user_id FROM unidades ORDER BY unidade;" +
        "SELECT codigo FROM vagas WHERE disponivel = true;",
      (error, results) => {
        if (error) {
          console.log(error.message);
        } else {
          if (results[0].rows[0] == undefined) {
            response.render("sorteio.ejs", {
              email: request.oidc.user.email,
              name: request.oidc.user.name,
              ultimo_sorteio: null,
              resultado_sorteio: null,
              lista_vagas_sorteadas: null,
              lista_presenca: null,
              mensagem: null,
              usuario_admin: request.session.usuario_admin,
            });
          } else {
            let ultimo_sorteio = util.formatDate(
              results[0].rows[0].ultimo_sorteio,
              1
            );
            let lista_presenca = []; // lista criada para facilitar o tratamento de presenca
            results[1].rows.forEach((row) => {
              lista_presenca.push(row.unidade + "-" + row.presente.toString());
            });
            let estilo, titulo;
            if (
              results[2].rows.length != results[1].rows.length &&
              mensagem.length == 0
            ) {
              mensagem = `A quantidade de vagas (${results[2].rows.length}) é insuficiente para atender todas as unidades (${results[1].rows.length}).`;
              estilo = "warning";
              titulo = "Atenção!";
            } else {
              estilo = "info";
              titulo = "Informação!";
            }
            response.render("sorteio.ejs", {
              email: request.oidc.user.email,
              name: request.oidc.user.name,
              ultimo_sorteio: ultimo_sorteio,
              resultado_sorteio: results[0].rows[0].resultado_sorteio,
              lista_vagas_sorteadas: results[1].rows,
              lista_presenca: lista_presenca,
              mensagem: [estilo, titulo, mensagem],
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

router.post("/sorteio", (request, response) => {
  if (request.session.usuario_admin) {
    pool.query(
      "SELECT codigo FROM vagas WHERE disponivel = true;",
      (error, results) => {
        if (error) {
          response
            .status(500)
            .json({ status: "error", message: "Não há vagas disponíveis" });
        } else {
          // cria um array de vagas disponiveis
          var vagas_disponiveis = [];
          results.rows.forEach((element) => {
            vagas_disponiveis.push(element.codigo);
          });
          // sorteia lista de vagas disponiveis para não favorecer quem não fez nenhuma escolha
          vagas_disponiveis.sort(function (a, b) {
            return 0.5 - Math.random();
          });
          //console.log('vagas_disponiveis (0) = '+vagas_disponiveis)
          var qtd_de_vagas_disponiveis = vagas_disponiveis.length;
          if (qtd_de_vagas_disponiveis < 1) {
            response
              .status(500)
              .json({ status: "error", message: "Não há vagas disponíveis" });
          } else {
            var unidades_e_vagas_sorteadas = [];
            var query_gravacao = "";

            sorteia_vagas(
              "sorteio de unidades COM portadores de necessidade especiais",
              vagas_disponiveis,
              `SELECT unidade, vaga_sorteada, vagas_escolhidas FROM unidades 
                WHERE pne = true AND vaga_sorteada IS NULL`
            )
              .then((retorno) => {
                vagas_disponiveis = retorno[0];
                //console.log('vagas_disponiveis (1) = '+vagas_disponiveis)
                retorno[1].forEach((element) => {
                  unidades_e_vagas_sorteadas.push(element);
                  // verifica se a unidade recebeu alguma vaga
                  if (element[1] != undefined) {
                    query_gravacao += `UPDATE unidades SET vaga_sorteada = '${element[1]}' WHERE unidade = '${element[0]}'; `;
                  }
                });
                //console.log('terminou sorteio de unidades COM portadores de necessidade especiais')

                sorteia_vagas(
                  "sorteio de unidades SEM portadores de necessidade especiais, PRESENTES e  ADIMPLENTES",
                  vagas_disponiveis,
                  `SELECT unidade, vaga_sorteada, vagas_escolhidas FROM unidades 
                WHERE pne = false AND adimplente = true AND presente = true AND vaga_sorteada IS NULL`
                )
                  .then((retorno) => {
                    vagas_disponiveis = retorno[0];
                    retorno[1].forEach((element) => {
                      unidades_e_vagas_sorteadas.push(element);
                      // verifica se a unidade recebeu alguma vaga
                      if (element[1] != undefined) {
                        query_gravacao += `UPDATE unidades SET vaga_sorteada = '${element[1]}' WHERE unidade = '${element[0]}'; `;
                      }
                    });

                    sorteia_vagas(
                      "sorteio de unidades SEM portadores de necessidade especiais, PRESENTES e INADIMPLENTES",
                      vagas_disponiveis,
                      `SELECT unidade, vaga_sorteada, vagas_escolhidas FROM unidades 
                  WHERE pne = false AND adimplente = false AND presente = true AND vaga_sorteada IS NULL`
                    )
                      .then((retorno) => {
                        vagas_disponiveis = retorno[0];
                        retorno[1].forEach((element) => {
                          unidades_e_vagas_sorteadas.push(element);
                          // verifica se a unidade recebeu alguma vaga
                          if (element[1] != undefined) {
                            query_gravacao += `UPDATE unidades SET vaga_sorteada = '${element[1]}' WHERE unidade = '${element[0]}'; `;
                          }
                        });

                        sorteia_vagas(
                          "sorteio de unidades SEM portadores de necessidade especiais e AUSENTES",
                          vagas_disponiveis,
                          `SELECT unidade, vaga_sorteada, vagas_escolhidas FROM unidades 
                    WHERE pne = false AND presente = false AND vaga_sorteada IS NULL`
                        )
                          .then((retorno) => {
                            vagas_disponiveis = retorno[0];
                            retorno[1].forEach((element) => {
                              unidades_e_vagas_sorteadas.push(element);
                              // verifica se a unidade recebeu alguma vaga
                              if (element[1] != undefined) {
                                query_gravacao += `UPDATE unidades SET vaga_sorteada = '${element[1]}' WHERE unidade = '${element[0]}'; `;
                              }
                            });
                            // verifica se todas as unidades foram contempladas pelo sorteio
                            var qtd_unidades_sorteadas = 0,
                              qtd_vagas_sorteadas = 0;
                            unidades_e_vagas_sorteadas.forEach((element) => {
                              //console.log('qtd_unidades_sorteadas (element[0]) '+element[0]+' qtd_vagas_sorteadas (element[1]) '+element[1])
                              qtd_unidades_sorteadas +=
                                element[0] != null ? 1 : 0;
                              qtd_vagas_sorteadas += element[1] != null ? 1 : 0;
                            });
                            let data_atual = util.formatDate(new Date(), 2);
                            if (
                              qtd_vagas_sorteadas == 0 &&
                              qtd_unidades_sorteadas == 0
                            ) {
                              let mensagem =
                                "Falha no sorteio. Unidades: " +
                                qtd_unidades_sorteadas +
                                " - Vagas: " +
                                qtd_vagas_sorteadas;
                              query_gravacao += `UPDATE configuracao SET ultimo_sorteio = '${data_atual}', resultado_sorteio = '${mensagem}' WHERE id = 1; `;
                              response
                                .status(500)
                                .json({ status: "error", message: mensagem });
                            } else {
                              let mensagem;
                              if (
                                qtd_vagas_sorteadas != qtd_unidades_sorteadas
                              ) {
                                mensagem =
                                  "Sorteio realizado porém nem todas as unidades foram contempladas. Unidades: " +
                                  qtd_unidades_sorteadas +
                                  " - Vagas: " +
                                  qtd_vagas_sorteadas;
                              } else {
                                mensagem =
                                  "Sorteio realizado com sucesso. Unidades: " +
                                  qtd_unidades_sorteadas +
                                  " - Vagas: " +
                                  qtd_vagas_sorteadas;
                              }
                              query_gravacao += `UPDATE configuracao SET ultimo_sorteio = '${data_atual}', resultado_sorteio = '${mensagem}' WHERE id = 1; `;
                              pool.query(query_gravacao, (error, results) => {
                                if (error) {
                                  // console.log(query_gravacao)
                                  console.log(
                                    "Falha no sorteio. Mensagem de erro: " +
                                      error.message
                                  );
                                  // response.status(500).json({ status: 'warning', message: error.message })
                                } else {
                                  // response.status(200).json({ status: 'success', message: mensagem })
                                  request.session.sorteioMensagem = mensagem;
                                  response.redirect("/sorteio");
                                }
                              });
                            }
                          })
                          .catch((error) => {
                            console.log(error);
                            response
                              .status(500)
                              .json({ status: "error", message: error });
                            return;
                          });
                      })
                      .catch((error) => {
                        console.log(error);
                        response
                          .status(500)
                          .json({ status: "error", message: error });
                        return;
                      });
                  })
                  .catch((error) => {
                    console.log(error);
                    response
                      .status(500)
                      .json({ status: "error", message: error });
                    return;
                  });
              })
              .catch((error) => {
                console.log(error);
                response.status(500).json({ status: "error", message: error });
                return;
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

router.get("/sorteio/reiniciar", requiresAuth(), (request, response) => {
  if (request.session.usuario_admin) {
    pool.query(
      `UPDATE unidades SET vaga_sorteada = null;
       UPDATE configuracao SET resultado_sorteio = 'Sorteio não realizado' RETURNING *;`,
      (error, results) => {
        if (error) {
          console.log(error.message);
          response.status(500).json({ status: "error", message: error });
        } else {
          if (results[1].rows[0].resultado_sorteio == "Sorteio não realizado") {
            console.log("Sorteio reiniciado com sucesso!");
            request.session.sorteioMensagem = "Sorteio reiniciado com sucesso!";
            response.redirect("/sorteio");
          } else {
            response.status(500).json({
              status: "error",
              message:
                "Falha no processo de reinicio. Procure o administrador.",
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

module.exports = router;
