require('./config/config')

const express = require('express')
const bodyParser = require('body-parser')

let app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())


app.get('/usuario', (req, res) => {
    res.json("get Usuario")
})

app.post('/usuario', (req, res) => {
    let body = req.body;

    if (!body.nombre) {
        res.status(400).json({
            ok: false,
            description: "Dame un maldito nombre"
        })
    } else {
        res.json({ persona: body })
    }
})

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    console.log("ID ====>>>>", id);
    res.json({
        id
    });
})

app.delete('/usuario', (req, res) => {
    res.json("get Usuario")
})

app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto ${process.env.PORT}`)
})