const express = require('express')
const router = express.Router()

const isAdmin = require('../middleware/isadmin')
const Client = require('../controllers/clients.controller')

router.route('/').get(isAdmin, Client.all)
router.route('/:id').get(isAdmin, Client.viewOne)
router.route('/update/:id').put(isAdmin, Client.edit)
router.route('/:id').delete(isAdmin, Client.destroy)
router.route('/register').post(isAdmin, Client.register)
router.route('/:id/services').get(isAdmin, Client.services)

module.exports = router