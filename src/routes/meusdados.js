const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const { requiresAuth } = require("express-openid-connect");
const { pool } = require("../config");
const util = require("../util");
const e = require("connect-flash");

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
       	 SELECT unidade FROM unidades WHERE user_id IS NULL ORDER BY unidade;
			 SELECT * FROM configuracao;`,
			(error, results) => {
				if (error) {
					console.log(error.message);
					reject(error.message);
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
						var estilo_mensagem = '';						
						if (results[3].rows[0].resultado_bloqueio == "Sorteio bloqueado" && 
							results[3].rows[0].resultado_sorteio == "Sorteio não realizado"
						) {
							estilo_mensagem = "warning";
							mensagem = "O Sorteio foi bloqueado. " +
								"Não é mais possível alterar as vagas escolhidas!";
						} else {
							estilo_mensagem = "success";
						}
						// converte de '[{"vaga": "S1G27"},{"vaga": "S1G28"}]' -> ['S1G27, S1G28']
						let vagas_escolhidas_array = results[1].rows[0].vagas_escolhidas;
						let vagas_escolhidas = [];
						// console.log('vagas_escolhidas_array '+vagas_escolhidas_array)
						if (vagas_escolhidas_array != null) {
							vagas_escolhidas_array.forEach((item) => {
								vagas_escolhidas.push(item.vaga);
							});
						}
						if (results[3].rows[0].ultimo_sorteio != null) {
							var ultimo_sorteio = util.formatDate(results[3].rows[0].ultimo_sorteio,1);
						}
						if (results[3].rows[0].bloqueio_sorteio != null) {
							var bloqueio_sorteio = util.formatDate(results[3].rows[0].bloqueio_sorteio,1);
						}
						response.render("meusdados.ejs", {
							user_id: user_id,
							email: request.oidc.user.email,
							name: request.oidc.user.name,
							unidade: results[1].rows[0].unidade,
							vagas_escolhidas: vagas_escolhidas,
							mensagem: [estilo_mensagem, "Informação!", mensagem],
							lista_vagas: results[0].rows,
							lista_unidades: results[2].rows,
							vaga_sorteada: results[1].rows[0].vaga_sorteada,
							usuario_admin: request.session.usuario_admin,
							configuracao: results[3].rows[0],
							ultimo_sorteio: ultimo_sorteio,
							bloqueio_sorteio: bloqueio_sorteio,
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
			.withMessage("O parâmetro unidade não está corretamente preenchido (tamanho)")
			.matches(/T[1|2][0-2]\d[1-4]/)
			.withMessage("O parâmetro unidade não está corretamente preenchido (formato)")
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
			(async () => {
				try {
					let configuracao = await pool.query("SELECT * FROM configuracao;");
					if (configuracao.rows[0].resultado_bloqueio == "Sorteio bloqueado") {
						response.redirect("/meusdados");
					} else {
						console.log("unidade " + unidade);
						console.log("request.session.unidade_usuario " + request.session.unidade_usuario);
						console.log(
							`Vagas escolhidas pela unidade ${unidade} [${request.body.vagas_escolhidas}]`
						);
						var vagas_escolhidas_array = [];
						var vagas_escolhidas = null;
						if (request.body.vagas_escolhidas.length > 0) {
							let vagas_escolhidas_preenchida = request.body.vagas_escolhidas.split(",");
							if (vagas_escolhidas_preenchida.length > 0) {
								vagas_escolhidas_preenchida.forEach((vaga) => {
									vagas_escolhidas_array.push({ vaga: vaga });
								});
								vagas_escolhidas = JSON.stringify(vagas_escolhidas_array);
							}
						}
						pool.query(
							"UPDATE unidades SET user_id = $1, email = $2, vagas_escolhidas = $3 WHERE unidade = $4 RETURNING *;",
							[user_id, request.oidc.user.email, vagas_escolhidas, unidade],
							(_error, _results) => {
								if (_error) {
									console.log("erro: " + _error.message);
									request.session.meusdadosMensagem = "Erro na atualização dos dados!";
								} else {
									request.session.meusdadosMensagem = "Dados atualizados com sucesso!";
								}
								request.session.unidade_usuario = unidade;
								getMeusdados(request, response);
							}
						);			
					}
				} catch (e) {
					console.error(e.message, e.stack);
				}
			})();
		}
	}
);
/*
router.post(
	"/meusdados-remover-unidade",
	[
		check("unidade")
			.isLength({ min: 5, max: 5 })
			.withMessage("O parâmetro unidade não está corretamente preenchido (tamanho)")
			.matches(/T[1|2][0-2]\d[1-4]/)
			.withMessage("O parâmetro unidade não está corretamente preenchido (formato)")
			.trim(),
	],
	requiresAuth(),
	async function (request, response) {
		const error = validationResult(request).formatWith(({ msg }) => msg);
		const hasError = !error.isEmpty();
		if (hasError) {
			response.status(422).json({ error: error.array() });
		} else {
			var unidade = request.body.unidade;
			console.log("unidade " + unidade + " removeu vagas escolhidas");
			pool.query(
				"UPDATE unidades SET user_id = null, email = null, vagas_escolhidas = null WHERE unidade = $1 RETURNING *;",
				[unidade],
				(_error, _results) => {
					if (_error) {
						console.log("erro: " + _error.message);
					}
				}
			);
		}
		response.redirect("/meusdados");
	}
);
*/
module.exports = router;
