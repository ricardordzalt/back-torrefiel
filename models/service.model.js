const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const servicesSchema = new Schema({
    
    description: {
        type: String
    },
    numService: { 
        type: Number, 
        default: 0 
    },
    numDeliveryNote: {
        type: Number
    },
    numBill: {
        type: Number
    },
    status: {
        type: String
    },
    priority: {
        type: Boolean
    },
    amount: {
        type: Number
    },
    startHours: {
        type: String
    },
    startDate: {
        type: Date
    },
    finalized: {
        type: Date
    },
    activities: [{
        type: String
    }],
    note: {
        type:String
    },
    direction: {
        type: String
    },
    numberInternal: {
        type: String 
    },
    numberExternal: {
        type: String
    },
    typeIva: {
        type: Number
    },
    province: {
        type: String
    },
    municipality: {
        type: String
    },
    postalCode: {
        type: Number
    },
    name: {
        type: String
    },
    lastName: {
        type: String
    },
    motherLastName: {
        type: String
    },
    email: {
        type: String
    },
    phoneOne: {
        type: Number
    },
    phoneTwo: {
        type: Number
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client'
    },
    workers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    imagenes: [{
        type: Schema.Types.ObjectId,
        ref: 'Imagen'
    }],
    albaram: {
       type: String
    },
    factura: {
        type: String
    },
    signUrl: {
        type: String
    }
},
{
    timestamps: true,
});{}



const Service = mongoose.model('Service', servicesSchema)




module.exports = Service;