const config = require('./../config/config');

const getConfigEvicertia = (callback) => {
    let config = {
        "EndpointService": "https://app.ecertia.com/api/EviMail/Query",
        "PwdService": "CRdefensoria19",
        "UserService": "gmora@dhr.go.cr"
    }
    //let error = new Error("Error de ejecución . . . :( ");
    //return callback(error, null);    

    return callback(null, config)
}

module.exports={
    getConfigEvicertia
}