// teste de hotfix
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const request = require('request-promise-native');
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const { auth } = require('express-openid-connect');
const app = express();

var bodyParser = require('body-parser');
// var helmet = require('helmet');
var rateLimit = require("express-rate-limit");

/*
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200 // limit each IP to 100 requests per windowMs
});
*/

app.use(bodyParser.urlencoded({extended: false}));
//app.use(helmet());
//app.use(limiter);

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.baseURL,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    issuerBaseURL: process.env.issuerBaseURL,
    authorizationParams: {
        response_type: 'code',
        scope: 'openid profile email'
    }
};

var dados_usuario = {};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

const initializePassport = require('./passport-config')
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

const users = []

app.set('view-engine','ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie  : { maxAge: 60 * 1000 * 2 }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

// req.isAuthenticated is provided from the auth router
app.get('/', async (req, res) => {
    
    if (req.oidc.isAuthenticated()) {    

        let { token_type, access_token, isExpired, refresh } = req.oidc.accessToken;
        // console.log(`${token_type} ${access_token}`);
        if (isExpired()) {
          ({ access_token } = await refresh());
          console.log(`refreshed ${token_type} ${access_token}`);
        } 
    
        const userInfo = await req.oidc.fetchUserInfo();
        var user_id = encodeURI(userInfo.sub);

        // autentica na API de gerenciamento
        var axios = require("axios").default;
        var options = { method: 'POST',
            url: `${process.env.issuerBaseURL}/oauth/token`,
            headers: { 'content-type': 'application/json' },
            data: {
                client_id: `${process.env.AUTH0_CLIENT_ID_MGMT}`,
                client_secret: `${process.env.AUTH0_CLIENT_SECRET_MGMT}`,
                audience: `${process.env.AUTH0_AUDIENCE_MGMT}`,
                grant_type: `${process.env.AUTH0_GRANT_TYPE_MGMT}`
            }         
        };

        axios.request(options).then(function (response) {
            // consulta dados do usuario logado
            var access_token_mgmt = response.data.access_token;
            var token_type_mgmt = response.data.token_type;
            var options_getuser = {
                method: 'GET',
                url: `${process.env.issuerBaseURL}/api/v2/users/${user_id}`,
                headers: {Authorization: `${token_type_mgmt} ${access_token_mgmt}`, 'content-type': 'application/json'}
            };
            axios.request(options_getuser).then(function (response) {
                dados_usuario = response.data;
            }).catch(function (error) {
                console.error(error);
            });
        }).catch(function (error) {
            console.error(error);
        });

        // envia alguns dados do usuário logado para configurar a pagina principal
        res.render('index.ejs', { 
            email: req.oidc.user.email, 
            nickname: req.oidc.user.nickname,
            picture: req.oidc.user.picture
         })
    } else {
        res.render('index.ejs', { email: null, nickname: null, picture: null })
//        res.render('login.ejs')
    }
    // res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

const { requiresAuth } = require('express-openid-connect');

app.get('/perfil', requiresAuth(), (req, res) => {
    var user_metadata = dados_usuario.user_metadata;
    try {
        var unidade = user_metadata.unidade;
        var pne = user_metadata.pne;
    } catch (err) {
        var unidade = '';
        var pne = '';
    }
    res.render('perfil.ejs', {
        name: dados_usuario.name, 
        email: dados_usuario.email, 
        picture: dados_usuario.picture,
        unidade: unidade,
        pne: pne,
        mensagem: ''
    });
});

app.post('/perfil', requiresAuth(), (req, res) => {
    //console.log(req.body);
    var user_id = encodeURI(dados_usuario.user_id); 
    var unidade = req.body.unidade;
    var name = req.body.name;
    var pne = req.body.pne;

    // autentica na API de gerenciamento
    var axios = require("axios").default;
    var options = { method: 'POST',
        url: `${process.env.issuerBaseURL}/oauth/token`,
        headers: { 'content-type': 'application/json' },
        data: {
            client_id: `${process.env.AUTH0_CLIENT_ID_MGMT}`,
            client_secret: `${process.env.AUTH0_CLIENT_SECRET_MGMT}`,
            audience: `${process.env.AUTH0_AUDIENCE_MGMT}`,
            grant_type: `${process.env.AUTH0_GRANT_TYPE_MGMT}`
        }         
    };

    axios.request(options).then(function (response) {
        // consulta dados do usuario logado
        var access_token_mgmt = response.data.access_token;
        var token_type_mgmt = response.data.token_type;
        var options_getuser = {
            method: 'PATCH',
            url: `${process.env.issuerBaseURL}/api/v2/users/${user_id}`,
            headers: {Authorization: `${token_type_mgmt} ${access_token_mgmt}`, 'content-type': 'application/json'},
            data: {name: `${name}`, user_metadata: {unidade: `${unidade}`, pne: `${pne}`} }
        };
        // console.log('options_getuser: '+JSON.stringify(options));
        axios.request(options_getuser).then(function (response) {
            // console.log(response.data);
            dados_usuario = response.data;
            let user_metadata = dados_usuario.user_metadata;
            let unidade_gravada = user_metadata.unidade;
            if ( unidade_gravada === unidade) {
                res.render('perfil.ejs', {
                    name: dados_usuario.name, 
                    email: dados_usuario.email, 
                    picture: dados_usuario.picture,
                    unidade: user_metadata.unidade,
                    pne: user_metadata.pne,
                    mensagem: 'Dados atualizados com sucesso!'
                });
            }
        }).catch(function (error) {
            console.error(error);
        });
    }).catch(function (error) {
        console.error(error);
    });
});

app.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
});

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
