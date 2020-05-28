const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs')
const userSchema = new Schema({
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
    motherLastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    }
    ,
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
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
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
    isVerify: Boolean,
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

userSchema.pre('save', function(next) {
    let user = this;
    if (!user.isModified('password'))return next();

    bcrypt.genSalt(5, (err, salt) => {
        if(err) return next(err)
        console.log('este es el salt', salt)

        bcrypt.hash(user.password, salt, (err, hash) => {
            if(err) return next(err)
            user.password = hash
            console.log('este es el hash', hash, 'y esto el error: ', err)
            next()
        })

    })

})


const User = mongoose.model('User', userSchema)

module.exports = User;