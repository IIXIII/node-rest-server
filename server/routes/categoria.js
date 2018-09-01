const express = require('express');
let { verificaToken, verificaUserRol } = require('../midllewares/autenticacion')
let app = express();
let Categoria = require('../models/categoria')


//MOSTRAR CATEGORIAS
app.get('/categoria', (req, res) => {
    Categoria.find({})
        .sort('descripcion') //ORDENAR
        .populate('usuario', 'nombre email') //QUE LE AGREDA AL QUERY DEL usuaRIO
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            return res.json({
                ok: true,
                categorias
            })
        })
})

//MOSTRAR CATEGORIA POR ID
app.get('/categoria/:id', (req, res) => {
    // Categoria.findById()
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
                m: "Tas chavo"
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: { message: "No existe" }
            })
        }

        return res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
})

//CREAR CATEGORIA
app.post('/categoria', verificaToken, (req, res) => {
    //Regresa la nueva categoria
    let body = req.body;

    console.log("BODY ===>> ", req)

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
})


//Muestra todas las categorias
app.put('/categoria/:id', verificaToken, (req, res) => {
    //Regresa la nueva categoria

    let id = req.params.id;
    let body = req.body
    let desc = { descripcion: body.descripcion }

    Categoria.findByIdAndUpdate(id, desc, { new: true, runValidatos: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })


})


//BORRAR CATEGORIA, SOLO PUEDE UN ADMIN
app.delete('/categoria/:id', [verificaToken, verificaUserRol], (req, res) => {
    //Regresa la nueva categoria

    let id = req.params.id

    Categoria.findOneAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: { message: 'el id no existe' }
            })
        }

        return res.json({
            ok: true,
            message: "Categoria borrada"
        })
    })
})

module.exports = app