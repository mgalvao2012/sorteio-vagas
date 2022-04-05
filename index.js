require('dotenv').config()
const development_env = process.env.ENV == 'development' ? true : false
const express = require('express')
const request = require('request-promise-native');
const bcrypt = require('bcrypt')
const cors = require('cors')
const fs = require('fs')

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
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "script-src": ["'self'", `'unsafe-inline'`, `${process.env.baseURL}`, "https://ajax.googleapis.com",
        "https://ka-f.fontawesome.com", "https://kit.fontawesome.com/"], 
      "style-src": ["'self'", `https: 'unsafe-inline'`, `${process.env.baseURL}`,"https://www.w3schools.com/", 
        "https://fonts.googleapis.com/", "https://cdnjs.cloudflare.com/"],
      "font-src": ["'self'", `${process.env.baseURL}`, "https://fonts.googleapis.com/", 
        "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com/", "https://ka-f.fontawesome.com", 
        "https://kit.fontawesome.com/"]
    },
  })
 )

const passport = require('passport')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const { auth } = require('express-openid-connect');

const isProduction = process.env.NODE_ENV === 'production'
const origin = {
  origin: isProduction ? process.env.URL_PRODUCTION : process.env.baseURL,
  optionsSuccessStatus: 200, // For legacy browser support
  methods: "GET, POST"
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
const usuarios_admin = process.env.USUARIOS_ADMIN;

app.use(flash())
/*
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: sessionStore,
    cookie  : { maxAge: 60 * 1000 * 2 }
}))
*/
var sess = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: sessionStore,
  cookie  : { maxAge: 60 * 1000 * 2 }
}

// habilita a cookies seguros apenas em produção
if (development_env) {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess))
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
  const url_permitidas = process.env.URL_PERMITIDAS
  if (!url_permitidas.includes(request.url)) {
    if (
      !request.header('apiKey') ||
      request.header('apiKey') !== process.env.API_KEY
    ) {
      return response
        .status(401)
        .json({ status: 'error', message: 'Acesso não autorizado.' })
    }
  }  
  if(request.oidc.user != null) {
    request.session.usuario_admin = usuarios_admin.includes(request.oidc.user.email)
  } else {
    request.session.usuario_admin = null
  }
  next()
})

app.get('/', async (request, response) => {
  if (request.oidc.isAuthenticated()) {  
    // envia alguns dados do usuário logado para configurar a pagina principal
    let mensagem 
    if (!request.oidc.user.email_verified == true) {
      mensagem = 'Um email foi enviado para que sua conta seja ativada. Sem essa ativação alguns recursos não estarão disponíveis!'
    }
    response.render('index.ejs', { 
      email: request.oidc.user.email, 
      nickname: request.oidc.user.nickname,
      picture: request.oidc.user.picture,
      name: request.oidc.user.name,
      mensagem: mensagem,
      usuario_admin: request.session.usuario_admin
    })
  } else {
    response.render('index.ejs', { 
      email: null, 
      nickname: null,
      picture: null,
      name: null,
      mensagem: null,
      usuario_admin: request.session.usuario_admin    
    })
  }
})

const { requiresAuth } = require('express-openid-connect');

