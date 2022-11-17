const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');

// GET /instruments
app.get('/instruments', (req, res) => {
    fs.readFile('./data/hangszerek.json', (err, data) => {
        res.send(JSON.parse(data));
    })
})

// GET /instruments/:id
app.get('/instruments/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile('./data/hangszerek.json', (err, data) => {
        const hangszerek = JSON.parse(data);
        const hangszerId = hangszerek.find(hangszer => hangszer.id === id);

        if (!hangszerId) {
            res.status(404);
            res.send({error: 'Not Found'});
            return;
        }
        res.send(hangszerId);

    })
})

// POST /instruments (add)
app.post('/instruments', bodyParser.json(), (req, res) => {
    const ujHangszer = {
        id: uuidv4(),
        name: sanitizeString(req.body.name),
        price: Number(req.body.price),
        quantity: Number(req.body.quantity),
        imageURL: req.body.imageURL
    };

    fs.readFile('./data/hangszerek.json', (err, file) => {
        const hangszerek = JSON.parse(file);
        hangszerek.push(ujHangszer);
        fs.writeFile('./data/hangszerek.json', JSON.stringify(hangszerek), (err) => {
            res.send(ujHangszer);
        })
    })
});

// PUT /instruments/:id (Update)
app.put('/instruments/:id',bodyParser.json(), (req, res) => {
    const id = req.params.id;

    fs.readFile('./data/hangszerek.json', (err, file) => {
        const hangszerek = JSON.parse(file);
        const hangszerIndexById = hangszerek.findIndex(hangszer => hangszer.id === id);

        if(hangszerIndexById === -1) {
            res.status(404);
            res.send({error: `id: ${id} not found`});
            return;
        }

        const fhangszer = {
            id: id,
            name: sanitizeString(req.body.name),
            price: Number(req.body.price),
            isInStock: Boolean(req.body.isInStock),
        };

        hangszerek[hangszerIndexById] = fhangszer;
        fs.writeFile('./data/hangszerek.json', JSON.stringify(hangszerek), () => {
            res.send(fhangszer);
        });
    });
});

// DELETE /instruments/:id
app.delete('/instruments/:id', (req, res) => {
    const id = req.params.id;

    fs.readFile('./data/products.json', (err, file) => {
        const hangszerek = JSON.parse(file);
        const hangszerIndexById = hangszerek.findIndex(hangszer => hangszer.id === id);
        console.log(hangszerIndexById);


        if(hangszerIndexById === -1) {
            res.status(404);
            res.send({error: `id: ${id} not found`});
            return;
        }

        hangszerek.splice(hangszerIndexById, 1);
        fs.writeFile('./data/hangszerek.json', JSON.stringify(hangszerek), () => {
            res.send({id: id});
        });
    });
});

app.listen(3000);

function sanitizeString(str) {
    str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, "");
    return str.trim();
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
