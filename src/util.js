const { pool, redisClient } = require("./config");
const moment = require("moment");
const tz = require("moment-timezone");

module.exports.getjson = async function (key) {
	let myPromise = new Promise(function (resolve) {
		redisClient.get(key, async function (err, reply) {
			let retorno = await JSON.parse(reply);
			resolve(retorno);
		});
	});
	return await myPromise;
};

module.exports.enviarEmail = async function (email, subject, content) {
	let myPromise = new Promise(function (resolve) {
		const sgMail = require("@sendgrid/mail");
		sgMail.setApiKey(process.env.SENDGRID_API_KEY);
		const msg = {
			to: email,
			from: process.env.SENDGRID_FROM,
			subject: subject,
			text: content,
		};
		sgMail
			.send(msg)
			.then(() => {
				let _log = "Email enviado para " + email;
				console.log(_log);
				resolve(_log);
			})
			.catch((error) => {
				console.error(error);
			});
	});
	return await myPromise;
};

module.exports.enviarEmailHTML = async function (email, subject, content) {
	let myPromise = new Promise(function (resolve) {
		const sgMail = require("@sendgrid/mail");
		sgMail.setApiKey(process.env.SENDGRID_API_KEY);
		const msg = {
			to: email,
			from: process.env.SENDGRID_FROM,
			subject: subject,
			html: content,
		};
		sgMail
			.send(msg)
			.then(() => {
				let _log = "Email enviado para " + email;
				console.log(_log);
				resolve(_log);
			})
			.catch((error) => {
				console.error(error);
			});
	});
	return await myPromise;
};

function padTo2Digits(num) {
	return num.toString().padStart(2, "0");
}

module.exports.formatDate = function (date, format, convertTZ) {
	if (convertTZ) {
		var datahora = moment.tz(date, 'America/Sao_Paulo').format();
	} else {
		var datahora = moment(date).format();
	}
	if (format == 1) {
		return (datahora.substring(8,10)+'/'+datahora.substring(5,7)+'/'+
			datahora.substring(0,4)+' '+datahora.substring(11,19));
	} else {
		return (datahora.substring(0,10)+' '+datahora.substring(11,19));
	}
};

module.exports.usuarioDefiniuUnidade = async function (request, response) {
	return new Promise((resolve, _reject) => {
		// verifica se o usuario já definiu sua unidade para liberar o acesso a outras funcionalidades
		if (
			request.session.unidade_usuario == undefined &&
			request.session.usuario_admin == null
		) {
			const user_id = request.oidc.user.sub;
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
							resolve("meusdados");
						} else {
							request.session.unidade_usuario = results[1].rows[0].unidade;
							resolve("OK");
						}
					}
				}
			);
		} else {
			resolve("OK");
		}
	});
};
