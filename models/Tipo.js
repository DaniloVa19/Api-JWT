const {Schema,model} = require("mongoose")

const tipoSchema = new Schema({
    nombre: { type: String, required: true, unique: true },
    descripcion: { type: String },
    fechaCreacion: { type: Date, default: Date.now },
    fechaActualizacion: { type: Date, default: Date.now }
});


module.exports = model('Tipo', tipoSchema);