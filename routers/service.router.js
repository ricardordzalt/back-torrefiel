const express = require('express')
const router = express.Router()

const isAdmin = require('../middleware/isadmin')
const Service = require('../controllers/service.controller')

// acá va el id del cliente que está pidiendo el servico
router.route('/register/:id').post(isAdmin, Service.register)
router.route('/').get(Service.all)
// router.route('/:id').get(isAdmin, User.viewOne)
router.route('/update/:id').put( Service.edit)
router.route('/:id').delete(isAdmin, Service.destroy)
router.route('/:idService/:idUser').put( Service.addWorker)
router.route('/:idService/:idUser').delete( Service.delWorker)

module.exports = router

