const util = require('./util');

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
    .then((retorno) => { teste(retorno) })
    .then(() => {
        let data_atual = util.formatDate(new Date(), 2)
        console.log(data_atual)
    })
