const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const helmet = require('helmet')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
const { body, check } = require('express-validator')
const { pool } = require('./config')

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
  // TO-DO configurar a criação das tabelas
  const query = `
  DROP TABLE IF EXISTS vagas;
  DROP TABLE IF EXISTS unidades;
  
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
      response.status(503).json({ status: 'error', message: error.message })
    } else {
      response.send('Setup finalizado com sucesso.')
    }
  })
})

function sorteia_vagas(vagas_disponiveis, query) {
  pool.query(query, (error, results) => {
    if (error) {
      response.status(503).json({ status: 'warning', message: error.message })
    }
    var aptos = results.rows
    // sorteia aleatoriamente a lista de unidades
    aptos.sort(function(a, b){return 0.5 - Math.random()})
    aptos.forEach(unidades_element => {
      var vagas_escolhidas = unidades_element.vagas_escolhidas 
      //console.log('vagas_escolhidas')           
      //console.log(vagas_escolhidas)
      if (vagas_escolhidas != null) {
        vagas_escolhidas.forEach(vagas_element => {
          if (unidades_element.vaga_sorteada === null) { 
            //console.log('vagas_element.vaga '+vagas_element.vaga)           
            var indice_lista_vagas_disponiveis = vagas_disponiveis.indexOf(vagas_element.vaga)
            //console.log('indice_lista_vagas_disponiveis')
            //console.log(indice_lista_vagas_disponiveis)              
            if (indice_lista_vagas_disponiveis > -1) {
              //console.log('vagas_disponiveis[indice_lista_vagas_disponiveis] '+vagas_disponiveis[indice_lista_vagas_disponiveis])
              unidades_element.vaga_sorteada = vagas_disponiveis[indice_lista_vagas_disponiveis]
              vagas_disponiveis.splice(indice_lista_vagas_disponiveis, 1);
              //console.log('vagas_disponiveis '+vagas_disponiveis)                
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
        //console.log('vagas_disponiveis '+vagas_disponiveis)                
      }
      console.log('unidades_element')
      console.log(unidades_element)
    })
    console.log('vagas_disponiveis')
    console.log(vagas_disponiveis)  
  })
  return vagas_disponiveis
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
      //console.log('vagas_disponiveis')
      //console.log(vagas_disponiveis)
      var qtd_de_vagas_disponiveis = vagas_disponiveis.length
      //console.log(qtd_de_vagas_disponiveis)
      if (qtd_de_vagas_disponiveis < 1) {
        response.status(503).json({ status: 'error', message: 'Não há vagas disponíveis' })
      } else {
        // sorteio unidades com portadores de necessidade especiais
        console.log('sorteio unidades com portadores de necessidade especiais')
        vagas_disponiveis = sorteia_vagas(vagas_disponiveis, 
          'SELECT unidade, vaga_sorteada, vagas_escolhidas FROM unidades WHERE pne = true AND presente = true')
        
        // sorteio unidades sem portadores de necessidade especiais
        console.log('sorteio unidades sem portadores de necessidade especiais')
        vagas_disponiveis = sorteia_vagas(vagas_disponiveis, 
          'SELECT unidade, vaga_sorteada, vagas_escolhidas FROM unidades WHERE adimplente = true AND pne = false AND presente = true')  

        // sorteio unidades sem portadores de necessidade especiais e inadimplentes
        console.log('sorteio unidades sem portadores de necessidade especiais e inadimplentes')
        vagas_disponiveis = sorteia_vagas(vagas_disponiveis, 
          'SELECT unidade, vaga_sorteada, vagas_escolhidas FROM unidades WHERE adimplente = false AND pne = false AND presente = true')  

        // sorteio unidades sem portadores de necessidade especiais e ausentes
        console.log('sorteio unidades sem portadores de necessidade especiais e ausentes')
        vagas_disponiveis = sorteia_vagas(vagas_disponiveis, 
          'SELECT unidade, vaga_sorteada, vagas_escolhidas FROM unidades WHERE pne = false AND presente = false')  

        response.status(200).json({ status: 'success', message: 'Sorteio realizado com sucesso.' })
      }
    }
  })
})


// Start server
app.listen(process.env.PORT || 3002, () => {
  console.log(`Server listening`)
})