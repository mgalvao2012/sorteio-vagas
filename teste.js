const util = require("./util");
const crypto = require("crypto").webcrypto;

async function calculate(x) {
  await new Promise((resolve, reject) => {
    x++;
    console.log(x);
    resolve(x);
  });
}

async function teste(x) {
  try {
    await new Promise((resolve, reject) => {
      x++;
      console.log(x);
      resolve(x);
    });
    await new Promise((resolve, reject) => {
      x++;
      let random = () =>
        crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32;
      console.log("random " + random());
      console.log(x);
      resolve(x);
    });
    return x;
  } catch (err) {
    console.log(err);
  }
}

var x = 0;
teste(x)
  .then((y) => {
    console.log("y " + y);
  })
  .then((retorno) => {
    teste(x);
  })
  .then(() => {
    let data_atual = util.formatDate(new Date(), 2);
    console.log(data_atual);
  });

var _Promise = require("bluebird");
var randomNumber = require("random-number-csprng");

for (let i = 0; i < 10; i++) {
  _Promise
    .try(function () {
      return randomNumber(1, 1e8);
    })
    .then(function (number) {
      console.log("Your random number:", number / 1e8);
    })
    .catch({ code: "RandomGenerationError" }, function (err) {
      console.log("Something went wrong!");
    });
}

const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    ignoreHTTPSErrors: true
  });
  const page = await browser.newPage();
  await page.goto("https://localhost:3000", {
    waitUntil: "networkidle2",
  });
  await browser.close();
})();
