const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const { requiresAuth } = require("express-openid-connect");
const { pool } = require("../config");
const util = require("../util");
const e = require("connect-flash");

router.get("/unidades", requiresAuth(), async (request, response) => {
	const retorno = await util.usuarioDefiniuUnidade(request, response);
	if (retorno == "OK") {
		if (request.session.usuario_admin) {
			let lista_unidades = []; // lista criada para facilitar o tratamento de presenca
			(async () => {
				try {
					let configuracao = await pool.query("SELECT * FROM configuracao;");
					let mensagem;
					if (configuracao.rows[0].resultado_sorteio.startsWith("Sorteio realizado")) {
						let ultimo_sorteio = util.formatDate(configuracao.rows[0].ultimo_sorteio, 1, false);
						mensagem = `As condições não podem ser alteradas porque o sorteio foi realizado em ${ultimo_sorteio}. É preciso reiniciar o processo!`;
					} else if (configuracao.rows[0].resultado_bloqueio == "Sorteio bloqueado") {
						let bloqueio_sorteio = util.formatDate(configuracao.rows[0].bloqueio_sorteio, 1, false);
						mensagem = `As condições não podem ser alteradas porque o sorteio foi bloqueado em ${bloqueio_sorteio}!`;
					}
					let unidades = await pool.query(
						"SELECT unidade, pne, adimplente, user_id FROM unidades ORDER BY unidade;"
					);
					unidades.rows.forEach((row) => {
						lista_unidades.push(row.unidade + "-" + row.pne.toString() + "-" + row.adimplente.toString());
					});
					response.render("unidades.ejs", {
						email: request.oidc.user.email,
						name: request.oidc.user.name,
						lista_unidades: unidades.rows,
						lista_ajustada_unidades: lista_unidades,
						resultado_sorteio: configuracao.rows[0].resultado_sorteio,
						resultado_bloqueio: configuracao.rows[0].resultado_bloqueio,
						mensagem: ["warning", "Atenção!", mensagem],
						usuario_admin: request.session.usuario_admin,
					});
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

router.get("/unidades/morador", requiresAuth(), async (request, response) => {
	const retorno = await util.usuarioDefiniuUnidade(request, response);
	if (retorno == "OK") {
		if (request.session.usuario_admin) {
			if(request.session.auth0_access_token == null) {
				console.log("Token para autenticação não foi gerado. Fale com o administrador!");
				response.status(403).json({
					status: "error",
					message: "Token para autenticação não foi gerado. Fale com o administrador!",
				});
				} else {
				(async () => {
					try {
						if (request.query.user_id != null) {
							let unidade = await pool.query(`SELECT nome, email FROM unidades WHERE user_id = '${request.query.user_id}';`);
							if (unidade.rowCount == 1) {
								response.json({
									nome: unidade.rows[0].nome.trim(), 
									email: unidade.rows[0].email.trim(),								
									status: "success",
									message: "unidade encontrada", 
								});
							} else {
								response.status(204).json({ 
									status: "success",
									message: "unidade não encontrada", 
								});
							}
						} else {
							console.log("Parâmetro não informado");
							response.status(400).json({
								status: "error",
								message: "Parâmetro não informado!",
							});						
						}
					} catch (e) {
						console.error(e.message, e.stack);
					}
				})();
			}
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
	"/unidades/morador",
	[
		check("user_id")
			.isLength({ min: 31 })
			.withMessage("O parâmetro user_id não está corretamente preenchido (tamanho)")
			.trim(),
		check("nome")
			.isLength({ min: 10, max: 255 })
			.withMessage("O nome precisa ter pelo menos 10 carateres e no máximo 255")
			.trim(),
		check("email")
			.matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)
			.withMessage("Formato de email inválido")
			.trim(),
	],
	requiresAuth(),
	(request, response) => {
		const error = validationResult(request).formatWith(({ msg }) => msg);
		const hasError = !error.isEmpty();
		console.log(error);
		if (hasError) {
			response.status(422).json({ error: error.array() });
		} else {
			if (request.session.usuario_admin) {
				const user_id = request.body.user_id;
				const nome = request.body.nome;
				const email = request.body.email;
				let query_update = `UPDATE unidades SET nome = '${nome}', email = '${email}' WHERE user_id = '${user_id}' RETURNING *;`;
				console.log(query_update);
				pool.query(query_update,
					(_error, _results) => {
						if (_error) {
							response
								.status(500)
								.json({ status: "error", message: _error });
						} else {
							// atualiza usuario no Auth0
							var data = JSON.stringify({
								email: email,
								name: nome,
								connection: "Username-Password-Authentication",
							});
							let config = {
								method: "PATCH",
								maxBodyLength: Infinity,
								url: `${process.env.issuerBaseURL}/api/v2/users/${user_id}`,
								headers: {
									"Content-Type": "application/json",
									Accept: "application/json",
									Authorization: `Bearer ${request.session.auth0_access_token}`,
								},
								data: data,
							};
							var axios = require("axios").default;
							axios
								.request(config)
								.then((_response) => {
									let d = new Date();
									let dt = d.toLocaleString();
									console.log(`${dt} - Usuário ${_response.data.user_id} atualizado!`);
									response.status(200).json({
										status: "success",
										message: "registro atualizado com sucesso!",
									});
								})
								.catch((error) => {
									console.log(error);
									response
										.status(500)
										.json({ status: "error", message: error });
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
			.withMessage("O parâmetro presente não está corretamente preenchido (tamanho)")
			.matches(/true|false/)
			.withMessage("O parâmetro presente não está corretamente preenchido (true ou false)")
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
			.withMessage("O parâmetro pne não está corretamente preenchido (true ou false)")
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
			.withMessage("O parâmetro pne não está corretamente preenchido (true ou false)")
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

module.exports = router;
