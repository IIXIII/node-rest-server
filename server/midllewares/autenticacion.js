const jwt = require('jsonwebtoken')

///==================
//VERIFICA TOKEN
//=================

let verificaToken = (req, res, next) => {
    console.log("VERIFICANDO TOKEN !!!!!!")
    let token = req.get('token'); //OBTIENE EL TOKEN DE LOS HEADERS

    jwt.verify(token, process.env.SEMILLA_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }
        req.usuario = decoded.usuario
        next() //HACE QUE LA FUNCION NORMAL SIGA, SIN EL NEXT SOLO REGRESA LO QUE TENEMOS AQUI Y NO EN LAS RUTAS
    })
}

///==================
//VERIFICA ROL DE USUARIO
//=================

let verificaUserRol = (req, res, next) => {

    let token = req.get('token'); //OBTIENE EL TOKEN DE LOS HEADERS
    let userRol = req.usuario.rol; //OBTIENE EL TOKEN DE LOS HEADERS

    if (userRol === "ADMIN_ROL") { //COMPROBANDO QUE EL USUARIO SEA ADMIN
        next()
    } else {
        return res.status(401).json({
            ok: false,
            err: "NO TIENES PERMISO CHAVO"
        })
    }
}


///==================
//VERIFICA TOKEN URL
//=================
let verificaTokenImg = (req, res, next) => {
    let token = req.query.token; //OBTIENE EL TOKEN DE LOS HEADERS
    console.log("VERIFICANDO TOKEN !!!!!!" + token)

    jwt.verify(token, process.env.SEMILLA_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }
        req.usuario = decoded.usuario
        next() //HACE QUE LA FUNCION NORMAL SIGA, SIN EL NEXT SOLO REGRESA LO QUE TENEMOS AQUI Y NO EN LAS RUTAS
    })
}

module.exports = {
    verificaToken,
    verificaUserRol,
    verificaTokenImg
}