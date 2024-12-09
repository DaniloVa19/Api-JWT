const {Schema,model} = require("mongoose") 


const generoSchema = new Schema({
    nombre: { type: String, required: true, unique: true },
    estado: { type: String, required: true,enum: ['Activo', 'Inactivo'], default: 'Activo' },
    descripcion: { type: String },
    fechaCreacion: { type: Date, default: Date.now },
    fechaActualizacion: { type: Date, default: Date.now }
});



module.exports = model('Genero', generoSchema);


