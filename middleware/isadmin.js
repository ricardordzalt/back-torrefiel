const jwt = require('jsonwebtoken')
module.exports = function (req, res, next) {
    // console.log(req.headers)
    if(req.headers.authorization){
        let token = req.headers.authorization.split(' ')[1];
        
        jwt.verify(token, process.env.SECRET_TOKEN , (err, decode) => {
            if(err) {
                return res.status(403).send({ 
                    message: 'no tienes los permisos suficientes para estar aqui', 
                    error: err 
                })
            }
            if(decode.rol == 'admin') {
                next();
            }else {
                return res.status(403).send({ 
                    message: 'no tienes los permisos suficientes para estar aqui, eres un usuario regular'
                })
            }
            
        })
        
    }else{
        res.status(403).send({message: "No tienes los permisos suficientes para estar aquí"})
    }
}