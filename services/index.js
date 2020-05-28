const nodemailer = require("nodemailer")

function sendEmail (req, res, html) {
    async function main() {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        // let testAccount = await nodemailer.createTestAccount();
    
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'j.urbina.0179@gmail.com', // generated ethereal user
            pass: '19111996te' // generated ethereal password
        }
        });
        

        
        // send mail with defined transport object
        let info = await transporter.sendMail({
        from: '"José Grasmin👻" <j.urbina.0179@gmail.com>', // sender address
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

module.exports = { sendEmail }
