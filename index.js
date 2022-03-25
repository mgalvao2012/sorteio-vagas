const express = require('express')
const request = require('request-promise-native');
const bcrypt = require('bcrypt')
const cors = require('cors')

const helmet = require('helmet')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
const { body, check } = require('express-validator')
const { pool } = require('./config')
const { query_timeout } = require('pg/lib/defaults')

const app = express()
var bodyParser = require('body-parser');

app.set('view-engine','ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(compression())
//app.use(helmet())

const passport = require('passport')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const { auth } = require('express-openid-connect');

const isProduction = process.env.NODE_ENV === 'production'
const origin = {
  origin: isProduction ? process.env.URL_PRODUCTION : '*',
}

var sessionStore = new session.MemoryStore;

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

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

const initializePassport = require('./passport-config')
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)
const users = []

app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: sessionStore,
    cookie  : { maxAge: 60 * 1000 * 2 }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

//app.use(cors(origin))

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // 20 requests,
})
const postLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
})

app.use(limiter, (request, response, next) => {
  if (request.url != '/' && request.url != '/sorteio' && request.url != '/setup' && request.url != '/meusdados') {
    if (
      !request.header('apiKey') ||
      request.header('apiKey') !== process.env.API_KEY
    ) {
      return response
        .status(401)
        .json({ status: 'error', message: 'Acesso não autorizado.' })
    }
  }
  next()
})

app.get('/', async (request, response) => {
  if (request.oidc.isAuthenticated()) {  
    // envia alguns dados do usuário logado para configurar a pagina principal
    response.render('index.ejs', { 
      email: request.oidc.user.email, 
      nickname: request.oidc.user.nickname,
      picture: request.oidc.user.picture,
      name: request.oidc.user.name,
      mensagem: null
    })
  } else {
    response.render('index.ejs', { 
      email: null, 
      nickname: null,
      picture: null,
      name: null,
      mensagem: null
    })
  }
})

const { requiresAuth } = require('express-openid-connect');

app.get('/meusdados', requiresAuth(), (request, response) => {
  // mensagem preenchida quando é realizada a atualização dos dados
  var mensagem = request.flash('success')
  let user_id = request.oidc.user.sub
  pool.query(`SELECT codigo FROM vagas WHERE bloqueada = false ORDER BY codigo;
              SELECT * FROM unidades WHERE user_id = '${user_id}';`, (error, results) => {
    if (error) {
      console.log(error.message)
    } else {
      if (results[1].rows[0] == undefined) {
        response.render('meusdados.ejs', {
          user_id: user_id,
          email: request.oidc.user.email,
          name: request.oidc.user.name, 
          unidade: null,
          vagas_escolhidas: null,
          mensagem: null,
          lista_vagas: results[0].rows
        })  
      } else {
        // converte de '[{"vaga": "S1G27"},{"vaga": "S1G28"}]' -> ['S1G27, S1G28']
        let vagas_escolhidas_array = results[1].rows[0].vagas_escolhidas
        let vagas_escolhidas = []
        vagas_escolhidas_array.forEach(item => {
          vagas_escolhidas.push(item.vaga)
        })
        response.render('meusdados.ejs', {
          user_id: user_id,
          email: request.oidc.user.email, 
          name: request.oidc.user.name,
          unidade: results[1].rows[0].unidade,
          vagas_escolhidas: vagas_escolhidas,
          mensagem: mensagem,
          lista_vagas: results[0].rows
        })
      }
    }
  })  
})

app.post('/meusdados', requiresAuth(), (request, response) => {
  let user_id = request.oidc.user.sub
  let unidade = request.body.unidade 
  console.log('request.body.vagas_escolhidas ['+request.body.vagas_escolhidas+']')
  var vagas_escolhidas_array = [], vagas_escolhidas
  console.log(request.body.vagas_escolhidas)
  let vagas_escolhidas_preenchida = request.body.vagas_escolhidas.split(',')
  if(vagas_escolhidas_preenchida.length > 0) {
    vagas_escolhidas_preenchida.forEach(vaga => {
      vagas_escolhidas_array.push({"vaga": vaga})
    })
    console.log(vagas_escolhidas_array);
    vagas_escolhidas = JSON.stringify(vagas_escolhidas_array);
  }
  var query = `UPDATE unidades SET user_id = NULL WHERE user_id = '${user_id}';`
  if (vagas_escolhidas == undefined) {
    query += `UPDATE unidades SET user_id = '${user_id}' WHERE unidade = '${unidade}';`
  } else {
    query += `UPDATE unidades SET user_id = '${user_id}', vagas_escolhidas = '${vagas_escolhidas}' WHERE unidade = '${unidade}';`
  }
  query += `SELECT codigo FROM vagas WHERE bloqueada = false ORDER BY codigo;`
  console.log(query)
  pool.query(query, (error, results) => {
    if (error) {
      console.log("erro: "+error.message)
    } else {
      if (results[1].rowCount == 0) {
        response.render('meusdados.ejs', {
          user_id: user_id,
          email: request.oidc.user.email, 
          name: request.oidc.user.name,
          unidade: unidade,
          mensagem: 'Não foi possível atualizar os dados. Unidade não cadastrada.',
          vagas_escolhidas: results[2].rows[0].vagas_escolhidas,
          lista_vagas: results[3].rows
        })              
      } else {        
        request.flash('success', 'Dados atualizados com sucesso!');
        response.redirect(301, '/meusdados')
      }
    }
  })
})

