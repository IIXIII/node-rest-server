//==================
//PUERTO PARA PRODUCCION O DESARROLLO
//=================

process.env.PORT = process.env.PORT || 3002

process.env.PORT = process.env.PORT || 3002


//==================
//ENTORNO DE DESPLIEGUE, NODE_ENV ES UNA VARIABLE QUE ESTABLECE HEROKU
//=================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//==================
//CONEXION A BASE DE DATOS PARA PRODUCCION O DESARROLLO
//=================

let urlDB;
if (process.env.NODE_ENV == 'dev') {
    urlDB = "mongodb://localhost:27017/cafe"
} else {
    urlDB = `${process.env.DB_URI}!@ds227352.mlab.com:27352/cafe`
}
process.env.URL_DB = urlDB


//==================
//VENCIMIENTO TOKEN
//=================

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


//==================
//SEMILLA
//=================

process.env.SEMILLA_TOKEN = process.env.SEMILLA_TOKEN || 'secret-IIXIII-desarrollo';