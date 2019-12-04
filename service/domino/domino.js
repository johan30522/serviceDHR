const axios = require('axios');
const getExpedientsDomino = async() => {
    const resp = await axios.get(`${global.gConfig.endPointDomino}/pendientes`);
    return resp.data.Results;
}
const postExpedientDomino = async(data) => {
    console.log('actualizando domino');
    console.log(data);
    const resp = await axios.post(`${global.gConfig.endPointDomino}/process`, data);
    return resp.data;
}
const getConfigEcertia = async() => {
    const resp = await axios.get(`${global.gConfig.endPointDomino}/config`);
    return resp.data;
}
module.exports = {
    getConfigEcertia,
    getExpedientsDomino,
    postExpedientDomino
}