const {Schema,model} = require("mongoose")

const directorSchema = new Schema({
    nombre: { type: String, required: true },
    estado: { type: String, required: true,enum: ['Activo', 'Inactivo'], default: 'Activo' },
    fechaCreacion: { type: Date, default: Date.now },
    fechaActualizacion: { type: Date, default: Date.now }
});



module.exports = model('Director', directorSchema);