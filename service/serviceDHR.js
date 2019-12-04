const rp = require('request-promise');
const fs = require('fs').promises
const config = require('../config/config');
const domino = require('./domino/domino');
const ecertia = require('./ecertia/ecertia');

//get the response from provider to get the attachments
const getEvidence = async() => {

    let expedients = await domino.getExpedientsDomino();
    let configEcertia = await domino.getConfigEcertia();
    for (let expe of expedients) {
        console.log(expe.idCorreo);
        let evidencias = await ecertia.getEvidencias('2f5a3476-040c-4bc5-8365-aaa801784b02', configEcertia);
        //console.log(evidencias);
        console.log(evidencias);
        saveAttachmentsEvidence(evidencias, expe.numExpediente) //Procesa y salva los anexos de evidencias 
            .then(async result => {
                console.log('@@@@@@@@@@@@@@@@@@@@@@@@@ Archivos Guardados @@@@@@@@@@@@@@@@@@@@@@@@');
                //Actualiza estado en Domino por medio del API
                let expedienteMod = {
                    "numExpediente": expe.numExpediente,
                    "evidencesNames": result
                };
                //Actualiza en Domino
                let msgExpediente = await domino.postExpedientDomino(expedienteMod);
                console.log(msgExpediente);
                console.log(expedienteRefresh);
            })
            .catch(error => config.log.warn(error))
    }
}
const saveAttachmentsEvidence = async(body, numExpediente) => {
    let results = body.results;
    let date = new Date().getTime();
    let arrayFilesNames = [];
    let promise = await new Promise((resolve, reject) => {
        for (var i = 0; i < results.length; i++) {
            let iterID = results[i].uniqueId;
            let iterName = results[i].subject;
            let evidences = results[i].affidavits;
            for (var j = 0; j < evidences.length; j++) {
                let evidenceDescription = evidences[j].description
                let evidenceBody = evidences[j].bytes;
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