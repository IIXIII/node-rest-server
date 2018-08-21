const express = require('express')
const Usuario = require('../models/usuario')
const _ = require('underscore')
let bcrypt = require('bcrypt');


let app = express()

app.get('/usuario', (req, res) => {

    let desde = req.query.desde && req.query.desde || 0;
    desde = Number(desde)

    let limite = req.query.limite || 5;
    limite = Number(limite)

    Usuario.find({ estado: true }, 'nombre email rol estado google img') //PONER CONDICIONES PARA OBTENER DE LA DB, PONER AQUI PARA EXCLUIR DEL OBJETO DE RETORNO
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                //ERROR AL CARGAR USUARIOS
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                })
            })
        })

    // res.json("get Usuario LOCAL!!!")
})

app.post('/usuario', (req, res) => {
    let body = req.body;

    //CREA UN USUARIO CON LA CLASE USUARIO QUE SE DIO SE ALTA EN EL MODELO

    console.log("NOMBRE ===>> ", body.nombre);
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email, //CIFRAR LA CONTRASEÑA
        password: bcrypt.hashSync(body.password, 10),
        rol: body.rol
    })

    //GUARDA EN LA DB
    usuario.save((err, usuarioDB) => {
        if (err) {
            //ERROR AL GUARDAR EN LA DB
            return res.status(400).json({
                ok: false,
                err
            })
        }
        //RESPONDE USUARIO CORRECTO!!!
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })


    // if (!body.nombre) {
    //     //HACE LA RESPUESTA DE ERROR
    //     res.status(400).json({
    //         ok: false,
    //         description: "Dame un maldito nombre"
    //     })
    // } else {
    //     res.json({ persona: body })
    // }
})

app.put('/usuario/:id', (req, res) => { //ACTUALIZAR EL USUARIO
    let id = req.params.id;
    let body = req.body

    Usuario.findById(id, (err, usuarioDB) => { //BUSCAR EL USUARIO EN LA DB
    })

    //USAMOS UDERSCORE PARA FILTAR EL OBJETO CON LAS PROPIEDADES QUE PUEDE ACTUALIZAR
    body = _.pick(body, ['nombre', 'email', 'img', 'role', 'estado'])


    //NEW = TRUE PARA QUE REGRESE EL REGISTRO CAMBIADO
    //RUN VALIDATORS = TRUE PARA QUE CORRA LAS VALIDACIONES DE LOS ESQUEMAS
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => { //BUSCAR EL USUARIO EN LA DB Y ACTUALIZARLO
        if (err) {
            //ERROR AL ENCONTRAR EN LA DB
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            usuario: usuarioDB
        });
    })
})

app.delete('/usuario/:id', (req, res) => {
    let id = req.params.id;
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    //     if (err) { //ERROR AL ENCONTRAR EN LA DB
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         })
    //     }

    //     if (!usuarioBorrado) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: "Usuario no encontrado"
    //             }
    //         })
    //     }

    //     res.json({
    //         ok: true,
    //         usuario: usuarioBorrado
    //     });
    // })

    let cambiaEdo = { estado: false };
    Usuario.findByIdAndUpdate(id, cambiaEdo, { new: true }, (err, usuarioBorrado) => { //BUSCAR EL USUARIO EN LA DB Y ACTUALIZARLO
        if (err) {
            //ERROR AL ENCONTRAR EN LA DB
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            usuario: usuarioBorrado
        });
    })

})

module.exports = app