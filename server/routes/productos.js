const express = require('express');
let { verificaToken } = require('../midllewares/autenticacion')
let app = express();
let Producto = require('../models/producto')

//MOSTRAR PRODUCTOS
app.get('/productos', (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde)

    //SOLO LOS DISPONIBLES
    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            return res.json({
                ok: true,
                productos
            })
        })
})

//MOSTRAR PRODUCTO POR ID
app.get('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            return res.json({
                ok: true,
                producto
            })
        })
})

//BUSCAR PRODUCTOS
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            return res.json({
                ok: true,
                productos
            })
        })

})




//CREAR PRODUCTO
app.post('/productos', verificaToken, (req, res) => {
    // //Regresa la nueva categoria
    let body = req.body;
    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
    })

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        })
    })
})


//ACTUALIZA PRODUCTO
app.put('/productos/:id', verificaToken, (req, res) => {
    // //Regresa la nueva categoria

    let id = req.params.id;
    let body = req.body
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: { message: "No existe el producto" }
            })
        }
        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;
        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.status(201).json({
                ok: true,
                producto: productoGuardado
            })
        })
    })
})


//BORRAR PRODUCTO
app.delete('/productos/:id', [verificaToken], (req, res) => {
    let id = req.params.id

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: { message: "No existe el producto" }
            })
        }
        productoDB.disponible = false;
        productoDB.save((err, productoBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.status(201).json({
                ok: true,
                producto: productoBorrado,
                msg: "Producto borrado"
            })
        })
    })
})
module.exports = app