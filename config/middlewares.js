const express = require('express');
const app = express();
const logger = require('morgan');
const evidenceService = require('../service/serviceDHR');

let cron = require('node-cron');
process.env.NODE_ENV = 'development';
const config = require('./config');
app.use(logger('dev'));
console.log("Aplicativo de la defensoria de los habitantes**");
//cron.schedule('* * * * *', function() {
console.log("running a job Consulta de Evidencias Externas**");
config.log.info("***Inicia Consulta de Evidencias Externas***");
evidenceService.getEvidence();
//});


module.exports = app;