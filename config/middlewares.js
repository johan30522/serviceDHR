const express = require('express');
const app = express();
const logger = require('morgan');
const evidenceService = require('../service/serviceDHR');

let cron = require('node-cron');
process.env.NODE_ENV = 'development';
const config = require('./config');
app.use(logger('dev'));
console.log("Aplicativo de la defensoria de los habitantes**");
//'23 17 * * *'
// cron.schedule('* * * * *', function() {
//     console.log("running a job Consulta de Evidencias Externas**");
//     config.log.info("***Inicia Consulta de Evidencias Externas***");
//     evidenceService.getEvidence();
// });
let evidenceDescription = 'evidencia de prueba drr digesto';
let date = new Date().getTime();
let filename = evidenceDescription + '_' + date + '.pdf';
filename = filename.replace(':', '_');
console.log(filename);

module.exports = app;