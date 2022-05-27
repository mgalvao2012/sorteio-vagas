const puppeteer = require("puppeteer");
const request = require("supertest");
const app = require("../index.js");

describe("Pagina inicial", () => {
  let page;
  beforeAll(async () => {
    const browser = await puppeteer.launch({
      ignoreHTTPSErrors: true,
    });
    page = await browser.newPage();
    await page.goto(`${process.env.baseURL}`, {
      waitUntil: "networkidle2",
    });
  });

  it('Deve aparecer o título "Sorteio de vagas de estacionamento do Condomínio Grandlife Ipiranga"', async () => {
    await expect(page.title()).resolves.toMatch(
      "Sorteio de vagas de estacionamento do Condomínio Grandlife Ipiranga"
    );
  });

  afterAll(async () => {
    await page.close();
  });
});

describe("Fale conosco", () => {
  let page;
  beforeAll(async () => {
    const browser = await puppeteer.launch({
      ignoreHTTPSErrors: true,
    });
    page = await browser.newPage();
    await page.goto(`${process.env.baseURL}/#faleconosco`, {
      waitUntil: "networkidle2",
    });
    await page.type("[name=nome]", "nome digitado");
    await page.type("[name=email]", "email@example.com");
    await page.type("[name=assunto]", "assunto digitado");
    await page.type("[name=mensagem]", "mensagem digitado");
    await page.click('#btnEnviarMensagem');
  });
  it('Deve aparecer o título "Sorteio de vagas de estacionamento do Condomínio Grandlife Ipiranga"', async () => {
    await expect(page.title()).resolves.toMatch(
      "Sorteio de vagas de estacionamento do Condomínio Grandlife Ipiranga"
    );
  });

  afterAll(async () => {
    await page.close();
  });
});

/*
describe("Login", () => {
  let page;
  beforeAll(async () => {
    const browser = await puppeteer.launch({
      ignoreHTTPSErrors: true,
    });
    page = await browser.newPage();
    await page.goto(`${process.env.baseURL}/login`, {
      waitUntil: "networkidle2",
    });
    await page.type("[name=username]", "mgalvao2012@gmail.com");
    await page.type("[name=password]", "Senha123@");
    await page.keyboard.press('Enter');
    await page.screenshot({path: 'login.png'});
  }); 
  it('Deve aparecer o nome do usuário no topo direito da página', async () => {
    await expect(page.title()).resolves.toMatch(
      "Sorteio de vagas de estacionamento do Condomínio Grandlife Ipiranga"
    );
  });

  afterAll(async () => {
    await page.close();
  });
});
*/
