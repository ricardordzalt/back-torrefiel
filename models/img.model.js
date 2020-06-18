const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imagenSchema = new Schema({
    description: {
        type: String
    },
    images: {
        type: Array
    },
    user: {
        type: String
    },
    service: [{
        type: Schema.Types.ObjectId,
        ref: 'Service'
    }]
},
{
    timestamps: true,
});

const Imagen = mongoose.model('Imagen', imagenSchema)

module.exports = Imagen;