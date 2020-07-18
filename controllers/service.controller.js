const Client = require('../models/clients.model')
const Service = require('../models/service.model')
const User = require('../models/user.model')
const { uploadImages } = require('../services')
const fs = require('fs')
const path = require('path')
const zipFolder = require('zip-a-folder');




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
                
                    const services = await Service.find().sort({created_at: -1})

                    console.log('services', services);

                    res.send({ services });
                    
                    // let newNumDeliveryNote;
                    // if(services.length > 0){
                    //     newNumDeliveryNote = services.numDeliveryNote + 1;
                    // }else{
                    //     newNumDeliveryNote = 1;
                    // };
                    
                    // req.body.numDeliveryNote = newNumDeliveryNote;

                    // const payload = req.body
                    // const newService = new Service(payload)

                    // // a nuestro servicio le agregamos el cliente
                    // newService.client = client

                    // // // guadamos el nuevo servicio
                    // await newService.save()
                    //     .then(() => res.status(200).send({message: 'Servicio agregado satisfacoriamente'}))
                    //     .catch(err => res.send({Error: 'Error al guardar el servicio', err}))

                    // console.log(newService)

                
                    // // // al cliente le agregamos el nuevo servicio
                    // client.services.push(newService)

                    // // // guardamos el cliente
                    // await client.save()
                    
                    // res.status(200).send({newService})
                    

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

            const { startDate, startHours, workers } = req.body;
            
            if(workers.length > 0) {

                const service = await Service.findById(serviceId);

                service.workers = workers;
                service.startDate = startDate;
                service.startHours = startHours;

                //Se guarda en el modelo del trabajador el trabajo
                workers.forEach( async function(element) {
                    let worker = await User.findById(element)
                    
                    worker.works.push(service)
                    //service.workers.push(worker)
                    await user.save()
                });
        
                await service.save()

                const services = await Service.find();

                res.status(200).send({ services })
            }else {
                res.status(200).send({ message: 'No se han seleccionado trabajadores' });
            }

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
    downloadImg: function(req, res) {
        const nameImg = req.params.nameImg
        res.download(`./storage/images/${nameImg}`)

    },
    addPdf: function(req, res) {

    },
    downloadPdf: function(req, res) {
        
        const ruta = req.params.folder.split('-')
        if(ruta.length == 1) var folder = path.join(__dirname, `../storage/pdf/${req.params.folder}`) 
        else{
            let year = ruta[0]
            let month = ruta[1]
            folder = path.join(__dirname, `../storage/pdf/${year}/${month}`) 
        }
        console.log(ruta)
        console.log(folder)

        try {
            if(!fs.statSync(folder)) return res.status(404).send({Error: 'Archivo no encontrado'})

            console.log('file or directory exists');
            class ZipAFolder {
        
                static main() {
                    zipFolder.zipFolder(folder,folder+'.zip',  function(err) {
                        if(err) {
                            console.log('Something went wrong!', err);
                        }else{
                            
                            console.log('carpeta comprimida satisfactoriamene!!')

                           res.download(`${folder}.zip`)
                           
                           setTimeout(function(){ 
                                fs.unlink(folder+'.zip', (error) => {
                                    if(error) {
                                        console.log('Ha ocurrido un error')
                                    }else{
                                        console.log('archivo zip eliminado ')
                                    }
                                    
                                })
                            }, 5000);
                            
                        }
                    });
                }
            }
            
            ZipAFolder.main();
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                res.status(404).send({Error: 'La carpeta solicitada no existe.'})
                console.log('file or directory does not exist');
            }
        }
    }
}