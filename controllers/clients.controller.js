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
        Client.findById(req.params.id)
        .then(client => {
            client.email = req.body.email
            client.name = req.body.name
            client.phone = req.body.phone
            client.direction = req.body.direction
            client.province = req.body.province
            client.municipality =  req.body.municipality
            client.postalcode = req.body.postalcode
            client.save()
                .then(() => res.json('Client Update!!'))
                .catch(err => res.status(404).json('Error' + err))
        })
        .catch(err => res.status(404).json('Error' + err));
    },
    register: async function(req, res) {
            const newClient = new Client(req.body)
            
            newClient.save()
                .then(() => {
                    Client.findOne(req.email)
                        .then(res => {
                            res.status(200).send({message: 'User add!'})
                        })
                        .catch(err => res.status(404).json('Error' + err))
                    
            })
                .catch(err => res.status(404).json('Error' + err))
    },
    services: async function(req, res) {
        try {
            const client = await (await Client.findById(req.params.id)).execPopulate('services')
            res.json(client)
        } catch(err) {
            res.json('Error ' + err)
        }

    }
    
}