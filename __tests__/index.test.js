// Não esquecer de rodar na linha de comando: export NODE_TLS_REJECT_UNAUTHORIZED='0'

const puppeteer = require("puppeteer");
const request = require("supertest");
const app = require("../index.js");
/*
describe("Acessa a página inicial", () => {
  test("It should response the GET method", () => {
    return request(app)
      .get("https://localhost:3000/")
      .then((response) => {
        expect(response.statusCode).toBe(200);
      });
  });
});
*/

describe("Pagina inicial", () => {
  let page;
  beforeAll(async () => {
    const browser = await puppeteer.launch({
      ignoreHTTPSErrors: true,
    });
    page = await browser.newPage();
    await page.goto("https://localhost:3000/", {
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
  //jest.setTimeout(20000);
  let page;
  beforeAll(async () => {
    const browser = await puppeteer.launch({
      ignoreHTTPSErrors: true,
    });
    page = await browser.newPage();
    await page.goto("https://localhost:3000/#faleconosco", {
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
