const mongoose = require('mongoose');
//PARA VALIDACIONES DE CAMPOS UNICOS
const uniqueValidator = require('mongoose-unique-validator')

let Schema = mongoose.Schema;

let rolesValidos = {
    values: ["ADMIN_ROL", "USER_ROL"],
    message: '{VALUE} no es un rol valido' //MENSAJE DE ERROR PARA ROLES NO VALIDOS
};

//MODELO DEL USUARIO
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'Necesitamos el nombre'],
    },
    email: {
        type: String,
        unique: true, //CAMPO UNICO E IRREPETIBLE, LANZA ERROR SI SE LE ENVIA OTRO IGUAL
        required: [true, 'Necesitamos el correo'],
    },
    password: {
        type: String,
        required: [true, 'Necesitamos el password'],
    },
    img: {
        type: String,
    },
    rol: {
        type: String,
        default: "USER_ROL",
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.methods.toJSON = function() { //SIN FUNCION FLECHA PARA USAR EL THIS
    let user = this;
    let userObj = user.toObject();
    delete userObj.password;
    return userObj;
}

usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe der unico'
})

module.exports = mongoose.model('Usuario', usuarioSchema);