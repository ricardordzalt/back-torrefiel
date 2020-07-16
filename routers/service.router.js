const express = require('express')
const router = express.Router()

const isAdmin = require('../middleware/isadmin')
const Service = require('../controllers/service.controller')
const services = require('../services')

// acá va el id del cliente que está pidiendo el servico
router.route('/register/:idClient').post(Service.register)
router.route('/').get(Service.all)
// router.route('/:id').get(isAdmin, User.viewOne)
router.route('/update/:id').put( Service.edit)
router.route('/:id').delete( Service.destroy)
router.route('/:idService').put( Service.addWorker)
router.route('/:idService/:idUser').delete( Service.delWorker)
router.route('/images/:idService').get(Service.images)
router.route('/downloadImges/:nameImg').get(Service.downloadImg)
router.route('/downloadPdf/:folder').get(Service.downloadPdf)
module.exports = router

