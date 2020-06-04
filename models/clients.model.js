const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientsSchema = new Schema({
    numClient: {
        type: Number
    },
    name: {
        type: String
    },
    lastName: {
        type: String
    },
    direction: String,
    province: String,
    municipality: String,
    postalcode: Number,
    phone: {
        type: Number
    },
    email: {
        type: String
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