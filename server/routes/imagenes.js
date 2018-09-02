const express = require('express');
const fs = require('fs')
const path = require('path')
let { verificaTokenImg } = require('../midllewares/autenticacion')
let app = express();

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImg = `../../uploads/${tipo}/${img}`;
    let pathNoImg = path.resolve(__dirname, '../assets/no-image.jpg');
    let pathSiImg = path.resolve(__dirname, pathImg)

    console.log("SI IMAGEN ===>> " + pathSiImg);
    if (fs.existsSync(pathSiImg)) {
        res.sendFile(pathSiImg)
    } else {
        res.sendFile(pathNoImg)
    }

})


module.exports = app;