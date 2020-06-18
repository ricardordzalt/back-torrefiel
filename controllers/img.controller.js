const User = require('../models/user.model')
const Imagen = require('../models/img.model');
const Service = require('../models/service.model');
const { host} = require('../config').app
const fs = require('fs')




module.exports = {
    all: function(req, res) {
        Imagen.find()
            .then(messages => res.status(200).json(messages))
            .catch(err => res.status.status(404).json('Error' + err))
    },
    deletePost: function(req, res){
        Imagen.findByIdAndDelete(req.params.id)
        .then(() => {
            // aqui va el codigo para eliminar la imagen
        })
        .catch(err => res.status(404).json('Error' + err));
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
            try {
                if(req.params.idService) {
                    const service = await Service.findById(req.params.idService)
                    const images = req.files
                    const {user, description} = req.body
                    const newImg = new Imagen({user, description})
                    images.forEach(element => {
                        console.log(`${host}/public/${element.filename}`)
                        newImg.images.push(`${host}/public/${element.filename}`)
                    });
                    newImg.service = service
                    service.imagenes.push(newImg)
                    await service.save()
                    await newImg.save()

                 
                 res.send({message: 'imaages guardadas exitosamente'})
                } else {
                    res.send({Error: 'No estás pasano el id del servicio' })
                }
                
                
            }
            catch(err) {
                res.json(err)
            }
    }

}