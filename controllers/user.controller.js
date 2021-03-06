require('dotenv').config
const  User = require('../models/user.model')
const Service = require('../models/service.model')

const jwt = require('jsonwebtoken')
const moment = require('moment')
const bcrypt = require('bcryptjs')
const { sendEmail } = require('../services') 
const SetMailing = require('../services/mail/mailing')
const config = require('../config')

module.exports = {
    all: function(req, res){
        User.find()
        .then(users => res.status(200).json(users))
        .catch(err => res.status(404).json('Error' + err));
    },
    viewOne: function(req, res){
        User.findById(req.params.id)
        .then(user => res.json(user))
        .catch(err => res.status(404).json('Error' + err));
    },
    destroy: function(req, res){
        User.findByIdAndDelete(req.params.id)
        .then(async (user) => {
            const services = await Service.find();
            services.forEach(async service => {
                const newWorkers = service.workers.filter(worker => JSON.stringify(worker) != JSON.stringify(user._id));
                service.workers = newWorkers;
                await service.save();
            })
            const users = await User.find();
            res.send(users);
        })
        .catch(err => res.status(404).json('Error' + err));
    },
    edit: function(req, res){
        User.findById(req.params.id)
        .then(user => {
            user.userName = req.body.name
            user.email = req.body.email
            user.name = req.body.userName
            user.phone = req.body.phone
            user.rol = req.body.rol
            user.isVerify = req.body.isVerify
            user.save()
                .then(() => res.json('User Update!'))
                .catch(err => res.status(404).json('Error' + err))
        })
        .catch(err => res.status(404).json('Error' + err));
    },
    editRol: async function(req, res) {
        if(req.params.id) {
            const user = await User.findById(req.params.id) 
            user.rol = req.body.rol
                try {
                    await user.save()
                    return res.status(2000).send({message: "rol cambiado satisfactoriante."})
                } catch(err) {
                    return res.status(403).send({Error: "No se pudo cambiar el rol", err})
                }
        }else {
           return res.status(404).send({Error: "Pase el id del usuario al que desea cambiar el rol"})
        }
    },
    confirmation: function (req, res) {
        let token = req.params.token;
        jwt.verify(token, config.app.secret_token , (err, decode) => {
            if(err) {
                return res.status(403).send({ 
                    message: 'no tienes los permisos suficientes para estar aqui', 
                    error: err 
                })
            }
            
            let email = decode.email
            let userName = decode.userName
        
            // res.status(200).send({email: decode.email, names: decode.name, userName: decode.userName, phones: decode.phone})
        User.findOne({email})
        .then(user => {
            if(!user) return res.status(404).send({message: 'user not found'})
            // res.status(200).send({email, names: decode.name, userName: decode.userName, phones: decode.phone})
            user.userName = userName
            user.email = email
            user.isVerify = true
            user.save()
                .then(() => res.send({
                    message: 'Email verificado!!!',
                    token
                }))
                .catch(err => res.status(404).json('Error' + err))
        })
        .catch(err => res.status(404).json('Error' + err));
            
        })
    },
    register: async function(req, res){
        const {name, userName, lastName, motherLastName, phone, color, password } = req.body
        const rol = req.body.rol ? "Administrador" : "Normal";
        // async..await is not allowed in global scope, must use a wrapper
        //const newUser = new User({ userName, name, phone, rol, lastName, motherLastName })
        req.body.password.length < 8 ? res.status(400).send('La contraseña debe ser de al menos 8 caracteres') : null;
        const newUser = new User({ name, userName, lastName, motherLastName, phone, color, rol, password })

        let userDB = await User.findOne({ $or: [
            { phone },
            { userName },
            { color }
        ]})

        if (userDB) {
            if (userName == userDB.userName) {
                return res.status(400).send('El nombre de usuario ya existe');
            }else if (phone == userDB.phone) {
                return res.status(400).send('El teléfono ya existe');
            }else if (color == userDB.color){
                return res.status(400).send('Este color ya está en uso');
            }

        }

       
        newUser.save()
            .then((user) => {
                res.send(user);
            })
            .catch(err => res.status(403).send('Ha ocurrido un error'));
},
    login: function(req, res) {
        let userName = req.body.userName
        let password = req.body.password
        User.findOne({ userName })
            .then(user => {
                console.log('user', user)
                if(!user) return res.status(200).send({message: 'Nombre de usuario no encontrado'})
                bcrypt.compare(password, user.password)
                    .then(match => {
                        if(!match) return res.status(200).send({message: 'La contraseña es incorrecta'})

                        // res.status.json({token: service.createToken(user)}) ;
                            payLoad = {
                                id: user._id,
                                userName: user.userName,
                                email: user.email,
                                rol: user.rol
                            }
                        // poner clave secreta en una variable de entorno
                            jwt.sign(payLoad, config.app.secret_token , (err, token) => {
                                if(err) return res.status(200).send({Error: 'Token incorrecto', err})
                                const name = user.name
                                res.status(200).send({message: 'Acceso concedido', token, user})
                            })
                    })
                    .catch(err => res.status(200).send({message: 'Ha ocurrido un error verificando la contraseña', err}))
            })

            .catch(err => res.status(200).send({message: 'Ha ocurrido un error encontrando el usuario', err}))
    },
    sendEmailPassReset: function(req, res) {
    const  {email, userName} = req.body
        
        User.findOne({email})
            .then(user => {
                // res.status(200).send({message: user})
                if(user.userName != userName || user.email != email) return res.json('Los datos enviados no son compatibles')
                if(!user.isVerify) return res.status(200).send({message: 'Antes de cambiar tu contraseña tienes que verificar tu email.'})
                payLoad = {
                    name: user.name,
                    userName: user.userName,
                    email: user.email,
                    phone: user.phone
                }
                let verify = jwt.sign(payLoad, config.app.secret_token, { expiresIn: '3h' });
                console.log('Token: ', verify)
        
                // const html = "<a href=" + config.app.host +"'/user/passwordreset/" +verify+ "' >Password Reset</a>";
                const html = SetMailing(`${config.app.host}user/passwordreset/${verify}`);

                sendEmail(user, res, html)
            })
            .catch(err => res.status(404).json('Error' + err))
        
    },
    passReset: function(req, res) {
        let token = req.params.token;
        jwt.verify(token, config.app.secret_token , (err, decode) => {
            if(err) {
                return res.status(403).send({ 
                    message: 'no tienes los permisos suficientes para estar aqui', 
                    error: err,
                    token_1: token,
                    token_param: decode
                })
            }
            
            let email = decode.email
            let userName = decode.userName
            let password = req.body.password
        
            // res.status(200).send({email: decode.email, names: decode.name, userName: decode.userName, phones: decode.phone})
        User.findOne({email})
        .then(user => {
            if(!user) return res.status(404).send({message: 'user not found'})
            // res.status(200).send({email, names: decode.name, userName: decode.userName, phones: decode.phone})
            user.userName = userName
            user.email = email
            user.password = password
            user.save()
                .then(() => res.json('Password Reset!!!'))
                .catch(err => res.status(404).json('Error' + err))
        })
        .catch(err => res.status(404).json('Error' + err));
            
        })
    }
};


