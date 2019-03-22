const express = require('express');
const router = express.Router();
const Request = require('request');

router.get('/:id', handleItem);
router.put('/:id', handleItem);
router.delete('/:id', handleItem);


function handleItem(req, res) {
    let partition = req.params.id[0]; // <- Routing Logik
    let url = "http://127.0.0.1:3000/multi-"+partition+"/"+req.params.id;

    console.log("Request absetzen: "+req.method+" "+url);
    Request({
        url: url,
        method: req.method,
        json: req.body
    }, handleResponse);

    function handleResponse(error, response, body){
        console.log("Antwort erhalten");
        res.status(response.statusCode);
        res.json(body);
    }
}

module.exports = router;
