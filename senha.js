var speakeasy = require("speakeasy");
var secret = speakeasy.generateSecret({length: 20});

var token = speakeasy.totp({
    secret: secret.base32,
    encoding: 'base32',
    step: 60,    
    window: 3
  });

var inicio = 160000;
console.log(new Date().toJSON()+' - '+token);
const myTimeout = setTimeout(verify, inicio);
function verify() { 
    var tokenValidates = speakeasy.totp.verify({
        secret: secret.base32,
        encoding: 'base32',
        token: token,
        step: 60,    
        window: 3
      });
    console.log(new Date().toJSON()+' - '+tokenValidates);
}

const myTimeout2 = setTimeout(verify, inicio + 10000);
const myTimeout3 = setTimeout(verify, inicio + 20000);
const myTimeout4 = setTimeout(verify, inicio + 30000);
const myTimeout5 = setTimeout(verify, inicio + 40000);
