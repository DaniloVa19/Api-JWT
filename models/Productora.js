const {Schema,model} = require("mongoose")

const productoraSchema = new Schema({
    nombre: { type: String, required: true, unique: true },
    estado: { type: String, required: true,enum: ['Activo', 'Inactivo'], default: 'Activo' },
    slogan: { type: String },
    descripcion: { type: String },
    fechaCreacion: { type: Date, default: Date.now },
    fechaActualizacion: { type: Date, default: Date.now }
});


module.exports = model('Productora', productoraSchema);