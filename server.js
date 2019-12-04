const app = require('./config/middlewares');

const PORT = process.env.PORT || 3000;

var request = require('request');



app.listen(PORT, (error) => {
    if (error) console.error(`INTERNAL SERVER ERROR: ${error}`);
    console.log(`Server listening on port: ${PORT}...`);
});