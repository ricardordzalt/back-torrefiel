const {port, host} = require('./config').app
const express = require('express');
const app = express();
const connecBD = require('./db')
const morgan = require('morgan');
const cors = require('cors');
const multer = require('multer')
const fs = require('fs');
const moment = require('moment')
// const mongoose = require('mongoose');

app.use(cors());
app.options('*', cors());


const router = express.Router();

// const Service = require('./models/service.model')


//Middlewares
app.use(morgan('dev'));

app.use(express.json());


//connect to data base
async function initApp() {
    try {
        connecBD()

        //Listening
     const server =   app.listen(5001, () => console.log(`server on ${host}`) )
    //  socketServer(server)
    }catch(err) {
        console.error(err)
        process.exit(0)
    }
}
 
initApp()
app.use('/public',express.static(__dirname + '/storage'))



//Routes

//users
const userRouters = require('./routers/user.router')
const clientRouters = require('./routers/clients.router')
const serviceRouters = require('./routers/service.router')
const chatRouters = require('./routers/chat.router')
const imgRouters = require('./routers/img.router')
const workerRouters = require('./routers/worker.router')
const pdfRouters = require('./routers/pdf.router')
app.use('/user',cors(), userRouters)
app.use('/client', cors(), clientRouters)
app.use('/service', cors(), serviceRouters)
app.use('/chat', cors(), chatRouters)
app.use('/img', cors(), imgRouters)
app.use('/worker', cors(), workerRouters)
app.use('/pdf', cors(), pdfRouters)
app.get('/', (req, res) => {
    res.send({mesasse: 'Hello World'})
})

