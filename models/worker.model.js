const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs')
const workerSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    phone: {
        type: Number,
        unique: true,
        minlength: 7
    },
    password: {
        type: String,
        trim: true,
        minlength: 8

    },
    rol: {
        type: String,
        required: true
    },
    color: {
        type: String
    },
    works: [{
        type: Schema.Types.ObjectId,
        ref: 'Service'
    }],
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Chat'
    }]
},
{
    timestamps: true,
});

workerSchema.pre('save', function(next) {
    let worker = this;
    if (!worker.isModified('password'))return next();

    bcrypt.genSalt(5, (err, salt) => {
        if(err) return next(err)
        console.log('este es el salt', salt)

        bcrypt.hash(worker.password, salt, (err, hash) => {
            if(err) return next(err)
            worker.password = hash
            console.log('este es el hash', hash, 'y esto el error: ', err)
            next()
        })

    })

})


const Worker = mongoose.model('Worker',workerSchema)

module.exports = Worker;