const User = require('../models/user.model')
const Imagen = require('../models/img.model');
const Service = require('../models/service.model');
const { host } = require('../config').app
const fs = require('fs')




module.exports = {
    all: function(req, res) {
        Imagen.find()
            .then(messages => res.status(200).json(messages))
            .catch(err => res.status.status(404).json('Error' + err))
    },
    deleteimage:  function(req, res){
        const id = req.params.id
        const { img } = req.body
        console.log(img)
        const url = `${host}/public/${img}`
        fs.unlink(`./storage/images/${img}`, async (error) => {
            if(error) {
                res.send({Error:' Ha ocurrido un error', error})
            } else {
                const imagen = await Imagen.findById(id)
                const imgUrl = imagen.images.find(img => img == url)
                const position = imagen.images.indexOf(imgUrl)
                imagen.images.splice(position, 1)
                console.log(position)
                await imagen.save()
                res.send({message: 'Imagen eliminada!!', imagen})
            }
        })

    },
    add: async function(req, res) {
        const pdf = req.file
        const idService = req.params.idService

        const service = await Service.findById(idService)
        
    
            const path =  pdf.path
            let year = path.split('\\')[8]
            let month = path.split('\\')[9]
            let day = path.split('\\')[10]
            let namePdf = pdf.filename
            let ruta = `${host}/public/pdf/${year}/${month}/${day}/${namePdf}`
            
            res.send(ruta)
    
        //    res.send(pdf)
    }

}