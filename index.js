const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const helmet = require('helmet')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
const { body, check } = require('express-validator')
const { pool } = require('./config')
const { query_timeout } = require('pg/lib/defaults')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(compression())
app.use(helmet())

const isProduction = process.env.NODE_ENV === 'production'
const origin = {
  origin: isProduction ? process.env.URL_PRODUCTION : '*',
}
app.use(cors(origin))

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 requests,
})
const postLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
})

app.use(limiter, (request, response, next) => {
  if (request.url != '/' && request.url != '/sorteio') {
    if (
      !request.header('apiKey') ||
      request.header('apiKey') !== process.env.API_KEY
    ) {
      return response
        .status(401)
        .json({ status: 'error', message: 'Unauthorized.' })
    }
  }
  next()
})

app.get('/', (request, response) => {
  response.send('Projeto SVE - Sorteio de Vagas de Estacionamento do Condomínio Grandlife Ipiranga')
})

app.get('/setup', (request, response) => {
  const query = `
  DROP TABLE IF EXISTS unidades;
  DROP TABLE IF EXISTS vagas;
  
  CREATE TABLE vagas (
    codigo CHAR(5) PRIMARY KEY,
    bloqueada BOOLEAN
  );
  
  CREATE TABLE unidades (
    unidade CHAR(5) PRIMARY KEY,
    pne BOOLEAN,
    presente BOOLEAN,
    adimplente BOOLEAN,
    vaga_sorteada CHAR(5) REFERENCES Vagas (codigo),
    vagas_escolhidas JSONB
  );
  
  INSERT INTO vagas (codigo, bloqueada) VALUES ('T1G01', false);
  INSERT INTO vagas (codigo, bloqueada) VALUES ('T1G02', false);
  INSERT INTO vagas (codigo, bloqueada) VALUES ('T1G03', false);
  INSERT INTO vagas (codigo, bloqueada) VALUES ('T1G04', false);
  INSERT INTO vagas (codigo, bloqueada) VALUES ('T1G05', false);
  INSERT INTO vagas (codigo, bloqueada) VALUES ('T1G06', true);
  INSERT INTO vagas (codigo, bloqueada) VALUES ('T1G07', false);
  INSERT INTO vagas (codigo, bloqueada) VALUES ('T1G08', false);
  INSERT INTO vagas (codigo, bloqueada) VALUES ('T1G09', false);
  INSERT INTO vagas (codigo, bloqueada) VALUES ('T1G10', false);
  
  INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas)
  VALUES ('T1041', false, true, true, NULL, '[{"vaga": "T1G01"},{"vaga": "T1G02"}]');
  INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas)
  VALUES ('T1042', false, true, true, NULL, NULL);
  INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas)
  VALUES ('T1043', false, true, false, NULL, '[{"vaga": "T1G01"},{"vaga": "T1G03"}]');
  INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas)
  VALUES ('T1044', false, true, true, NULL, '[{"vaga": "T1G04"},{"vaga": "T1G05"}]');
  INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas)
  VALUES ('T1051', false, false, true, NULL, '[{"vaga": "T1G04"},{"vaga": "T1G05"}]');
  INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas)
  VALUES ('T1052', false, false, true, NULL, '[{"vaga": "T1G03"},{"vaga": "T1G04"},{"vaga": "T1G05"}]');
  INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas)
  VALUES ('T1053', true, true, true, NULL, '[{"vaga": "T1G01"},{"vaga": "T1G08"},{"vaga": "T1G04"}]');
  INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas)
  VALUES ('T1054', true, true, true, NULL, '[{"vaga": "T1G01"},{"vaga": "T1G08"},{"vaga": "T1G04"}]');
  INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas)
  VALUES ('T1061', true, true, true, NULL, NULL);
  `

  pool.query(query, (error, results) => {
    if (error) {
      response.status(500).json({ status: 'error', message: error.message })
    } else {
      response.send('Setup finalizado com sucesso.')
    }
  })
})

function sorteia_vagas(objetivo, vagas_disponiveis, query) {
  return new Promise(function(resolve, reject) {
    var unidades_e_vagas_sorteadas = []
    pool.query(query, (error, results) => {
      if (error) {
        response.status(503).json({ status: 'warning', message: error.message })
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
              }
            }
          })
          // se ao final todas as vagas escolhidas foram sorteadas, o apartamento recebe a primeira vaga disponivel
          if (unidades_element.vaga_sorteada === null) {
            unidades_element.vaga_sorteada = vagas_disponiveis[0]
            vagas_disponiveis.splice(0, 1);
          }
        } else {
          // se o apartamento sorteado não escolheu nenhuma vaga ele deverá pegar a primeira disponível
          unidades_element.vaga_sorteada = vagas_disponiveis[0]
          vagas_disponiveis.splice(0, 1);
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
      response.status(503).json({ status: 'error', message: 'Não há vagas disponíveis' })
    } else {
      // cria um array de vagas disponiveis
      var vagas_disponiveis = []
      results.rows.forEach(element => { 
        vagas_disponiveis.push(element.codigo)
      })
      var qtd_de_vagas_disponiveis = vagas_disponiveis.length
      if (qtd_de_vagas_disponiveis < 1) {
        response.status(503).json({ status: 'error', message: 'Não há vagas disponíveis' })
      } else {
        var unidades_e_vagas_sorteadas = []
        var query_gravacao = ''

        let retornoGrupo1 = sorteia_vagas('sorteio de unidades COM portadores de necessidade especiais', 
          vagas_disponiveis, 
          `SELECT unidade, vaga_sorteada, vagas_escolhidas FROM unidades 
            WHERE pne = true AND presente = true`)
          .then((retorno) => {
            return retorno
          })        
        let acessaRetornoGrupo1 = () => {
          retornoGrupo1.then((retorno) => {
            vagas_disponiveis = retorno[0]
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
            WHERE pne = false AND adimplente = true AND presente = true`)
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
            WHERE pne = false AND adimplente = false AND presente = true`)
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
            WHERE pne = false AND presente = false`)
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
            if (qtd_vagas_sorteadas != qtd_unidades_sorteadas) {
              response.status(500).json({ status: 'error', 
                message: 'Falha no sorteio. Unidades: ' + qtd_unidades_sorteadas + ' - Vagas: ' +qtd_vagas_sorteadas})
            } else {              
              pool.query(query_gravacao, (error, results) => {
                if (error) {
                  response.status(503).json({ status: 'warning', message: error.message })      
                } else {
                  response.status(200).json({ status: 'success', message: 'Sorteio realizado com sucesso.' })
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
const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server listening at ${PORT}`)
})