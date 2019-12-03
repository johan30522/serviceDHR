const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const userRoutes = require('../api/user/routes');
const evidenceService = require('../service/serviceDHR');


var cron = require('node-cron');

// environment variables
process.env.NODE_ENV = 'development';

// config variables
const config = require('./config');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(logger('dev'));
app.use('/api', userRoutes);


//cada 3 horas: 0 0 */3 * * *
//cron.schedule("* * * * *", function () {
//log.info("*************************************Inicia Consulta de Evidencias Externas*************************************");
config.log.info("*************************************Inicia Consulta de Evidencias Externas*************************************");
evidenceService.getEvidence();
console.log("*******************************************************************running a task every minute*************************************************************************************8");
//});




// app.set('trust proxy', true);
// app.use('/api', [UserRoutes]);

module.exports = app;