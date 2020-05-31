const {port, host} = require('./config').app
const express = require('express');
const app = express();
const connecBD = require('./db')
const morgan = require('morgan');
const cors = require('cors');
// const mongoose = require('mongoose');

//connect to data base
async function initApp() {
    try {
        connecBD()

        //Listening
        app.listen(port, () => console.log(`server on ${host}`) );
    }catch(err) {
        console.error(err)
        process.exit(0)
    }
}
 
initApp()

//Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
//Routes

//users
const userRouters = require('./routers/user.router')
const clientRouters = require('./routers/clients.router')
const serviceRouters = require('./routers/service.router')
const chatRouters = require('./routers/chat.router')
app.use('/user', userRouters)
app.use('/client', clientRouters)
app.use('/service', serviceRouters)
app.use('/chat', chatRouters)