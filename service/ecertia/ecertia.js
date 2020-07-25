const axios = require('axios');


const getEvidencias = async(idMail, comfigEcertia) => {

    try {
        const staticParams = '&IncludeAffidavits=true&includeAffidavitBlobs=true&IncludeAttachments=true&includeAttachmentBlobs=false';
        let auth = "Basic " + new Buffer(comfigEcertia.UserService + ":" + comfigEcertia.PwdService).toString("base64");
        let promise = new Promise((resolve, reject) => {
            axios({
                    method: 'get',
                    url: `${comfigEcertia.EndpointService}?WithUniqueIds=${idMail}${staticParams}`,
                    headers: {
                        'cache-control': 'no-cache',
                        Authorization: auth,
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                .then((response) => {
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