app.get('/setup', requiresAuth(), (request, response) => {
  var fs = require('fs');
  fs.readFile('init.sql', 'utf8', function(error, data) {
    if (error) {
      response.status(500).json({ status: 'error', message: error.message })
    } else {
      const query = data
      pool.query(query, (error, results) => {
        if (error) {
          response.status(500).json({ status: 'error', message: error.message })
        } else {
          response.send('Setup finalizado com sucesso.')
        }
      })    
    }
  })
})

function sorteia_vagas(objetivo, vagas_disponiveis, query) {
  return new Promise(function(resolve, reject) {
    var unidades_e_vagas_sorteadas = []
    pool.query(query, (error, results) => {
      if (error) {
        response.status(500).json({ status: 'warning', message: error.message })
      }
      var unidades = results.rows
      // sorteia aleatoriamente a lista de unidades
      unidades.sort(function(a, b){return 0.5 - Math.random()})
      unidades.forEach(unidades_element => {
        var vagas_escolhidas = unidades_element.vagas_escolhidas 
        if (vagas_escolhidas != null) {
          vagas_escolhidas.forEach(vagas_element => {
            if (unidades_element.vaga_sorteada === null) { 
              var indice_lista_vagas_disponiveis = vagas_disponiveis.indexOf(vagas_element.vaga)
              if (indice_lista_vagas_disponiveis > -1) {
                unidades_element.vaga_sorteada = vagas_disponiveis[indice_lista_vagas_disponiveis]
                vagas_disponiveis.splice(indice_lista_vagas_disponiveis, 1);
                //console.log('vagas_disponiveis (2) = '+vagas_disponiveis)
              }
            }
          })
          // se ao final todas as vagas escolhidas foram sorteadas, o apartamento recebe a primeira vaga disponivel
          if (unidades_element.vaga_sorteada === null) {
            unidades_element.vaga_sorteada = vagas_disponiveis[0]
            vagas_disponiveis.splice(0, 1);
            //console.log('vagas_disponiveis (3) = '+vagas_disponiveis)
          }
        } else {
          // se o apartamento sorteado não escolheu nenhuma vaga ele deverá pegar a primeira disponível
          unidades_element.vaga_sorteada = vagas_disponiveis[0]
          vagas_disponiveis.splice(0, 1);
          //console.log('vagas_disponiveis (4) = '+vagas_disponiveis)
        }
      })
      console.log(objetivo)
      unidades.forEach(unidade_element => {
        console.log('unidade: '+unidade_element.unidade+' vaga sorteada: '+unidade_element.vaga_sorteada)
        unidades_e_vagas_sorteadas.push([unidade_element.unidade, unidade_element.vaga_sorteada])
      })
      let retorno = []
      retorno.push(vagas_disponiveis)
      retorno.push(unidades_e_vagas_sorteadas)
      resolve(retorno)
    })
  })
}

