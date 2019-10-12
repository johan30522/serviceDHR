// om namah shivay

// requires
const _ = require('lodash');

// module variables



// as a best practice
// all global variables should be referenced via global. syntax
// and their names should always begin with g
global.gConfig = finalConfig;


// create a rolling file logger based on date/time that fires process events
const optsLog = {
    errorEventName:'error',
    logDirectory:'/mylogfiles', // NOTE: folder must exist and be writable...
    fileNamePattern:'ServicioDHR-<DATE>.log',
    dateFormat:'YYYY.MM.DD'
};
const log = require('simple-node-logger').createRollingFileLogger( optsLog );

// log global.gConfig
console.log(`global.gConfig: ${JSON.stringify(global.gConfig, undefined, global.gConfig.json_indentation)}`);


const ensureDir= (dirpath)=> {
    return fs.mkdir(dirpath,{recursive: true}, function (err) {
        if (err.code === 'EEXIST') {
            return Promise.resolve()
        } else {
            return Promise.reject(err)
        }
    })
}

module.exports={
    log,
    ensureDir
}