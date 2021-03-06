const nodemailer = require("nodemailer")
const config = require('../config')
const multer = require('multer')
const path = require('path')
const mkdirp = require('mkdirp');
const moment = require('moment')

function sendPdf (req, html) {
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
            user: "rikardo150@gmail.com", // generated ethereal user
            pass: "Marina.123" // generated ethereal password
        }
        });
        

        
        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"José Grasmin👻"', // sender address
            to: req.email, // list of receivers
            subject: "verifica tu cuenta ✔", // Subject line
            text: "Hello " + req.name, // plain text body
            html: html, // html body
            attachments: [{
                filename: 'file.pdf',
                path: req.path,
                contentType: 'application/pdf'
            }]
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

module.exports = { sendPdf }