app.get('/sorteio', (request, response) => {
  pool.query('SELECT codigo FROM vagas WHERE bloqueada = false', (error, results) => {
    if (error) {
      response.status(500).json({ status: 'error', message: 'Não há vagas disponíveis' })
    } else {
      // cria um array de vagas disponiveis
      var vagas_disponiveis = []
      results.rows.forEach(element => { 
        vagas_disponiveis.push(element.codigo)
      })
      // sorteia lista de vagas disponiveis para não favorecer quem não fez nenhuma escolha
      vagas_disponiveis.sort(function(a, b){return 0.5 - Math.random()})
      //console.log('vagas_disponiveis (0) = '+vagas_disponiveis)
      var qtd_de_vagas_disponiveis = vagas_disponiveis.length
      if (qtd_de_vagas_disponiveis < 1) {
        response.status(500).json({ status: 'error', message: 'Não há vagas disponíveis' })
      } else {
        var unidades_e_vagas_sorteadas = []
        var query_gravacao = ''

        let retornoGrupo1 = sorteia_vagas('sorteio de unidades COM portadores de necessidade especiais', 
          vagas_disponiveis, 
          `SELECT unidade, vaga_sorteada, vagas_escolhidas FROM unidades 
            WHERE pne = true AND presente = true AND vaga_sorteada IS NULL`)
          .then((retorno) => {
            return retorno
          })        
        let acessaRetornoGrupo1 = () => {
          retornoGrupo1.then((retorno) => {
            vagas_disponiveis = retorno[0]
            //console.log('vagas_disponiveis (1) = '+vagas_disponiveis)
            retorno[1].forEach(element => {
              unidades_e_vagas_sorteadas.push(element)
              query_gravacao += `UPDATE unidades SET vaga_sorteada = '${element[1]}' WHERE unidade = '${element[0]}'; `
            })
          })
        }
        acessaRetornoGrupo1()

        let retornoGrupo2 = sorteia_vagas('sorteio de unidades SEM portadores de necessidade especiais e ADIMPLENTES',
          vagas_disponiveis, 
          `SELECT unidade, vaga_sorteada, vagas_escolhidas FROM unidades 
            WHERE pne = false AND adimplente = true AND presente = true AND vaga_sorteada IS NULL`)
          .then((retorno) => {
            return retorno
          })        
        let acessaRetornoGrupo2 = () => {
          retornoGrupo2.then((retorno) => {
            vagas_disponiveis = retorno[0]
            retorno[1].forEach(element => {
              unidades_e_vagas_sorteadas.push(element)
              query_gravacao += `UPDATE unidades SET vaga_sorteada = '${element[1]}' WHERE unidade = '${element[0]}'; `
            })
          })
        }
        acessaRetornoGrupo2()

        let retornoGrupo3 = sorteia_vagas('sorteio de unidades SEM portadores de necessidade especiais e INADIMPLENTES',
          vagas_disponiveis, 
          `SELECT unidade, vaga_sorteada, vagas_escolhidas FROM unidades 
            WHERE pne = false AND adimplente = false AND presente = true AND vaga_sorteada IS NULL`)
          .then((retorno) => {
            return retorno
          })        
        let acessaRetornoGrupo3 = () => {
          retornoGrupo3.then((retorno) => {
            vagas_disponiveis = retorno[0]
            retorno[1].forEach(element => {
              unidades_e_vagas_sorteadas.push(element)
              query_gravacao += `UPDATE unidades SET vaga_sorteada = '${element[1]}' WHERE unidade = '${element[0]}'; `
            })
          })
        }
        acessaRetornoGrupo3()

        let retornoGrupo4 = sorteia_vagas('sorteio de unidades SEM portadores de necessidade especiais e AUSENTES',
          vagas_disponiveis, 
          `SELECT unidade, vaga_sorteada, vagas_escolhidas FROM unidades 
            WHERE pne = false AND presente = false AND vaga_sorteada IS NULL`)
          .then((retorno) => {
            return retorno
          })        
        let acessaRetornoGrupo4 = () => {
          retornoGrupo4.then((retorno) => {
            vagas_disponiveis = retorno[0]
            retorno[1].forEach(element => {
              unidades_e_vagas_sorteadas.push(element)
              query_gravacao += `UPDATE unidades SET vaga_sorteada = '${element[1]}' WHERE unidade = '${element[0]}'; `              
            })
            // verifica se todas as unidades foram contempladas pelo sorteio
            var qtd_unidades_sorteadas = 0, qtd_vagas_sorteadas = 0
            unidades_e_vagas_sorteadas.forEach(element => {
              qtd_unidades_sorteadas += (element[0] != null ? 1 : 0 )
              qtd_vagas_sorteadas += (element[1] != null ? 1 : 0 )
            })
            if ((qtd_vagas_sorteadas == 0 && qtd_unidades_sorteadas == 0) || qtd_vagas_sorteadas != qtd_unidades_sorteadas) {
              response.status(500).json({ status: 'error', 
                message: 'Falha no sorteio. Unidades: ' + qtd_unidades_sorteadas + ' - Vagas: ' +qtd_vagas_sorteadas})
            } else {              
              pool.query(query_gravacao, (error, results) => {
                if (error) {
                  response.status(500).json({ status: 'warning', message: error.message })      
                } else {
                  response.status(200).json({ status: 'success', message: 'Sorteio realizado com sucesso. Unidades: '+
                    qtd_unidades_sorteadas + ' - Vagas: ' +qtd_vagas_sorteadas })
                }
              })
            }
          })
        }
        acessaRetornoGrupo4()
      }
    }
  })
})

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server listening at ${PORT}`)
})