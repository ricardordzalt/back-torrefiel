const mongoose = require('mongoose')
const Schema = mongoose.Schema

const chatSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    images: {
        type: Array
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Chats = mongoose.model('Chat', chatSchema)

module.exports = Chats;