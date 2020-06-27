const express = require('express')
const router = express.Router()
const { upload } = require('../services/uploadPdf')

const isAdmin = require('../middleware/isadmin')
const Pdf = require('../controllers/pdf.controller')

router.route('/').get( Pdf.all)

// router.route('/:id').delete(Pdf.destroy)
router.route('/add').post(upload, Pdf.add)
router.route('/:id').post(Pdf.deleteimage )



module.exports = router