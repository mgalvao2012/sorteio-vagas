const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const { requiresAuth } = require("express-openid-connect");
const { pool } = require("../config");
const util = require("../util");

router.get("/unidades", requiresAuth(), async (request, response) => {
	const retorno = await util.usuarioDefiniuUnidade(request, response);
	if (retorno == "OK") {
		if (request.session.usuario_admin) {
			let lista_unidades = []; // lista criada para facilitar o tratamento de presenca
			(async () => {
				try {
					let configuracao = await pool.query("SELECT * FROM configuracao;");
					let mensagem;
					if (
						configuracao.rows[0].resultado_sorteio != "Sorteio não realizado"
					) {
						let ultimo_sorteio = util.formatDate(
							configuracao.rows[0].ultimo_sorteio,
							1
						);
						mensagem = `As condições não podem ser alteradas porque o sorteio foi realizado em ${ultimo_sorteio}. É preciso reiniciar o processo!`;
					}
					let unidades = await pool.query(
						"SELECT unidade, pne, adimplente, user_id FROM unidades ORDER BY unidade;"
					);
					unidades.rows.forEach((row) => {
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
						lista_unidades: unidades.rows,
						lista_ajustada_unidades: lista_unidades,
						resultado_sorteio: configuracao.rows[0].resultado_sorteio,
						mensagem: ["warning", "Atenção!", mensagem],
						usuario_admin: request.session.usuario_admin,
					});
					/*
          let _json = JSON.stringify(unidades.rows);
          await redisClient.set('_json', _json);
          let _json2 = await util.getjson('_json');
          console.log(2,_json2);
          */
				} catch (e) {
					console.error(e.message, e.stack);
				}
			})();
		} else {
			console.log("Você não está autorizado a acessar este recurso!");
			response.status(403).json({
				status: "error",
				message: "Você não está autorizado a acessar este recurso!",
			});
		}
	}
});

