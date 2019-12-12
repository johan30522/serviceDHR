const axios = require('axios');

let auth = "Basic " + new Buffer(global.gConfig.userDomino + ":" + global.gConfig.pwdDomino).toString("base64");
let optionHeaders = {
    'cache-control': 'no-cache',
    Authorization: auth,
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8'
};
const getExpedientsDomino = async() => {
    try {
        let options = {
            method: 'get',
            url: global.gConfig.endPointDomino + '/pendientes',
            headers: optionHeaders
        }
        let promise = await new Promise((resolve, reject) => {
            axios(options)
                .then((response) => {
                    //console.log(response);
                    if (response.hasOwnProperty('data')) {
                        resolve(response.data.Results);
                    } else {
                        reject(`Error Conectando con ${global.gConfig.endPointDomino} `);
                    }
                })
                .catch(err => {
                    reject(`Error Conectando con ${global.gConfig.endPointDomino} ` + err);
                })
        });
        return promise;
    } catch (error) {
        throw new Error(error);
    }
}
const postExpedientDomino = async(data) => {
    try {
        let options = {
            method: 'post',
            url: global.gConfig.endPointDomino + '/process',
            headers: optionHeaders,
            data: data
        }
        let promise = await new Promise((resolve, reject) => {
            axios(options)
                .then((response) => {
                    //console.log(response);
                    if (response.hasOwnProperty('data')) {
                        resolve(response.data);
                    } else {
                        reject(`Error Conectando con ${global.gConfig.endPointDomino} `);
                    }
                })
                .catch(err => {
                    reject(`Error Conectando con ${global.gConfig.endPointDomino} ` + err);
                })
        });
        return promise;
    } catch (error) {
        throw new Error(error);
    }
}
const getConfigEcertia = async() => {
    try {
        let options = {
            method: 'get',
            url: global.gConfig.endPointDomino + '/config',
            headers: optionHeaders
        }
        let promise = await new Promise((resolve, reject) => {
            axios(options)
                .then((response) => {
                    //console.log(response);
                    if (response.hasOwnProperty('data')) {
                        resolve(response.data);
                    } else {
                        reject(`Error Conectando con ${global.gConfig.endPointDomino} `);
                    }
                })
                .catch(err => {
                    reject(`Error Conectando con ${global.gConfig.endPointDomino} ` + err);
                })
        });
        return promise;
    } catch (error) {
        throw new Error(error);
    }
}
module.exports = {
    getConfigEcertia,
    getExpedientsDomino,
    postExpedientDomino
}