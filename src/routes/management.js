require("dotenv").config();
const express = require("express");
const router = express.Router();
const { requiresAuth } = require("express-openid-connect");
const { pool } = require("../config");

var axios = require("axios").default;
var options = {
	method: "POST",
	url: `${process.env.issuerBaseURL}/oauth/token`,
	headers: { "content-type": "application/x-www-form-urlencoded" },
	data: new URLSearchParams({
		client_id: process.env["AUTH0_CLIENT_ID"],
		client_secret: process.env["AUTH0_CLIENT_SECRET"],
		audience: `${process.env.issuerBaseURL}/api/v2/`,
		grant_type: "client_credentials",
	}),
};

router.get("/management", requiresAuth(), async (request, response) => {
	if (request.session.usuario_admin) {
		// autentica na API de gerenciamento do Auth0
		axios
			.request(options)
			.then(async function (_response) {
				if (_response.status == 200 && _response.data.access_token != undefined) {
					request.session.auth0_access_token = _response.data.access_token;

					// Listar as unidades sem usuário criado
					let unidades = await pool.query(
						`SELECT unidade, nome, email, senha 
                FROM unidades 
                WHERE nome is not null and email is not null and senha is not null and user_id is null;`
					);
					unidades.rows.forEach((row) => {
						let data = JSON.stringify({
							email: row.email.trim(),
							name: row.nome.trim(),
							connection: "Username-Password-Authentication",
							password: row.senha.trim(),
						});

						// Cria o usuário para a unidade
						let config = {
							method: "POST",
							maxBodyLength: Infinity,
							url: `${process.env.issuerBaseURL}/api/v2/users`,
							headers: {
								"Content-Type": "application/json",
								Accept: "application/json",
								Authorization: `Bearer ${request.session.auth0_access_token}`,
							},
							data: data,
						};
						axios
							.request(config)
							.then((_response) => {
								let d = new Date();
								let dt = d.toLocaleString();
								console.log(
									`${dt} - Usuário ${
										_response.data.user_id
									} criado para ${row.nome.trim()}`
								);

								// Gera um intervalo de tempo variavel para bater nos limites da API
								// Atualiza a unidade com o usuário criado
								const interval = setInterval(() => {
									pool.query(
										"UPDATE unidades SET user_id = $1 WHERE unidade = $2;",
										[_response.data.user_id, row.unidade],
										(_error, _results) => {
											if (_error) {
												console.log(_error);
												response.status(500).json({
													status: "error",
													message: _error,
												});
											} else {
											}
										}
									);
								}, Math.floor(Math.random() * 500) + 200);
								//console.log(JSON.stringify(_response.data));
							})
							.catch((error) => {
								console.log(error);
								response
									.status(500)
									.json({ status: "error", message: error });
							});
					});
				}
			})
			.catch(function (error) {
				console.error(error);
				response.status(500).json({ status: "error", message: error });
			});
		response.status(200).json({
			status: "success",
			message: "usuários criados",
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
