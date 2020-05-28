const User = require('../models/user.model')
const Message = require('../models/chat.model')




module.exports = {
    all: function(req, res) {
        Message.find()
            .then(messages => res.status(200).json(messages))
            .catch(err => res.status.status(404).json('Error' + err))
    },
    destroy: function(req, res){
        Message.findByIdAndDelete(req.params.id)
        .then(() => res.json('Client delete!!'))
        .catch(err => res.status(404).json('Error' + err));
    },
    add: async function(req, res) {
            try {
                const user = await  User.findById(req.params.id)
                const newMessage = new Message(req.body)
                newMessage.user = user
                await newMessage.save()

                user.messages.push(newMessage)
                await user.save()
                res.json('nuevo message guardado!!')
            }
            catch(err) {
                res.json(err)
            }
    },
    messages: async function(req, res) {
        try {
            const messages = await (await User.findById(req.params.idUser)).execPopulate('messages')
            res.json(messages)
        } catch(err) {
            res.json('Error ' + err)
        }

    }

}