router.post(
	"/unidades/atualizarPresenca",
	[
		check("unidade")
			.isLength({ min: 5, max: 5 })
			.withMessage("O parâmetro unidade não está corretamente preenchido (tamanho)")
			.matches(/T[1|2][0-2]\d[1-4]/)
			.withMessage("O parâmetro unidade não está corretamente preenchido (formato)")
			.trim(),
		check("presente")
			.isLength({ min: 4, max: 5 })
			.withMessage(
				"O parâmetro presente não está corretamente preenchido (tamanho)"
			)
			.matches(/true|false/)
			.withMessage(
				"O parâmetro presente não está corretamente preenchido (true ou false)"
			)
			.trim(),
	],
	requiresAuth(),
	(request, response) => {
		const error = validationResult(request).formatWith(({ msg }) => msg);
		const hasError = !error.isEmpty();
		if (hasError) {
			response.status(422).json({ error: error.array() });
		} else {
			if (request.session.usuario_admin) {
				const unidade = request.body.unidade;
				const presente = request.body.presente;
				console.log(
					`UPDATE unidades SET presente = '${presente}' WHERE unidade = '${unidade}';`
				);
				pool.query(
					"UPDATE unidades SET presente = $1 WHERE unidade = $2;",
					[presente, unidade],
					(_error, _results) => {
						if (_error) {
							response
								.status(500)
								.json({ status: "error", message: _error });
						} else {
							response.status(200).json({
								status: "success",
								message: "registro atualizado com sucesso!",
							});
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
		}
	}
);

router.post(
	"/unidades/atualizarPNE",
	[
		check("unidade")
			.isLength({ min: 5, max: 5 })
			.withMessage("O parâmetro unidade não está corretamente preenchido (tamanho)")
			.matches(/T[1|2][0-2]\d[1-4]/)
			.withMessage("O parâmetro unidade não está corretamente preenchido (formato)")
			.trim(),
		check("pne")
			.isLength({ min: 4, max: 5 })
			.withMessage("O parâmetro pne não está corretamente preenchido (tamanho)")
			.matches(/true|false/)
			.withMessage(
				"O parâmetro pne não está corretamente preenchido (true ou false)"
			)
			.trim(),
	],
	requiresAuth(),
	(request, response) => {
		const error = validationResult(request).formatWith(({ msg }) => msg);
		const hasError = !error.isEmpty();
		if (hasError) {
			response.status(422).json({ error: error.array() });
		} else {
			if (request.session.usuario_admin) {
				const unidade = request.body.unidade;
				const pne = request.body.pne;
				console.log(
					`UPDATE unidades SET pne = '${pne}' WHERE unidade = '${unidade}';`
				);
				pool.query(
					"UPDATE unidades SET pne = $1 WHERE unidade = $2;",
					[pne, unidade],
					(_error, _results) => {
						if (_error) {
							response
								.status(500)
								.json({ status: "error", message: _error });
						} else {
							response.status(200).json({
								status: "success",
								message: "registro atualizado com sucesso!",
							});
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
		}
	}
);

router.post(
	"/unidades/atualizarAdimplente",
	[
		check("unidade")
			.isLength({ min: 5, max: 5 })
			.withMessage("O parâmetro unidade não está corretamente preenchido (tamanho)")
			.matches(/T[1|2][0-2]\d[1-4]/)
			.withMessage("O parâmetro unidade não está corretamente preenchido (formato)")
			.trim(),
		check("adimplente")
			.isLength({ min: 4, max: 5 })
			.withMessage("O parâmetro pne não está corretamente preenchido (tamanho)")
			.matches(/true|false/)
			.withMessage(
				"O parâmetro pne não está corretamente preenchido (true ou false)"
			)
			.trim(),
	],
	requiresAuth(),
	(request, response) => {
		const error = validationResult(request).formatWith(({ msg }) => msg);
		const hasError = !error.isEmpty();
		if (hasError) {
			response.status(422).json({ error: error.array() });
		} else {
			if (request.session.usuario_admin) {
				const unidade = request.body.unidade;
				const adimplente = request.body.adimplente;
				console.log(
					`UPDATE unidades SET adimplente = '${adimplente}' WHERE unidade = '${unidade}';`
				);
				pool.query(
					"UPDATE unidades SET adimplente = $1 WHERE unidade = $2;",
					[adimplente, unidade],
					(_error, _results) => {
						if (_error) {
							response
								.status(500)
								.json({ status: "error", message: _error });
						} else {
							response.status(200).json({
								status: "success",
								message: "registro atualizado com sucesso!",
							});
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
		}
	}
);

router.post(
	"/unidades/liberarUnidade",
	[
		check("unidade")
			.isLength({ min: 5, max: 5 })
			.withMessage("O parâmetro unidade não está corretamente preenchido (tamanho)")
			.matches(/T[1|2][0-2]\d[1-4]/)
			.withMessage("O parâmetro unidade não está corretamente preenchido (formato)")
			.trim(),
	],
	requiresAuth(),
	(request, response) => {
		const error = validationResult(request).formatWith(({ msg }) => msg);
		const hasError = !error.isEmpty();
		if (hasError) {
			response.status(422).json({ error: error.array() });
		} else {
			if (request.session.usuario_admin) {
				const unidade = request.body.unidade;
				console.log(
					`UPDATE unidades SET user_id = NULL, vagas_escolhidas = NULL WHERE unidade = '${unidade}';`
				);
				pool.query(
					"UPDATE unidades SET user_id = NULL, vagas_escolhidas = NULL WHERE unidade = $1;",
					[unidade],
					(_error, _results) => {
						if (_error) {
							response
								.status(500)
								.json({ status: "error", message: _error });
						} else {
							response.status(200).json({
								status: "success",
								message: "registro atualizado com sucesso!",
							});
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
		}
	}
);

module.exports = router;
