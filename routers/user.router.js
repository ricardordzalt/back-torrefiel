const express = require('express')
const router = express.Router();
const cors = require('cors');



// const service = require('../services')
const isAuth = require('../middleware/isauth')
const isAdmin = require('../middleware/isadmin')
const User = require('../controllers/user.controller')


router.route('/').get(User.all)
router.route('/:id').get( User.viewOne)
router.route('/update/:id').put( User.edit)
router.route('/:id').delete( User.destroy)
router.route('/register').post(cors(), User.register)
router.route('/confirmation/:token').get(User.confirmation)
router.route('/login').post(User.login)
router.route('/emailpassreset').post(User.sendEmailPassReset)
router.route('/passwordreset/:token').post(User.passReset)
router.route('/roledit/:id').post(User.editRol)



module.exports = router;