app.get('/meusdados', requiresAuth(), (request, response) => {
  // mensagem preenchida quando é realizada a atualização dos dados
  var mensagem = request.flash('success')
  let user_id = request.oidc.user.sub
  pool.query(`SELECT codigo FROM vagas WHERE disponivel = true ORDER BY codigo;
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
          lista_vagas: results[0].rows,
          vaga_sorteada: null,
          usuario_admin: request.session.usuario_admin
        })  
      } else {
        // converte de '[{"vaga": "S1G27"},{"vaga": "S1G28"}]' -> ['S1G27, S1G28']
        let vagas_escolhidas_array = results[1].rows[0].vagas_escolhidas
        let vagas_escolhidas = []
        // console.log('vagas_escolhidas_array '+vagas_escolhidas_array)
        if (vagas_escolhidas_array != null) {
          vagas_escolhidas_array.forEach(item => {
            vagas_escolhidas.push(item.vaga)
          })
        }
        // console.log('vagas_escolhidas '+vagas_escolhidas)
        response.render('meusdados.ejs', {
          user_id: user_id,
          email: request.oidc.user.email, 
          name: request.oidc.user.name,
          unidade: results[1].rows[0].unidade,
          vagas_escolhidas: vagas_escolhidas,
          mensagem: mensagem,
          lista_vagas: results[0].rows,
          vaga_sorteada: results[1].rows[0].vaga_sorteada,
          usuario_admin: request.session.usuario_admin
        })
      }
    }
  })  
})

app.post('/meusdados', requiresAuth(), (request, response) => {
  let user_id = request.oidc.user.sub
  let unidade = request.body.unidade 
  console.log(`Vagas escolhidas pela unidade ${unidade} [${request.body.vagas_escolhidas}]`)
  var vagas_escolhidas_array = [], vagas_escolhidas
  if (request.body.vagas_escolhidas.length > 0) {
    //console.log(request.body.vagas_escolhidas)
    let vagas_escolhidas_preenchida = request.body.vagas_escolhidas.split(',')
    //console.log('vagas_escolhidas_preenchida '+vagas_escolhidas_preenchida.length)
    if(vagas_escolhidas_preenchida.length > 0 ) {
      vagas_escolhidas_preenchida.forEach(vaga => {
        vagas_escolhidas_array.push({"vaga": vaga})
      })
      //console.log(vagas_escolhidas_array);
      vagas_escolhidas = JSON.stringify(vagas_escolhidas_array);
    }
  }
  var query = `UPDATE unidades SET user_id = NULL WHERE user_id = '${user_id}';`
  if (vagas_escolhidas == undefined) {
    query += `UPDATE unidades SET user_id = '${user_id}', vagas_escolhidas = NULL WHERE unidade = '${unidade}';`
  } else {
    query += `UPDATE unidades SET user_id = '${user_id}', vagas_escolhidas = '${vagas_escolhidas}' WHERE unidade = '${unidade}';`
  }
  query += `SELECT codigo FROM vagas WHERE disponivel = true ORDER BY codigo;`
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
  if (usuarios_admin.includes(request.oidc.user.email)) {    
    fs.readFile('init.sql', 'utf8', function(error, data) {
      if (error) {
        response.status(500).json({ status: 'error', message: error.message })
      } else {
        const query = data
        pool.query(query, (error, results) => {
          if (error) {
            response.status(500).json({ status: 'error', message: error.message })
          } else {
            console.log('Setup finalizado com sucesso.')
            response.send('Setup finalizado com sucesso.')
          }
        })    
      }
    })
  } else {
    console.log('Você não tem permissão para realizar esta ação.')
    response.send('Você não tem permissão para realizar esta ação.')
  }
})

const sorteia_vagas = (objetivo, vagas_disponiveis, query) => {
  return new Promise((resolve, reject) => {
    var unidades_e_vagas_sorteadas = []
    pool.query(query, (error, results) => {
      if (error) {
        //response.status(500).json({ status: 'warning', message: error.message })
        reject(error.message)
        return
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

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function formatDate(date, format) {
  if(format == 1) {
    return (
      [
        padTo2Digits(date.getDate()),
        padTo2Digits(date.getMonth() + 1),
        date.getFullYear(),
      ].join('/') +
      ' ' +
      [
        padTo2Digits(date.getHours()),
        padTo2Digits(date.getMinutes()),
        padTo2Digits(date.getSeconds()),
      ].join(':')
    )
  } else {
    return (
      [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
      ].join('-') +
      ' ' +
      [
        padTo2Digits(date.getHours()),
        padTo2Digits(date.getMinutes()),
        padTo2Digits(date.getSeconds()),
      ].join(':')
    )
  }
}

app.get('/sorteio', requiresAuth(), (request, response) => {
  // mensagem preenchida quando é realizada o sorteio
  var mensagem = request.flash('success')
  let user_id = request.oidc.user.sub
  pool.query(`SELECT * FROM configuracao;
              SELECT unidade, vaga_sorteada, vagas_escolhidas, presente FROM unidades ORDER BY unidade;
              SELECT codigo FROM vagas WHERE disponivel = true;`, (error, results) => {
    if (error) {
      console.log(error.message)
    } else {
      if (results[0].rows[0] == undefined) {
        response.render('sorteio.ejs', {
          email: request.oidc.user.email,
          name: request.oidc.user.name, 
          ultimo_sorteio: null,
          resultado_sorteio: null,
          lista_vagas_sorteadas: null,
          lista_presenca: null,
          mensagem: null,
          usuario_admin: request.session.usuario_admin
        })  
      } else {
        let ultimo_sorteio = formatDate(results[0].rows[0].ultimo_sorteio, 1)
        let lista_presenca = []  // lista criada para facilitar o tratamento de presenca
        results[1].rows.forEach(row => {
          lista_presenca.push(row.unidade+'-'+row.presente.toString())
        })
        if(results[2].rows.length != results[1].rows.length && mensagem.length == 0) {
          mensagem = `A quantidade de vagas (${results[2].rows.length}) é insuficiente para atender todas as unidades (${results[1].rows.length}).`
        }
        response.render('sorteio.ejs', {
          email: request.oidc.user.email,
          name: request.oidc.user.name, 
          ultimo_sorteio: ultimo_sorteio,
          resultado_sorteio: results[0].rows[0].resultado_sorteio,
          lista_vagas_sorteadas: results[1].rows,
          lista_presenca: lista_presenca,
          mensagem: mensagem,
          usuario_admin: request.session.usuario_admin
        })
      }
    }
  })  
})

app.post('/sorteio', (request, response) => {
  pool.query('SELECT codigo FROM vagas WHERE disponivel = true;', (error, results) => {
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

        sorteia_vagas('sorteio de unidades COM portadores de necessidade especiais', 
          vagas_disponiveis, 
          `SELECT unidade, vaga_sorteada, vagas_escolhidas FROM unidades 
            WHERE pne = true AND vaga_sorteada IS NULL`)
        .then(retorno => {
          vagas_disponiveis = retorno[0]
          //console.log('vagas_disponiveis (1) = '+vagas_disponiveis)
          retorno[1].forEach(element => {
            unidades_e_vagas_sorteadas.push(element)
            // verifica se a unidade recebeu alguma vaga
            if (element[1] != undefined) {
              query_gravacao += `UPDATE unidades SET vaga_sorteada = '${element[1]}' WHERE unidade = '${element[0]}'; `
            }            
          })
          //console.log('terminou sorteio de unidades COM portadores de necessidade especiais')

          sorteia_vagas('sorteio de unidades SEM portadores de necessidade especiais, PRESENTES e  ADIMPLENTES',
          vagas_disponiveis, 
          `SELECT unidade, vaga_sorteada, vagas_escolhidas FROM unidades 
            WHERE pne = false AND adimplente = true AND presente = true AND vaga_sorteada IS NULL`)
          .then(retorno => {
            vagas_disponiveis = retorno[0]
            retorno[1].forEach(element => {
              unidades_e_vagas_sorteadas.push(element)
              // verifica se a unidade recebeu alguma vaga
              if (element[1] != undefined) {
                query_gravacao += `UPDATE unidades SET vaga_sorteada = '${element[1]}' WHERE unidade = '${element[0]}'; `
              }            
            })

            sorteia_vagas('sorteio de unidades SEM portadores de necessidade especiais, PRESENTES e INADIMPLENTES',
            vagas_disponiveis, 
            `SELECT unidade, vaga_sorteada, vagas_escolhidas FROM unidades 
              WHERE pne = false AND adimplente = false AND presente = true AND vaga_sorteada IS NULL`)
            .then((retorno) => {
              vagas_disponiveis = retorno[0]
              retorno[1].forEach(element => {
                unidades_e_vagas_sorteadas.push(element)
                // verifica se a unidade recebeu alguma vaga
                if (element[1] != undefined) {
                  query_gravacao += `UPDATE unidades SET vaga_sorteada = '${element[1]}' WHERE unidade = '${element[0]}'; `
                }            
              })

              sorteia_vagas('sorteio de unidades SEM portadores de necessidade especiais e AUSENTES',
              vagas_disponiveis, 
              `SELECT unidade, vaga_sorteada, vagas_escolhidas FROM unidades 
                WHERE pne = false AND presente = false AND vaga_sorteada IS NULL`)
              .then((retorno) => {
                vagas_disponiveis = retorno[0]
                retorno[1].forEach(element => {
                  unidades_e_vagas_sorteadas.push(element)
                  // verifica se a unidade recebeu alguma vaga
                  if (element[1] != undefined) {
                    query_gravacao += `UPDATE unidades SET vaga_sorteada = '${element[1]}' WHERE unidade = '${element[0]}'; `
                  }            
                })
                // verifica se todas as unidades foram contempladas pelo sorteio
                var qtd_unidades_sorteadas = 0, qtd_vagas_sorteadas = 0
                unidades_e_vagas_sorteadas.forEach(element => {
                  //console.log('qtd_unidades_sorteadas (element[0]) '+element[0]+' qtd_vagas_sorteadas (element[1]) '+element[1])
                  qtd_unidades_sorteadas += (element[0] != null ? 1 : 0 )
                  qtd_vagas_sorteadas += (element[1] != null ? 1 : 0 )
                })
                let data_atual = formatDate(new Date(), 2)
                if ((qtd_vagas_sorteadas == 0 && qtd_unidades_sorteadas == 0)) {
                  let mensagem = 'Falha no sorteio. Unidades: ' + qtd_unidades_sorteadas + ' - Vagas: ' +qtd_vagas_sorteadas
                  query_gravacao += `UPDATE configuracao SET ultimo_sorteio = '${data_atual}', resultado_sorteio = '${mensagem}' WHERE id = 1; `              
                  response.status(500).json({ status: 'error', message: mensagem })
                } else {  
                  let mensagem 
                  if (qtd_vagas_sorteadas != qtd_unidades_sorteadas) {
                    mensagem = 'Sorteio realizado porém nem todas as unidades foram contempladas. Unidades: ' + qtd_unidades_sorteadas + ' - Vagas: ' +qtd_vagas_sorteadas
                  } else {
                    mensagem = 'Sorteio realizado com sucesso. Unidades: '+qtd_unidades_sorteadas + ' - Vagas: ' +qtd_vagas_sorteadas
                  }
                  query_gravacao += `UPDATE configuracao SET ultimo_sorteio = '${data_atual}', resultado_sorteio = '${mensagem}' WHERE id = 1; `              
                  pool.query(query_gravacao, (error, results) => {
                    if (error) {
                      // console.log(query_gravacao)
                      console.log('Falha no sorteio. Mensagem de erro: '+error.message)
                      // response.status(500).json({ status: 'warning', message: error.message })      
                    } else {                      
                      // response.status(200).json({ status: 'success', message: mensagem })
                      request.flash('success', mensagem);
                      response.redirect(301, '/sorteio')                    
                    }
                  })
                }
              })
              .catch(error => {
                console.log(error)
                response.status(500).json({ status: 'error', message: error })
                return
              })        

            })        
            .catch(error => {
              console.log(error)
              response.status(500).json({ status: 'error', message: error })
              return
            })        
  
          })        
          .catch(error => {
            console.log(error)
            response.status(500).json({ status: 'error', message: error })
            return
          })        

        })
        .catch(error => {
          console.log(error)
          response.status(500).json({ status: 'error', message: error })
          return
        })        

      }
    }
  })
})

app.get('/sorteio/reiniciar', requiresAuth(), (request, response) => {
  pool.query(`UPDATE unidades SET vaga_sorteada = null;
              UPDATE configuracao SET resultado_sorteio = 'Sorteio não realizado' RETURNING *;`, (error, results) => {
    if (error) {
      console.log(error.message)
      response.status(500).json({ status: 'error', message: error })
    } else {      
      if (results[1].rows[0].resultado_sorteio == 'Sorteio não realizado' ) {
        console.log('Sorteio reiniciado com sucesso!')
        response.redirect(301, '/sorteio') 
      } else {
        response.status(500).json({ status: 'error', message: 'Falha no processo de reinicio. Procure o administrador.' })
      }
    }
  })  
})

app.get('/vagas', requiresAuth(), (request, response) => {
  var mensagem = request.flash('success')
  let user_id = request.oidc.user.sub
  pool.query(`SELECT * FROM configuracao;
              SELECT codigo, disponivel FROM vagas ORDER BY codigo;`, (error, results) => {
    if (error) {
      console.log(error.message)
    } else {
      if (results[0].rows[0] == undefined) {
        response.render('vagas.ejs', {
          email: request.oidc.user.email,
          name: request.oidc.user.name, 
          ultimo_sorteio: null,
          resultado_sorteio: null,
          lista_vagas: null,
          lista_ajustada_vagas: null,
          mensagem: null,
          usuario_admin: request.session.usuario_admin
        })  
      } else {
        let ultimo_sorteio = formatDate(results[0].rows[0].ultimo_sorteio, 1)
        let lista_vagas = []  // lista criada para facilitar o tratamento da vaga
        results[1].rows.forEach(row => {
          lista_vagas.push(row.codigo+'-'+row.disponivel.toString())
        })
        response.render('vagas.ejs', {
          email: request.oidc.user.email,
          name: request.oidc.user.name, 
          ultimo_sorteio: ultimo_sorteio,
          resultado_sorteio: results[0].rows[0].resultado_sorteio,
          lista_vagas: results[1].rows,
          lista_ajustada_vagas: lista_vagas,
          mensagem: mensagem,
          usuario_admin: request.session.usuario_admin
        })
      }
    }
  })  
})

app.post('/vagas/atualiza_disponibilidade', requiresAuth(), (request, response) => {
  const codigo = request.body.codigo
  const disponivel = request.body.disponivel
  const query = `UPDATE vagas SET disponivel = '${disponivel}' WHERE codigo = '${codigo}';`
  console.log(query);
  pool.query(query, (error, results) => {
    if (error) {
      response.status(500).json({ status: 'error', message: error })
    } else {
      response.status(200).json({ status: 'success', message: 'registro atualizado com sucesso!' }) 
    }
  })  
})

app.post('/unidades/atualiza_presenca', requiresAuth(), (request, response) => {
  const unidade = request.body.unidade
  const presente = request.body.presente
  const query = `UPDATE unidades SET presente = '${presente}' WHERE unidade = '${unidade}';`
  console.log(query);
  pool.query(query, (error, results) => {
    if (error) {
      response.status(500).json({ status: 'error', message: error })
    } else {
      response.status(200).json({ status: 'success', message: 'registro atualizado com sucesso!' }) 
    }
  })  
})

app.get('/unidades', requiresAuth(), (request, response) => {
  pool.query(`SELECT * FROM configuracao;
              SELECT unidade, pne, adimplente FROM unidades ORDER BY unidade;`, (error, results) => {
    if (error) {
      console.log(error.message)
    } else {
      if (results[0].rows[0] == undefined) {
        response.render('unidades.ejs', {
          email: request.oidc.user.email,
          name: request.oidc.user.name, 
          lista_unidades: null,
          lista_ajustada_unidades: null,
          resultado_sorteio: null,
          mensagem: null,
          usuario_admin: request.session.usuario_admin
        })  
      } else {
        var mensagem
        if (results[0].rows[0].resultado_sorteio != 'Sorteio não realizado' ) {  
          let ultimo_sorteio = formatDate(results[0].rows[0].ultimo_sorteio, 1)        
          mensagem = `As condições não podem ser alteradas porque o sorteio foi realizado em ${ultimo_sorteio}. É preciso reiniciar o processo!`
        }
        let lista_unidades = []  // lista criada para facilitar o tratamento de presenca
        results[1].rows.forEach(row => {
          lista_unidades.push(row.unidade+'-'+row.pne.toString()+'-'+row.adimplente.toString())
        })
        response.render('unidades.ejs', {
          email: request.oidc.user.email,
          name: request.oidc.user.name, 
          lista_unidades: results[1].rows,
          lista_ajustada_unidades: lista_unidades,
          resultado_sorteio: results[0].rows[0].resultado_sorteio,
          mensagem: mensagem,
          usuario_admin: request.session.usuario_admin
        })
      }
    }
  })  
})

app.post('/unidades/atualiza_pne', requiresAuth(), (request, response) => {
  const unidade = request.body.unidade
  const pne = request.body.pne
  const query = `UPDATE unidades SET pne = '${pne}' WHERE unidade = '${unidade}';`
  console.log(query);
  pool.query(query, (error, results) => {
    if (error) {
      response.status(500).json({ status: 'error', message: error })
    } else {
      response.status(200).json({ status: 'success', message: 'registro atualizado com sucesso!' }) 
    }
  })  
})

app.post('/unidades/atualiza_adimplente', requiresAuth(), (request, response) => {
  const unidade = request.body.unidade
  const adimplente = request.body.adimplente
  const query = `UPDATE unidades SET adimplente = '${adimplente}' WHERE unidade = '${unidade}';`
  console.log(query);
  pool.query(query, (error, results) => {
    if (error) {
      response.status(500).json({ status: 'error', message: error })
    } else {
      response.status(200).json({ status: 'success', message: 'registro atualizado com sucesso!' }) 
    }
  })  
})

// Start server
const PORT = process.env.PORT || 3000
if (development_env) {
  // we will pass our 'app' to 'https' server
  const https = require('https');
  https.createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
    passphrase: process.env.SECRET
  }, app)
  .listen(PORT, () => {
    console.log(`Server listening at ${PORT}. Environment development: ${development_env}`)
  })
} else {
  app.listen(PORT, () => {
    console.log(`Server listening at ${PORT}. Environment development: ${development_env}`)
  })  
}