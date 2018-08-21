const express = require('express')
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken')

const Usuario = require('../models/usuario')

let app = express()
app.post('/login', (req, res) => {
    let body = req.body

    console.log("EMAIL LOG ===> ", body.email)
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) { //ERROR EN LA DB
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!usuarioDB) { //NO ENCONTRO AL USUARIO
            return res.status(400).json({
                ok: false,
                err: { message: "No hay usuario" }
            })
        }
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) { //LA CONTRASEÑA NO ES IGUAL
            return res.status(400).json({
                ok: false,
                err: { message: "No hay password" }
            })
        }


        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEMILLA_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })

    })
})
module.exports = app