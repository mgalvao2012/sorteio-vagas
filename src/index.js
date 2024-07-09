require("dotenv").config();
const development_env = process.env.ENV == "development" ? true : false;
const express = require("express");
const fs = require("fs");

const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
// const { body, check } = require('express-validator')
const { pool } = require("./config");

const app = express();
var bodyParser = require("body-parser");

app.set("view-engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(
	helmet.contentSecurityPolicy({
		useDefaults: true,
		directives: {
			"default-src": "https:",
			"style-src": ["https:", "'unsafe-inline'"],
			"script-src": ["https:", "'unsafe-inline'"],
			"font-src": ["https:", "'unsafe-inline'"],
			blockAllMixedContent: [],
		},
	}),
	helmet.hsts({
		maxAge: 15552000,
		includeSubDomains: false,
	}),
	helmet.noSniff(),
	helmet.frameguard({
		action: "deny",
	}),
	helmet.xssFilter()
);

const passport = require("passport");
const session = require("express-session");
const methodOverride = require("method-override");
const { auth } = require("express-openid-connect");

const config = {
	authRequired: false,
	auth0Logout: true,
	secret: process.env.SECRET,
	baseURL: process.env.baseURL,
	clientID: process.env.AUTH0_CLIENT_ID,
	clientSecret: process.env.AUTH0_CLIENT_SECRET,
	issuerBaseURL: process.env.issuerBaseURL,
	authorizationParams: {
		response_type: "code",
		scope: "openid profile email",
	},
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

const users = [];
const usuarios_admin = process.env.USUARIOS_ADMIN;

const initializePassport = require("./passport-config");
initializePassport(
	passport,
	(email) => users.find((user) => user.email === email),
	(id) => users.find((user) => user.id === id)
);

// Redis configuration
const redis = require("redis");
const redisStore = require("connect-redis")(session);
const redisClient = redis.createClient({
	url: process.env.REDIS_TLS_URL,
	legacyMode: true,
	socket: {
		tls: development_env ? false : true,
		rejectUnauthorized: false,
	},
});

// Conecta no Redis
async function redisConnect() {
	await redisClient.connect();
	// console.log("Redis " + redisClient.isOpen); // this is true
	redisClient.on("error", (err) => {
		console.log("Redis error: ", err);
	});
}
redisConnect();

// Configura a sessao para usar Redis
app.use(
	session({
		genid: (req) => {
			//console.log('process.env.JEST_WORKER_ID ' + process.env.JEST_WORKER_ID);
			if (process.env.JEST_WORKER_ID != undefined) {
				// Verifica se o código está sendo testado pelo jest. Se estiver em teste a função uuid será simulada
				return "adfd01fb-309b-4e1c-9117-44d003f5d7fc";
			} else {
				// retona o uuid quando o código não está sob teste
				const { uuid } = require("uuidv4");
				return uuid();
			}
		},
		store: new redisStore({ client: redisClient }),
		name: "_sessionID",
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		sameSite: "strict",
		cookie: {
			secure: true, // if true only transmit cookie over https
			httpOnly: true, // if true prevent client side JS from reading the cookie
			maxAge: 60 * 60 * 1000, // 60 min * 60 seg * 1000 milisegundos = 3600000 ms = 1h
		},
	})
);

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

// limita chamadas das urls para bloquear ataques
const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minute
	max: 20, // 20 requests,
});

app.use(limiter, (request, response, next) => {
	const url_permitidas = process.env.URL_PERMITIDAS;
	if (!url_permitidas.includes(request.url)) {
		if (
			!request.header("apiKey") ||
			request.header("apiKey") !== process.env.API_KEY
		) {
			return response
				.status(401)
				.json({ status: "error", message: "Acesso não autorizado." });
		}
	}
	if (request.oidc.user != null) {
		//console.log('request.oidc.user.user_metadata '+request.oidc.user.user_metadata);
		request.session.usuario_admin = usuarios_admin.includes(request.oidc.user.email);
	} else {
		request.session.usuario_admin = null;
		request.session.unidade_usuario = null;
	}
	if (
		request.oidc.isAuthenticated() &&
		(request.session.unidade_usuario == null ||
			request.session.unidade_usuario == undefined)
	) {
		let user_id = request.oidc.user.sub;
		pool.query(
			`SELECT unidade FROM unidades WHERE user_id = '${user_id}';`,
			(error, results) => {
				if (error) {
					console.log(error.message);
				} else {
					if (results.rows[0] != null) {
						request.session.unidade_usuario = results.rows[0].unidade;
						console.log(
							"request.session.unidade_usuario " +
								request.session.unidade_usuario
						);
					}
				}
			}
		);
	}
	//console.log("request.session.usuario_admin " + request.session.usuario_admin);
	//console.log("sessionId: " + request.sessionID);
	next();
});

