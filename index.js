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
const router = express.Router();

// const Service = require('./models/service.model')

const socketServer = require('./socket')

//connect to data base
async function initApp() {
    try {
        connecBD()

        //Listening
     const server =   app.listen(port, () => console.log(`server on ${host}`) )
     socketServer(server)
    }catch(err) {
        console.error(err)
        process.exit(0)
    }
}
 
initApp()
app.use('/public',express.static(__dirname + '/storage/images'))
/*

app.use('/public',express.static(__dirname + '/storage'));

const path = require('path')
const mkdirp = require('mkdirp');
const storage = multer.diskStorage({
    destination:  function (req,file,cb){//Indica la carpeta de destino
        mkdirp(`storage/${moment().format('YYYY-MM-DD').split('-')[0]}/${moment().format('YYYY-MM-DD').split('-')[1]}/${moment().format('YYYY-MM-DD').split('-')[2]}`, function(err, folder) { // path exists unless there was an error 
            let newFolder = `storage/${moment().format('YYYY-MM-DD').split('-')[0]}/${moment().format('YYYY-MM-DD').split('-')[1]}/${moment().format('YYYY-MM-DD').split('-')[2]}`
            cb(null,path.join(__dirname, `${newFolder}`));
            console.log(`storage/${moment().format('YYYY-MM-DD').split('-')[0]}/${moment().format('YYYY-MM-DD').split('-')[1]}/${moment().format('YYYY-MM-DD').split('-')[2]}`)
        })
       
    },
    filename: function (req, file, cb) {
      cb(null,  `img-${Date.now()}.${file.mimetype.split('/')[1]}`)
    }
  })
   
  var upload = multer({ storage })

  app.post('/service/img', upload.any('image'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    const images = req.files
    res.send({images})
  })






var data=[];

console.log("Buscando...")
function scanDirs(directoryPath){
   try{
      var ls=fs.readdirSync(directoryPath);

      for (let index = 0; index < ls.length; index++) {
         const file = path.join(directoryPath, ls[index]);
         var dataFile =null;
         try{
            dataFile =fs.lstatSync(file);
         }catch(e){}

         if(dataFile){
            data.push(
               {
                  path: file,
                  isDirectory: dataFile.isDirectory(),
                  length: dataFile.size
               });

            if(dataFile.isDirectory()){
               scanDirs(file)
            }
         }
      }
   }catch(e){}
}

scanDirs('./storage');

const jsonString = data;

app.get('/coso', function(req, res){
    res.send({jsonString})
})
*/



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
const imgRouters = require('./routers/img.router')
app.use('/user', userRouters)
app.use('/client', clientRouters)
app.use('/service', serviceRouters)
app.use('/chat', chatRouters)
app.use('/img', imgRouters)
app.get('/', (req, res) => {
    res.send({mesasse: 'Hello World'})
})

