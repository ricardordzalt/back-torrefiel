const nodemailer = require("nodemailer")
const config = require('../config')
const multer = require('multer')
const path = require('path')
const mkdirp = require('mkdirp');
const moment = require('moment')
function sendEmail (req, res, html) {
    async function main() {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        // let testAccount = await nodemailer.createTestAccount();
    
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: config.app.mail, // generated ethereal user
            pass: config.app.mail_pass // generated ethereal password
        }
        });
        

        
        // send mail with defined transport object
        let info = await transporter.sendMail({
        from: '"José Grasmin👻"', // sender address
        to: req.email, // list of receivers
        subject: "verifica tu cuenta ✔", // Subject line
        text: "Hello " + req.name, // plain text body
        html: html // html body
        });
        console.log(req.email);
        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        // res.status(200).send({message: 'Email enviado'})
    }
    
    main().catch(console.error);
}
const confImg = multer.diskStorage({
    destination: function (request, file, cb) {
        mkdirp('../storage/images', function(err, folder) { // path exists unless there was an error 
            
            cb(null,path.join(__dirname, '../storage/images'));
            console.log(path.join(__dirname, '../storage/images'))
        })
    },
    filename: function (req, file, cb) {
        cb(null,  `img-${Date.now()}.${file.mimetype.split('/')[1]}`)
      }
    });
    
const confPdf = multer.diskStorage({
    destination:  function (req,file,cb){//Indica la carpeta de destino
        mkdirp(`storage/pdf/${moment().format('YYYY-MM-DD').split('-')[0]}/${moment().format('YYYY-MM-DD').split('-')[1]}/${moment().format('YYYY-MM-DD').split('-')[2]}`, function(err, folder) { // path exists unless there was an error 
            let newFolder = `storage/pdf/${moment().format('YYYY-MM-DD').split('-')[0]}/${moment().format('YYYY-MM-DD').split('-')[1]}/${moment().format('YYYY-MM-DD').split('-')[2]}`
            cb(null,path.join(__dirname, `${newFolder}`));
            console.log(`storage/pdf/${moment().format('YYYY-MM-DD').split('-')[0]}/${moment().format('YYYY-MM-DD').split('-')[1]}/${moment().format('YYYY-MM-DD').split('-')[2]}`)
        })
       
    },
    filename: function (req, file, cb) {
      cb(null,  `pdf-${Date.now()}.${file.mimetype.split('/')[1]}`)
    }
  })
    // Function to upload project images
const uploadImages = multer({confImg}).any("images");

module.exports = { sendEmail, uploadImages }
