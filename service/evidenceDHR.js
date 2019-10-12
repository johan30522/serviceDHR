const rp = require('request-promise');
const fs = require('fs').promises
const config = require('./../config/config');


const getExpedientsDomino = (callback) => {

    let expedients = {
        "results": [
            {
                'numExpediente': '555555',
                'idCorreo': '2f5a3476-040c-4bc5-8365-aaa801784b02'
            }
        ]
    }

    //let error = new Error("Error de ejecución . . . :( ");
    //return callback(error, null);    

    return callback(null, expedients)
}
//get the response from provider to get the attachments
const getEvidence = () => {
    getExpedientsDomino((errorDomino, expedients) => {
        //verica si domino devolvio un error
        if (errorDomino) return config.log.warn(errorDomino);
        // se recorren todos los expedientes
        let arrayExpedients = expedients.results;
        for (let e = 0; e < arrayExpedients.length; e++) {
            //Expediente iterando
            let expedient = arrayExpedients[e];
            config.log.info(`********* Procesa expediente # ${expedient.numExpediente}`);
            getResponseExternal(expedient.idCorreo)// obtiene la respuesta del servicio de Correo externo
                .then(data => {
                    saveAttachmentsEvidence(data, expedient.numExpediente)//Procesa y salva los anexos de evidencias 
                    .then(result => {
                        console.log("Archivos Guardados");
                        //Actualiza estado en Domino por medio del API
                    })
                    .catch(error => config.log.warn(error))
                })
                .catch(error => config.log.warn(error))
        }
    })
}
const getResponseExternal = (idMail) => {
    let auth = "Basic " + new Buffer(global.gConfig.user_EndpointEvidences + ":" + global.gConfig.passwd_EndpointEvidences).toString("base64");
    var optionsMailExternal = {
        method: 'GET',
        url: global.gConfig.endPointEvidences,
        headers:
        {
            'cache-control': 'no-cache',
            Authorization: auth,
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body:
        {
            WithUniqueIds: idMail,
            IncludeAffidavits: 1,
            IncludeAttachments: 0
        },
        json: true
    };
    //console.log(optionsMailExternal);
    let promise = new Promise((resolve, reject) => {
        rp(optionsMailExternal)
            .then(function (repos) {
                resolve(repos);
            })
            .catch(function (err) {
                let error = new Error(err);
                reject(error);
            });
    })
    return promise;
}
const saveAttachmentsEvidence = (body, numExpediente) => {
    let results = body.results;
    let date = new Date().getTime();
    let promise = new Promise((resolve, reject) => {
        for (var i = 0; i < results.length; i++) {
            let iterID = results[i].uniqueId;
            let iterName = results[i].subject;
            console.log('id del correo: ' + iterID + "- Subject: " + iterName);
            let evidences = results[i].affidavits;
            for (var j = 0; j < evidences.length; j++) {
                let evidenceDescription = evidences[j].description
                let evidenceId = evidences[j].uniqueId;
                let evidenceBody = evidences[j].bytes;
                let filename = evidenceDescription + '_' + date + '.pdf';
                let file = '/files/' + numExpediente + "/" + filename;
                Promise.resolve()
                    .then(function () { ensureDir('/files/' + numExpediente) }) //crea el directorio on el numero de expediente
                    .then( () => { //crea los archivos de evidencias
                        config.log.info(`>>Crea el archivo : ${file}`);
                        fs.writeFile(file, evidenceBody, 'base64', function (err) {  // ecertia return base64 formtat files
                            if (err)
                                reject(err);
                            else{
                                //retornar el nombre de los anexos
                                resolve(true);
                            }
                        });
                     })
                    .catch(function () { reject(err); })
            }
        }
    })    
    return promise;

}
const ensureDir= (dirpath)=> {
    return fs.mkdir(dirpath,{recursive: true}, function (err) {
        if (err.code === 'EEXIST') {
            return Promise.resolve()
        } else {
            return Promise.reject(err)
        }
    })
}

module.exports = {
    getEvidence
}
