const express = require('express')
const router = express.Router()

const isAuth = require('../middleware/isauth')
const Chat = require('../controllers/chat.controller')

router.route('/').get(isAuth, Chat.all)
router.route('/:idUser').get(isAuth, Chat.messages)
router.route('/:id').delete(isAuth, Chat.destroy)
router.route('/add').post(isAuth, Chat.add)


module.exports = router