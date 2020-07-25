const Client = require('../models/clients.model')

module.exports = {
    all: function(req, res) {
        Client.find()
            .then(clients => res.status(200).json(clients))
            .catch(err => res.status.status(404).json('Error' + err))
    },
    viewOne: function(req, res){
        Client.findById(req.params.numClient)
        .then(client => res.json(client))
        .catch(err => res.status(404).json('Error' + err));
    },
    destroy: function(req, res){
        Client.findByIdAndDelete(req.params.id)
        .then(() => res.json('Client delete!!'))
        .catch(err => res.status(404).json('Error' + err));
    },
    edit: function(req, res){
        console.log('body', req.body);
        Client.findById(req.params.id)
        .then(client => {
            client.nif = req.body.nif
            client.name = req.body.name
            client.nameCompany = req.body.nameCompany
            client.lastName = req.body.lastName
            client.motherLastName = req.body.motherLastName
            client.postalcode = req.body.postalcode
            client.phoneOne = req.body.phoneOne
            client.phoneTwo = req.body.phoneTwo
            client.email = req.body.email
            client.direction = req.body.direction
            client.province = req.body.province
            client.municipality =  req.body.municipality
            client.numberExternal = req.body.numberExternal
            client.numberInternal = req.body.numberInternal
            client.save()
                .then(() => res.status(200).send({message: 'Client Update!', client}))
                .catch(err => res.status(404).json('Error' + err))
        })
        .catch(err => res.status(404).json('Error' + err));
    },
    register: async function(req, res) {
            
            const newClient = new Client(req.body)
            
            newClient.save()
                .then(() => {
                    const email = req.body.email
                    Client.findOne({email})
                        .then(client => {
                            res.status(200).send({message: 'User add!', client})
                        })
                        .catch(err => res.status(404).json('Error' + err))
                    
            })
                .catch(err => res.status(404).json('Error' + err))
    },
    services: async function(req, res) {
        try {
            if(req.params.id) {
                const servicios = await (await Client.findById(req.params.id)).execPopulate('services')
                res.send(servicios)
            }
            
        } catch(err) {
            res.json('Error ' + err)
        }

    }
    
}