const Client = require('../models/clients.model')
const Service = require('../models/service.model')




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
        res.status(200).send({
            id,
            client,
            newService
    })

            // try {
            //     const { description, status, priority, amount, startHours, startDate, finalized, numService, numDeliveryNote, numBill, acivities, note, descriptionShort } = req.body
            //     const id = req.params.id
                
            //     const client = await  Client.findById(req.params.id)
            //     const newService = new Service(description, status, priority, amount, startHours, startDate, finalized, numService, numDeliveryNote, numBill, acivities, note, descriptionShort)
            //     // newService.client = client
            //     // await newService.save()

            //     // client.services.push(newService)
            //     // await client.save()
            //     // res.status(200).send(newService)
            //     res.status(200).send({
            //         id,
            //         client,
            //         newService
            // })
            // }
            // catch(err) {
            //     res.status(404).send({
            //         menssages: 'hubo un error',
            //         error: err
            // })
            }
    },
    addWorker: async function(req, res) {
        try {
            let userId = req.params.idUser
            let serviceId = req.params.idService
            const user = await User.findById(userId)
            const service = await Service.findById(serviceId)

            user.works.push(service)
            service.workers.push(user)
            await user.save()
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
    }
}