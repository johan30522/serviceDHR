const _ = require('lodash');

const config = require('./config.json');
const defaultConfig = config.development;
const environment = process.env.NODE_ENV || 'development';
const environmentConfig = config[environment];
const finalConfig = _.merge(defaultConfig, environmentConfig);
const fs = require('fs').promises

global.gConfig = finalConfig;

const optsLog = {
    errorEventName: 'error',
    logDirectory: '/mylogfiles', // NOTE: folder must exist and be writable...
    fileNamePattern: 'ServicioDHR-<DATE>.log',
    dateFormat: 'YYYY.MM.DD'
};
const log = require('simple-node-logger').createRollingFileLogger(optsLog);

// log global.gConfig
console.log(`global.gConfig: ${JSON.stringify(global.gConfig, undefined, global.gConfig.json_indentation)}`);
const ensureDir = (dirpath) => {
    return fs.mkdir(dirpath, { recursive: true }, function(err) {
        if (err.code === 'EEXIST') {
            return Promise.resolve()
        } else {
            return Promise.reject(err)
        }
    })
}

module.exports = {
    log,
    ensureDir
}