const app = require('./config/middlewares');




const PORT = process.env.PORT || 3000;

var request = require('request');






//Create folder
/*

const fs = require('fs').promises

async function ensureDir(dirpath) {
  try {
    await fs.mkdir(dirpath, { recursive: true })
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
}

async function main() {
  try {
    await ensureDir('a/b/c')
    console.log('Directory created')
  } catch (err) {
    console.error(err)
  }
}
*/
//main();


//get the response
/*
let user='gmora@dhr.go.cr';
let passwd='CRdefensoria19';
let auth = "Basic " + new Buffer(user + ":" + passwd).toString("base64");
var optionsDHR = {
  method: 'GET',
  url: 'https://app.ecertia.com/api/EviMail/Query',
  headers:
  {
    'cache-control': 'no-cache',
    Authorization: auth,
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  body:
  {
    WithUniqueIds: '2f5a3476-040c-4bc5-8365-aaa801784b02',
    IncludeAffidavits: 1,
    IncludeAttachments: 0
  },
  json: true
};
request(optionsDHR, function (error, response, body) {
  if (error) throw new Error(error);

  //console.log(body.results);
  let results = body.results;

  //var arr = JSON.parse(body);
  for (var i = 0; i < results.length; i++) {
    let iterID = results[i].uniqueId;
    let iterName = results[i].subject;
    console.log('id del correo: ' + iterID + "- Subject: " + iterName);
    // console.log(arr[i])
    let evidences = results[i].affidavits;
   
    for (var j = 0; j < evidences.length; j++) {
      //console.log(evidences[j]);
     
      let evidenceDescription =evidences[j].description
      console.log(evidenceDescription);
      let evidenceId = evidences[j].uniqueId;
      console.log('Evidencia: ' + j + "- id: " + evidenceId);
      let evidenceBody = evidences[j].bytes;
      //console.log(evidenceBody);
      

      var date = new Date().getTime();
      var filename = evidenceDescription + '_' + date + '.pdf';
      var file = '/files/' + filename;

      fs.writeFile(file, evidenceBody,'base64', function (err) {
        if (err)
          console.log(err);
        else
          console.log("The file was saved!");
      });

      



    }
  }
  //console.log(body.affidavits);
});

*/









app.listen(PORT, (error) => {
  if (error) console.error(`INTERNAL SERVER ERROR: ${error}`);
  console.log(`Server listening on port: ${PORT}...`);
});
