const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const servicesSchema = new Schema({
    
    description: {
        type: String
    },
    numService: { type: Number, default: 0 },
    numDeliveryNote: Number,
    numBill: Number,
    status: String,
    priority: String,
    amount: Number,
    startHours: String,
    startDate: Date,
    finalized: Date,
    activities: String,
    note: String,
    descriptionShort: String,
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client'
    },
    workers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
},
{
    timestamps: true,
});



const Service = mongoose.model('Service', servicesSchema)




module.exports = Service;