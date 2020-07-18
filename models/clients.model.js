const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientsSchema = new Schema({
    numClient: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String
    },
    lastName: {
        type: String
    },
    nif: {
        type: String
    },
    companyName:{
        type: String
    },
    direction:{
        type: String
    },
    province: {
        type: String
    },
    municipality:{
        type: String
    },
    postalCode:{
        type: Number
    },
    phoneOne: {
        type: Number
    },
    phoneTwo: {
        type: Number
    },
    externalNumber: {
        type: Number
    },
    internalNumber: {
        type: Number
    }
    ,
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