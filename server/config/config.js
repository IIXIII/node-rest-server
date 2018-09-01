//==================
//PUERTO PARA PRODUCCION O DESARROLLO
//=================

process.env.PORT = process.env.PORT || 3000

process.env.PORT = process.env.PORT || 3000


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

process.env.CADUCIDAD_TOKEN = '1000h';


//==================
//SEMILLA
//=================

process.env.SEMILLA_TOKEN = process.env.SEMILLA_TOKEN || 'secret-IIXIII-desarrollo';


// Client ID
// 984197238705-f14nj7tbb3dpdq9rsn8jqniodocjin96.apps.googleusercontent.com

// Client Secret
// Y9zISmqQ_cegA7ujRl66W2yx

//==================
//GOOGLE CLIENT ID
//=================

process.env.CLIENT_ID = process.env.CLIENT_ID || '984197238705-f14nj7tbb3dpdq9rsn8jqniodocjin96.apps.googleusercontent.com';