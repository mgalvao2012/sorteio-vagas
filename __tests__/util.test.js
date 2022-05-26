const util = require('../util');

describe("Util tests function", () => {
  
  it("enviarEmail", async () => {
    const email = 'example@test.com';
    let myPromise = new Promise(function(resolve) {      
      resolve(util.enviarEmail(email,'subject test','content test'));
    });
    expect(await myPromise).toBe(`Email enviado para ${email}`);
  });

  it("enviarEmailHTML", async () => {
    const email = 'example@test.com';
    let myPromise = new Promise(function(resolve) {      
      resolve(util.enviarEmailHTML(email,'subject test','content test'));
    });
    expect(await myPromise).toBe(`Email enviado para ${email}`);
  });

  it("formatDate - format 1", () => {
    expect(util.formatDate(new Date('2022-05-25T16:05:10Z'),1)).toBe('25/05/2022 13:05:10');
  });
  it("formatDate - format 2", () => {
    expect(util.formatDate(new Date('2022-05-25T16:05:10Z'),2)).toBe('2022-05-25 13:05:10');
  });

  /*
  it("usuarioDefiniuUnidade", async () => {
    let response 
    let myPromise = new Promise(function(resolve) {      
      let request = '', response = '';
      request.session.unidade_usuario = '';
      resolve(util.usuarioDefiniuUnidade(request, response));
    });
    expect(await myPromise).toBe('meusdados');
  });
  */

});