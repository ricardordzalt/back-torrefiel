const express = require('express')
const router = express.Router();



// const service = require('../services')
const isAuth = require('../middleware/isauth')
const isAdmin = require('../middleware/isadmin')
const Worker = require('../controllers/workers.controller')


router.route('/').get(Worker.all)
router.route('/:id').get( Worker.viewOne)
router.route('/update/:id').put( Worker.edit)
router.route('/:id').delete( Worker.destroy)
router.route('/register').post(Worker.register)
router.route('/login').post(Worker.login)
router.route('/emailpassreset').post(Worker.sendEmailPassReset)
router.route('/passwordreset/:token').post(Worker.passReset)
router.route('/roledit/:id').post(Worker.editRol)



module.exports = router;