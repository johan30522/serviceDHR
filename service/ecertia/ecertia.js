const axios = require('axios');


const getEvidencias = async(idMail, comfigEcertia) => {
    console.log(comfigEcertia);
    try {
        let auth = "Basic " + new Buffer(comfigEcertia.UserService + ":" + comfigEcertia.PwdService).toString("base64");
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