const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const http = require('http');
const request = require('request');
const basePath = 'https://www.koronavirus.hr/json/';
const query = {
    podaci: '?action=podaci',
    podaci_zadnji: '?action=podaci_zadnji',
    po_danima_zupanijama: '?action=po_danima_zupanijama',
    po_danima_zupanijama_zadnji: '?action=po_danima_zupanijama_zadnji',
    po_osobama: '?action=po_osobama',
};

app.use(cors());

Object.keys(query).forEach(key => {
    app.get(`/${key}`, (req, res) => {
        const timestamp = Date();
        try {
            request(`${basePath}${query[key]}`, (error, response, body) => {
                if (!!error) {
                    console.warn(`Error in retrieving GET/${key} at ${timestamp}`);
                    res.send(error);
                } else {
                    console.log(`Successfully retrieved GET/${key} at ${timestamp}`);
                    res.send(body);
                }
            });
        } catch (e) {
            console.error(`Could not GET/${key} at ${timestamp}`);
            res.send(e);
        }
    });
});

app.listen(port, () => {
    console.log(`Node.js server listening at http://localhost:${port}`);
});
