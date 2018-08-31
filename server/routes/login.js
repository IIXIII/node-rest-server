const express = require('express')
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken')

const Usuario = require('../models/usuario')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);



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


//CONFIG GOOGLE
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    console.log(`PAYLOAD ===>> ${payload}`, payload)

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async(req, res) => {
    let token = req.body.idtoken

    let googleUser = await verify(token)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                err
            })
        });


    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (usuarioDB) {
            if (!usuarioDB.google) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Debe usuario su autenticacion normal"
                    }
                })
            } else {
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEMILLA_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                })
            }
        } else { //USUARIO NO EXISTE

            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ":)";

            usuario.save((err, usuarioDB) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEMILLA_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                })
            })
        }
    })
});
module.exports = app