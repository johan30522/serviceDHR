const axios = require('axios');
const getExpedientsDomino = async() => {
    const resp = await axios.get(`${global.gConfig.endPointDomino}/pendientes`);
    return resp.data.Results;
}
const getConfigEcertia = async() => {
    const resp = await axios.get(`${global.gConfig.endPointDomino}/config`);
    return resp.data;
}
module.exports = {
    getConfigEcertia,
    getExpedientsDomino
}