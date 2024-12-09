const {Schema,model} = require("mongoose")

const mediaSchema = new Schema({
    serial: { type: String, required: true, unique: true },
    titulo: { type: String, required: true },
    sinopsis: { type: String },
    url: { type: String, required: true, unique: true },
    imagenPortada: { type: String },
    fechaCreacion: { type: Date, default: Date.now },
    fechaActualizacion: { type: Date, default: Date.now },
    yearEstreno: { type: Number },
    genero: { type: Schema.Types.ObjectId, ref: 'Genero', required: true },
    director: { type: Schema.Types.ObjectId, ref: 'Director', required: true },
    productora: { type: Schema.Types.ObjectId, ref: 'Productora', required: true },
    tipo: { type: Schema.Types.ObjectId, ref: 'Tipo', required: true }
});




module.exports = model('Media', mediaSchema);
