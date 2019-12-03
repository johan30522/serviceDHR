const axios = require('axios');


const getEvidencias = async(idMail, comfigEcertia) => {
    console.log(comfigEcertia);
    try {
        let auth = "Basic " + new Buffer(comfigEcertia.UserService + ":" + comfigEcertia.PwdService).toString("base64");
        // const instance = axios.create({
        //     baseURL: comfigEcertia.EndpointService,
        //     timeout: 5000,
        //     headers: {
        //         'cache-control': 'no-cache',
        //         Authorization: auth,
        //         Accept: 'application/json',
        //         'Content-Type': 'application/json'
        //     },
        //     data: {
        //         WithUniqueIds: idMail,
        //         "IncludeAffidavits": 1,
        //         "IncludeAttachments": 0
        //     },
        //     json: true
        // });
        // const resp = await instance.get();
        // if (resp.data.results.lenght === 0) {
        //     throw new Error(`no hay resultados para ${id}`)
        // }

        // const data = resp.data;
        // return data;
        let promise = new Promise((resolve, reject) => {
            axios({
                    method: 'get',
                    url: comfigEcertia.EndpointService,
                    headers: {
                        'cache-control': 'no-cache',
                        Authorization: auth,
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    data: {
                        WithUniqueIds: idMail,
                        IncludeAffidavits: 1,
                        IncludeAttachments: 0
                    }
                })
                .then((response) => {
                    //console.log(response.data);
                    resolve(response.data);
                })
                .catch(err => {
                    reject(err);
                })
        });

        return promise;
    } catch (error) {
        throw new Error(error);
    }
}
module.exports = {
    getEvidencias
}