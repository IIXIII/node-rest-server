const express = require('express')
let app = express()

app.use(require('../routes/usuario'))
app.use(require('../routes/login'))
app.use(require('../routes/categoria'))
app.use(require('../routes/productos'))
app.use(require('../routes/uploads'))
app.use(require('../routes/imagenes'))

module.exports = app