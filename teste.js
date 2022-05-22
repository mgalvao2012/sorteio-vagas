const util = require('./util');

async function calculate(x) {
    await new Promise((resolve, reject) => {
        x++
        console.log(x)
        resolve(x)
    });
}

async function teste(x) {
    try {
        await new Promise((resolve, reject) => {
            x++
            console.log(x)
            resolve(x)
        });
        await new Promise((resolve, reject) => {
            x++
            console.log(x)
            resolve(x)
        });
        return x 
    } catch (err) {
        console.log(err)
    }
}

var x = 0;
teste(x)
    .then((y) => { console.log('y '+y); })
    .then((retorno) => { teste(x); })
    .then(() => {
        let data_atual = util.formatDate(new Date(), 2)
        console.log(data_atual)
    })
