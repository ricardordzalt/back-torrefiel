require('dotenv').config
const  Worker = require('../models/worker.model')


const jwt = require('jsonwebtoken')


const config = require('../config')

module.exports = {
    all: function(req, res){
        Worker.find()
        .then(users => res.status(200).json(users))
        .catch(err => res.status(404).json('Error' + err));
    },
    viewOne: function(req, res){
        Worker.findById(req.params.id)
        .then(worker => res.json(worker))
        .catch(err => res.status(404).json('Error' + err));
    },
    destroy: function(req, res){
        Worker.findByIdAndDelete(req.params.id)
        .then(() => res.json('Worker delete!!'))
        .catch(err => res.status(404).json('Error' + err));
    },
    edit: function(req, res){
        Worker.findById(req.params.id)
        .then(worker => {
            worker.userName = req.body.name
            worker.email = req.body.email
            worker.name = req.body.userName
            worker.phone = req.body.phone
            worker.rol = req.body.rol
            worker.isVerify = req.body.isVerify
            worker.save()
                .then(() => res.json('Worker Update!'))
                .catch(err => res.status(404).json('Error' + err))
        })
        .catch(err => res.status(404).json('Error al editar el trabajador' + err));
    },
    editRol: async function(req, res) {
        if(req.params.id) {
            const worker = await Worker.findById(req.params.id) 
            worker.rol = req.body.rol
                try {
                    await worker.save()
                    return res.status(2000).send({message: "rol cambiado satisfactoriante."})
                } catch(err) {
                    return res.status(403).send({Error: "No se pudo cambiar el rol", err})
                }
        }else {
           return res.status(404).send({Error: "Pase el id del usuario al que desea cambiar el rol"})
        }
    },
    register: async function(req, res){
            const {name, lastName, password, color, rol, userName } = req.body
            
            const newWorker = new Worker({name, lastName, password, color, rol, userName })
           
            newWorker.save()
                .then(() => {
                    res.status(200).send({message: 'Trabajador agregado satisfactoriamente', password})
                })
                .catch(err => res.status(404).json('Error al agregar el trabajador' + err));
    },
    login: function(req, res) {
        let userName = req.body.userName
        let password = req.body.password
        Worker.findOne({ userName })
            .then(worker => {
                if(!worker) return res.status(404).send({message: 'worker not found'})
                bcrypt.compare(password, worker.password)
                    .then(match => {
                        if(!match) return res.status(404).send({message: 'Password Incorrecta!!'})

                        // res.status.json({token: service.createToken(worker)}) ;
                            payLoad = {
                                id: worker._id,
                                userName: worker.userName,
                                rol: worker.rol
                            }
                        // poner clave secreta en una variable de entorno
                            jwt.sign(payLoad, config.app.secret_token , (err, token) => {
                                if(err) return res.status(500).json({Error : err})
                                const name = worker.name
                                res.status(200).json({message: 'aceso consedido', token, name})
                            })
                    })
                    .catch(err => res.status(500).send({message: 'acá hay un error ', err}))
            })
                
            .catch(err => res.status(500).send({err}))
    },
    sendEmailPassReset: function(req, res) {
    const  {email, userName} = req.body
        
        Worker.findOne({email})
            .then(worker => {
                // res.status(200).send({message: user})
               
               
                payLoad = {
                    name: user.name
                    
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
        Worker.findOne({email})
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


