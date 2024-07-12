const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const { requiresAuth } = require("express-openid-connect");
const { pool } = require("../config");
const util = require("../util");

router.get("/liberarunidade", requiresAuth(), (request, response) => {
	if (request.session.usuario_admin) {
		pool.query(
			"SELECT unidade, vagas_escolhidas FROM unidades WHERE user_id != '';",
			(error, results) => {
				if (error) {
					console.log(error.message);
					reject(error.message);
				} else {
					var mensagem = null;
					if (results.rows.length > 0) {
						mensagem = [
							"warning",
							"Atenção!",
							"Esta operação é irreversível!",
						];
					}
					response.render("liberarunidade.ejs", {
						email: request.oidc.user.email,
						name: request.oidc.user.name,
						lista_unidades: results.rows,
						usuario_admin: request.session.usuario_admin,
						mensagem: mensagem,
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
});

router.post(
	"/liberarunidade",
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
			console.log(
				`unidade: ${unidade} liberada pelo usuário: ${request.oidc.user.sub} email: ${request.oidc.user.email}`
			);
			pool.query(
				`SELECT email FROM unidades WHERE unidade = '${unidade}';
				UPDATE unidades SET user_id = null, vagas_escolhidas = null WHERE unidade = '${unidade}' RETURNING *;`,
				(_error, _results) => {
					if (_error) {
						console.log("erro: " + _error.message);
					} else {
						util.enviarEmailHTML(
							_results[0].rows[0].email,
							"Condomínio Grand Life Ipiranga - Sorteio de vagas",
							`Caro(a) Usuário(a)<br/><br/>Sua unidade foi selecionada incorretamente e, portanto, foi removida do cadastro. 
							Sendo assim, solicitamos que o processo seja realizado novamente.<br/><br/>Administração do Condomínio<br/><br/>
							<strong>Em caso de dúvidas, por favor, não responda este email. Fale diretamente com a Administração do Condomínio.</strong>`
						);
					}
				}
			);
		}
		response.redirect("/liberarunidade");
	}
);

module.exports = router;
