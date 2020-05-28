const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const servicesSchema = new Schema({
    numClien: {
        type: Number,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    status: String,
    priority: String,
    amount: Number,
    start: Date,
    finalized: Date,
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

const Clients = mongoose.model('Service', servicesSchema)

module.exports = Clients;