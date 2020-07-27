const express = require('express')
const router = express.Router()
const { upload } = require('../services/uploadImg')

const isAdmin = require('../middleware/isadmin')
const Imagen = require('../controllers/img.controller')

router.route('/').get( Imagen.all)

// router.route('/:id').delete(Imagen.destroy)
router.route('/add/:idService').post(upload.any('images'), Imagen.add)
router.route('/:id').post( Imagen.deleteimage )



module.exports = router