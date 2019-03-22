function getRouter(shard_nr) {
    const express = require('express');
    const database = require('../src/multi-database');
    const router = express.Router();

    router.get('/:id', getItem);
    router.put('/:id', putItem);
    router.delete('/:id', delItem);

    const multiCollection = database.getCollection('multi-' + shard_nr);

    function getItem(req, res) {
        // suche alle Objekte, deren Inhalt ein key-Feld mit key==req.params.id hat
        let items = multiCollection.find({key: req.params.id});
        // items ist ein Array. Falls kein Objekt gefunden, dann eben leeres Array
        if (items.length == 0) {
            res.status(404).end();
        } else {
            // Eintrag gefunden: retourniere value des ersten Treffers
            res.json(items[0].value);
        }
    }


    function putItem(req, res) {
        if (req.params.id[0].toLowerCase() != shard_nr) {
            res.status(400).end();
            return;
        }
        let items = multiCollection.find({key: req.params.id});
        let item;
        if (items.length == 0) {
            // der gesamte Body des Requests wird als "value" abgespeichert
            console.log("Inserted: "+req.body);
            item = multiCollection.insert({key: req.params.id, value: req.body});
        } else {
            item = items[0];
            // beim Aktualisieren ebenfalls: der gesamte Body ist der neue "value"
            item.value = req.body;
            multiCollection.update(item);
        }
        res.json(item.value);

    }


    function delItem(req, res) {
        let items = multiCollection.find({key: req.params.id});
        let item;
        if (items.length == 0) {
            res.status(404).end();
        } else {
            item = items[0];
            multiCollection.remove(item);
            res.json(item.value);
        }
    }

    return router;
}

module.exports = getRouter;
