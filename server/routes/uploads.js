const express = require('express');
const fileUpload = require('express-fileupload'); //NPM PARA SUBIR
const app = express();
const Usuario = require('../models/usuario')
const Producto = require('../models/producto')
const fs = require('fs')
const path = require('path')

// default options
app.use(fileUpload());

let extensionesValidas = ['png', 'jpeg', 'jpg', 'gif']
let tiposArchivos = ['productos', 'usuarios']

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;
    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: "NO HAY ARChiVOS"
                }
            });
    }

    //VALIDA TIPO 
    if (tiposArchivos.indexOf(tipo) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: "TIPO NO VALIDO"
                }
            });
    }
    //ARCHIVO => COMO SE VA A LLAMAR EL CAMPO CON EL ARCHIVO
    let sampleFile = req.files.archivo;
    let nombreArchivo = sampleFile.name.split('.')
    let extension = nombreArchivo[nombreArchivo.length - 1]

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: "EXTENSION NO VALIDA"
                }
            });
    }


    let nombreArchivoNuevo = `${sampleFile.name}-${id}-${new Date().getMilliseconds()}.${extension}`
        // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(`uploads/${tipo}/${nombreArchivoNuevo}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        //YA ESTA LA IMAGEN AQUI!!!!!!1
        if (tipo === "usuarios") {
            imagenUsusario(id, res, nombreArchivoNuevo)
        } else {
            imagenProducto(id, res, nombreArchivoNuevo)
        }
    });
});

function imagenUsusario(id, res, nombreArchivoNuevo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivoNuevo, "usuarios")
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borraArchivo(nombreArchivoNuevo, "usuarios")
            return res.status(400).json({
                ok: false,
                err
            });
        }

        borraArchivo(usuarioDB.img, "usuarios")

        usuarioDB.img = nombreArchivoNuevo;
        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado
            })
        })
    })
}

function imagenProducto(id, res, nombreArchivoNuevo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(nombreArchivoNuevo, "productos")
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borraArchivo(nombreArchivoNuevo, "productos")
            return res.status(400).json({
                ok: false,
                err
            });
        }

        borraArchivo(productoDB.img, "productos")

        productoDB.img = nombreArchivoNuevo;
        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado
            })
        })
    })
}

function borraArchivo(nombreImagen, tipo) {
    //BORRA LA IMAGEN SI EXISTE!!!!
    let pathURL = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`)
    if (fs.existsSync(pathURL)) {
        fs.unlinkSync(pathURL);
    }
}

module.exports = app