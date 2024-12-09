const {Schema,model} = require("mongoose")

const usuarioSchema = new Schema({
    nombre: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    estado: { type: String, required: true,enum: ['Activo', 'Inactivo'] },
    password: { type: String, required: true },
    rol: { type: String, required: true, enum: ['Administrador', 'Docente']  },
    fechaCreacion: { type: Date, default: Date.now },
    fechaActualizacion: { type: Date, default: Date.now }
});

module.exports = model('Usuario', usuarioSchema);
