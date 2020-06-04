const express = require('express')
const router = express.Router()

const isAdmin = require('../middleware/isadmin')
const Client = require('../controllers/clients.controller')

router.route('/').get( Client.all)
router.route('/:numClient').get( Client.viewOne)
router.route('/update/:id').put( Client.edit)
router.route('/:id').delete(Client.destroy)
router.route('/register').post( Client.register)
router.route('/:id/services').get( Client.services)

module.exports = router