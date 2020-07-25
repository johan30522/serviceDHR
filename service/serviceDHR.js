const rp = require('request-promise');
const fs = require('fs').promises
const config = require('../config/config');
const domino = require('./domino/domino');
const ecertia = require('./ecertia/ecertia');

//get the response from provider to get the attachments
const getEvidence = async() => {
    try {
        console.log('Inicia servicio');
        let expedients = await domino.getExpedientsDomino();
        if (!expedients.hasOwnProperty('error')) {

            let configEcertia = await domino.getConfigEcertia();
            for (let expe of expedients) {
                let arrayFilesNamesExpedient = [];

                for (let id of expe.idCorreo) {
                    try {
                        console.log(`Consulta Expediente : ${expe.numExpediente}`);

                        //obtiene las evidencias para cada id de correo
                        let evidencias = await ecertia.getEvidencias(id, configEcertia);
                        //Salva a disco las evidencias del id de correo
                        let arrayNames = await saveAttachmentsEvidence(evidencias, expe.numExpediente);
                        arrayFilesNamesExpedient = arrayFilesNamesExpedient.concat(arrayNames);
                    } catch (error) {
                        config.log.warn(error.response.data);
                        return `No se pudo obtener las evidencias para el oficio: ${expe.numExpediente} `
                    }
                }
                try {
                    let expedienteMod = {
                        "numExpediente": expe.numExpediente,
                        "evidencesNames": arrayFilesNamesExpedient
                    };
                    //Actualiza en Domino
                    let msgExpediente = await domino.postExpedientDomino(expedienteMod);
                } catch (error) {
                    return `No se pudo actualizar en domino las evidencias para el expediente: ${expe.numExpediente} `;
                }
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
                filename = filename.replace(':', '_');
                let file = '/files/' + numExpediente + "/" + filename;
                Promise.resolve()
                    .then(function() { config.ensureDir('/files/' + numExpediente) }) //crea el directorio on el numero de expediente
                    .then(() => { //crea los archivos de evidencias
                        config.log.info(`>>Crea el archivo : ${file}`);
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