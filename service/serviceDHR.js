const rp = require('request-promise');
const fs = require('fs').promises
const config = require('../config/config');
const domino = require('./domino/domino');
const ecertia = require('./ecertia/ecertia');

//get the response from provider to get the attachments
const getEvidence = async() => {
    try {

        let expedients = await domino.getExpedientsDomino();
        console.log(expedients);
        if (!expedients.hasOwnProperty('error')) {
            // console.log(expedients);

            let configEcertia = await domino.getConfigEcertia();
            for (let expe of expedients) {
                console.log(expe.idCorreo);
                let evidencias = await ecertia.getEvidencias(expe.idCorreo, configEcertia);
                //console.log(evidencias);
                //console.log(evidencias);
                saveAttachmentsEvidence(evidencias, expe.numExpediente) //Procesa y salva los anexos de evidencias 
                    .then(async result => {
                        //Actualiza estado en Domino por medio del API
                        let expedienteMod = {
                            "numExpediente": expe.numExpediente,
                            "evidencesNames": result
                        };
                        //Actualiza en Domino
                        console.log('Archivos para domino:');
                        console.log(expedienteMod);
                        let msgExpediente = await domino.postExpedientDomino(expedienteMod);
                        console.log(msgExpediente);
                    })
                    .catch(error => config.log.warn(error))
            }
        } else {
            config.log.warn(expedients.error);
        }
    } catch (error) {
        config.log.warn(error);
    }


}
const saveAttachmentsEvidence = async(body, numExpediente) => {
    let results = body.results;
    let date = new Date().getTime();
    let arrayFilesNames = [];
    let promise = await new Promise((resolve, reject) => {
        for (let result of results) {
            let evidences = result.affidavits;
            for (let evidence of evidences) {
                let evidenceDescription = evidence.description
                let evidenceBody = evidence.bytes;
                let filename = evidenceDescription + '_' + date + '.pdf';
                let file = '/files/' + numExpediente + "/" + filename;
                Promise.resolve()
                    .then(function() { config.ensureDir('/files/' + numExpediente) }) //crea el directorio on el numero de expediente
                    .then(() => { //crea los archivos de evidencias
                        config.log.info(`>>Crea el archivo : ${file}`);
                        console.log("Guarda el archivo");
                        arrayFilesNames.push(file);
                        fs.writeFile(file, evidenceBody, 'base64', err => { // ecertia return base64 formtat files
                            if (err)
                                reject(err);
                        });
                    })
                    .catch(err => { reject(err); })
            }
        }
        resolve(arrayFilesNames);
    })
    return promise;
}
module.exports = {
    getEvidence
}