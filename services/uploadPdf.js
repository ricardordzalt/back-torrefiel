const multer = require('multer')
const path = require('path')
const mkdirp = require('mkdirp')
const moment = require('moment')

let year = `${moment().format('YYYY-MM-DD').split('-')[0]}`
let month = `${moment().format('YYYY-MM-DD').split('-')[1]}`
let day = `${moment().format('YYYY-MM-DD').split('-')[2]}`

var folderPdf = path.join(__dirname, `../storage/pdf/${year}/${month}/${day}`)

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        mkdirp(folderPdf , function(err) { // path exists unless there was an error 
            
            cb(null,folderPdf)
            console.log('folderpdf', folderPdf)
        })
    },
    filename: function (req, file, cb) {
        cb(null,  `pdf-${Date.now()}.${file.mimetype.split('/')[1]}`)
    }
  })
   
  var upload = multer({storage}).single("pdf")


  module.exports = { upload }