require('./config/config')
    //PARA BASE DE DATOS
const mongoose = require('mongoose');
//PARA EXPRESS
const express = require('express')
    //PARA PARSEAR LO QUE VENGA POR POST 
const bodyParser = require('body-parser')
const path = require('path')

let app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(require('./routes/index'))
    // parse application/json
app.use(bodyParser.json())

//HABILITAR EL PUBLIC
app.use(express.static(path.resolve(__dirname, '../public')))

//CONECTA A LA DB
mongoose.connect(process.env.URL_DB, (err, resp) => {
    if (err) { throw err }
    console.log("DASE DE DATOS ONLINE")
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto ${process.env.PORT}`)
})