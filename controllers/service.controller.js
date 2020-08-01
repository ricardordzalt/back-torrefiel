const Client = require('../models/clients.model')
const Service = require('../models/service.model')
const User = require('../models/user.model')
const { uploadImages } = require('../services')
const fs = require('fs')
const path = require('path')
const zipFolder = require('zip-a-folder');
const { COPYFILE_FICLONE_FORCE } = require('constants')
const { host} = require('../config').app





module.exports = {
    all: async function(req, res) {

        const oldestService = await Service.find().sort({ _id: 1 }).limit(1)
        //const oldestYear = parseInt(JSON.stringify(oldestService[0].createdAt).replace('"', '').split('-')[0]);
        const currentYear = new Date().getFullYear();

        const years = [];
        for(let i=currentYear;i<=currentYear+1;i++){
            years.push(i);
        };

        console.log('years', years);

        Service.find()
            .then(services => res.status(200).send({ services, years }))
            .catch(err => res.status(404).json('Error' + err))
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
            service.name = req.body.name
            service.lastName = req.body.lastName
            service.motherLastName = req.body.motherLastName
            service.direction = req.body.direction
            service.numberExternal =  req.body.numberExternal
            service.numberInternal = req.body.numberInternal
            service.province = req.body.province
            service.municipality = req.body.municipality
            service.numBill = req.body.numBill
            service.typeIva = req.body.typeIva
            service.activities = req.body.activities
            service.note = req.body.note
            
            service.save()
                .then(() => res.send(service))
                .catch(err => res.status(404).json('Error' + err))
        })
        .catch(err => res.status(404).json('Error' + err));
    },
    register: async function(req, res) {
        // se convierte de string a booleano;
        console.log('body', req.body);
        req.body.priority = req.body.priority === 'true';
    
            try {

                // id del cliente
                const id = req.params.idClient

                // Buscamos el cliente
                if(id){

                    const client = await  Client.findById(id)
                
                    const services = await Service.findOne().sort({ _id: -1 })

                    //console.log('services', services);
                    
                    let newNumDeliveryNote;
                    if(services !== null){
                        newNumDeliveryNote = services.numDeliveryNote + 1;
                    }else{
                        newNumDeliveryNote = 1;
                    };
                    
                    req.body.numDeliveryNote = newNumDeliveryNote;

                    const payload = req.body
                    const newService = new Service(payload)

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

            let { startDate, startHours, workers } = req.body;

            if(workers.length > 0) {

                const service = await Service.findById(serviceId);

                service.workers = workers;
                service.startDate = startDate;
                service.startHours = startHours;

                //Se guarda en el modelo del trabajador el trabajo
                const workersDB = await User.find();


                let flag = false;
                let workersArray = [];

                workers.forEach(worker => {
                    const filteredWorkerDB = workersDB.filter(workerDB => JSON.stringify(workerDB._id) === JSON.stringify(worker));
                    workersArray.push(filteredWorkerDB[0]);
                });

                workersArray.forEach(async workerSelected => {
                    workerSelected.works.forEach(work => {
                        if(JSON.stringify(work) === JSON.stringify(serviceId)){
                            flag = true;
                        };
                    });
                    if(!flag){
                        workerSelected.works.push(service);
                    };
                    flag = false;
                    await workerSelected.save();
                });

                let workersDoesntMatch = [];
                flag = false;
                workersDB.forEach(workerDB => {
                    workersArray.forEach(worker => {
                        if(worker._id === workerDB._id){
                            flag = true;
                        }
                    })
                    if(!flag){
                        workersDoesntMatch.push(workerDB);
                    };
                    flag = false;
                });

                workersDoesntMatch.forEach(workerDoesntMatch => {
                    workerDoesntMatch.works.forEach(work => {
                        if(work == serviceId){
                            workersDB.forEach(async workerDB => {
                                if(workerDB.works === workerDoesntMatch.works){
                                    workerDB.works = workerDB.works.filter(work => JSON.stringify(work) != JSON.stringify(serviceId));
                                    await workerDB.save();
                                };
                            });
                        };
                    });
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
    },

    worksPerUser: async function(req, res){
        const { idUser } = req.params;

        let services = await User.findById(idUser).populate('works');

        res.send(services);
    },
    uploadSign: async function(req, res) {
        const { filename } = req.file;
        const { idService } = req.params;
        const url = `${host}/public/images/${filename}`;

        try{
            const service = await Service.findById(idService);
            service.signUrl = url;

            await service.save();

            res.send(service);
        }catch(err) {
            res.send('err', err);
        };
    }
};