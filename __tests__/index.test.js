// Não esquecer de rodar na linha de comando: export NODE_TLS_REJECT_UNAUTHORIZED='0'

const request = require("supertest");
const app = require("../index.js");

describe("Test the root path", () => {
  test("It should response the GET method", () => {
    return request(app)
      .get("/")
      .then((response) => {
        expect(response.statusCode).toBe(200);
      });
  });
});