app.get("/", async (request, response) => {
	if (request.oidc.isAuthenticated()) {
		// verifica se o usuario já definiu sua unidade para liberar o acesso a outras funcionalidades
		if (request.session.unidade_usuario == undefined) {
			let user_id = request.oidc.user.sub;
			pool.query(
				`SELECT codigo FROM vagas WHERE disponivel = true ORDER BY codigo;
         SELECT unidade FROM unidades WHERE user_id = '${user_id}';
         SELECT unidade FROM unidades WHERE user_id IS NULL ORDER BY unidade;`,
				(error, results) => {
					if (error) {
						console.log(error.message);
					} else {
						if (results[1].rows[0] == undefined) {
							response.render("meusdados.ejs", {
								user_id: user_id,
								email: request.oidc.user.email,
								name: request.oidc.user.name,
								unidade: null,
								vagas_escolhidas: null,
								mensagem: [
									"warning",
									"Atenção",
									"Você precisa definir a sua unidade para ter acesso a outras funcionalidades!",
								],
								lista_vagas: results[0].rows,
								lista_unidades: results[2].rows,
								vaga_sorteada: null,
								usuario_admin: request.session.usuario_admin,
							});
						} else {
							response.render("index.ejs", {
								email: request.oidc.user.email,
								nickname: request.oidc.user.nickname,
								picture: request.oidc.user.picture,
								name: request.oidc.user.name,
								mensagem: null,
								usuario_admin: request.session.usuario_admin,
							});
						}
					}
				}
			);
		} else {
			// envia alguns dados do usuário logado para configurar a pagina principal
			let mensagem;
			if (!request.oidc.user.email_verified == true) {
				mensagem =
					"Um email foi enviado para que sua conta seja ativada. " +
					"Sem essa ativação alguns recursos não estarão disponíveis!";
			}
			response.render("index.ejs", {
				email: request.oidc.user.email,
				nickname: request.oidc.user.nickname,
				picture: request.oidc.user.picture,
				name: request.oidc.user.name,
				mensagem: mensagem != null ? ["warning", "Atenção", mensagem] : null,
				usuario_admin: request.session.usuario_admin,
			});
		}
	} else {
		response.render("index.ejs", {
			email: null,
			nickname: null,
			picture: null,
			name: null,
			mensagem: null,
			usuario_admin: request.session.usuario_admin,
		});
	}
});

const unidadesRoutes = require("./routes/unidades");
const vagasRoutes = require("./routes/vagas");
const sorteioRoutes = require("./routes/sorteio");
const meusdadosRoutes = require("./routes/meusdados");
const setupRoutes = require("./routes/setup");
const faleconoscoRoutes = require("./routes/faleconosco");

app.use(unidadesRoutes);
app.use(vagasRoutes);
app.use(sorteioRoutes);
app.use(meusdadosRoutes);
app.use(setupRoutes);
app.use(faleconoscoRoutes);

// Start server
const PORT = process.env.PORT || 3000;
if (development_env) {
	// configura o servidor local com um certificado ssl não valido
	const https = require("https");
	const server = https
		.createServer(
			{
				key: fs.readFileSync("./src/key.pem"),
				cert: fs.readFileSync("./src/cert.pem"),
				passphrase: process.env.SECRET,
			},
			app
		)
		.listen(PORT, () => {
			/*
      console.log(
        `Server listening at ${PORT}. Environment development: ${development_env}`
      );
      */
		});
	module.exports = server;
} else {
	app.listen(PORT, () => {
		console.log(
			`Server listening at ${PORT}. Environment development: ${development_env}`
		);
	});
}
