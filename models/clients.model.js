const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientsSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true
    },
    direction: String,
    province: String,
    municipality: String,
    postalcode: Number,
    phone: {
        type: Number,
        unique: true,
        minlength: 7
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    services: [{
        type: Schema.Types.ObjectId,
        ref: 'Service'
    }]
},
{
    timestamps: true,
});

const Clients = mongoose.model('Client', clientsSchema)

module.exports = Clients;