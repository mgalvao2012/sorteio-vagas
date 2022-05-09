const util = require('./util');

async function teste() {
    try {
        await new Promise((resolve, reject) => {
            console.log('1')
            resolve('1')
        });
        await new Promise((resolve, reject) => {
            console.log('2')
            resolve('2')
        });
    } catch (err) {
        console.log(err)
    }
}

teste()
    .then(() => { teste() })
    .then(() => {
        let data_atual = util.formatDate(new Date(), 2)
        console.log(data_atual)
    })
