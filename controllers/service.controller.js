const Client = require('../models/clients.model')
const Service = require('../models/service.model')
const User = require('../models/user.model')
const { uploadImages } = require('../services')




module.exports = {
    all: function(req, res) {
        Service.find()
            .then(clients => res.status(200).json(clients))
            .catch(err => res.status.status(404).json('Error' + err))
    },
    viewOne: function(req, res){
        Service.findById(req.params.id)
        .then(client => res.json(client))
        .catch(err => res.status(404).json('Error' + err));
    },
    destroy: function(req, res){
        Service.findByIdAndDelete(req.params.id)
        .then(() => res.json('Service delete!!'))
        .catch(err => res.status(404).json('Error' + err));
    },
    edit: function(req, res){
        Service.findById(req.params.id)
        .then(service => {
            service.description = req.body.description
            service.status = req.body.status
            service.priority = req.body.priority
            service.amount = req.body.amount
            service.start = req.body.start
            service.finalized =  req.body.finalized
            service.save()
                .then(() => res.json('Service Update!!'))
                .catch(err => res.status(404).json('Error' + err))
        })
        .catch(err => res.status(404).json('Error' + err));
    },
    register: async function(req, res) {
        

            try {


                // id del cliente
                const id = req.params.idClient

                // Buscamos el cliente
                if(id){

                    const client = await  Client.findById(id)
                
                // datos del servicio que llegan desde el front
               
                const { activities, 
                        amount, 
                        description, 
                        note, 
                        numBill, 
                        numDeliveryNote, 
                        priority, 
                        startDate, 
                        startHours,
                        status,
                        numService,
                        numberInternal,
                        numberExternal,
                        direction,
                        typeIva,
                        province,
                        municipality,
                        postalCode


                    } = req.body
                
                // cargamos el modelo sevice con los datos recividos
                const newService = new Service({ activities, 
                    amount, 
                    description, 
                    note, 
                    numBill, 
                    numDeliveryNote, 
                    priority, 
                    startDate, 
                    startHours,
                    status,
                    numService,
                    numberInternal,
                    numberExternal,
                    direction,
                    typeIva,
                    province,
                    municipality,
                    postalCode


                } )

                // a nuestro servicio le agregamos el cliente
                newService.client = client
                // // guadamos el nuevo servicio
                
                        
                        await newService.save()
                            .then(() => res.status(200).send({message: 'Servicio agregado satisfacoriamente'}))
                            .catch(err => res.send({Error: 'Error al guardar el servicio', err}))

                        console.log(newService)


                    
                
                // // al cliente le agregamos el nuevo servicio
                client.services.push(newService)
                // // guardamos el cliente
                await client.save()
                
                res.status(200).send({newService})
                

                }
                else {
                    res.send({Error: 'No estas pasnado el id del cliente'})
                }
                
            }
            catch(err) {
                res.status(404).send({
                    menssages: 'hubo un error',
                    error: err
            })
            }
    },
    addWorker: async function(req, res) {
        try {
            let serviceId = req.params.idService
            let workers = req.body.workers
            const service = await Service.findById(serviceId)
            workers.forEach( async function(element) {
                let worker = await User.findById(element)
                
                worker.works.push(service)
                service.workers.push(worker)
                await user.save()
            });
    
            await service.save()


            res.status(200).send({user, service})
        } catch(err) {
            res.json('Error ' + err)
        }
    },
    delWorker: async function(req, res) {
        try {
            let userId = req.params.idUser
            let serviceId = req.params.idService
            const user = await User.findById(userId)
            const service = await Service.findById(serviceId)

           let posWork = user.works.indexOf(serviceId)
           let posWorker = service.workers.indexOf(userId)
           user.works.splice(posWork, 1)
           service.workers.splice(posWorker, 1)
            await user.save()
            await service.save()

            res.status(200).send({user, service})
        } catch(err) {
            res.json('Error ' + err)
        }
    },
   images: async function(req, res) {
        try {
            const imagenes = await (await Service.findById(req.params.idService)).execPopulate('imagenes')             
            res.status(200).json(imagenes)
        } catch(err) {
            res.json('Error ' + err)
        }

    },
    addPdf: function(req, res) {

    },
    downloadImg: function(req, res) {
        const nameImg = req.params.nameImg
        res.download(`./storage/images/${nameImg}`)

    }
}