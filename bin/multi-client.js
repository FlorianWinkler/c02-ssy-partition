const Request = require('request');

//Aufruf senden
let key='abc';
let partition = key[0]; // <- Routing-Logik
let value = {name:"Marge", haircolor:'blue'};



Request.put({
    url: "http://127.0.0.1:3000/multi-"+partition+"/"+key,
    json: value
},handleResponse);

function handleResponse(error, response, body){
    console.log(response.statusCode);
    console.log(body);
}
