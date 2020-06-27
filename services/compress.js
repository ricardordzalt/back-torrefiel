const comprees = require('compressing')
const fs = require('fs')
const path = require('path')


const zipFolder = require('zip-a-folder');
 
 const folder = path.join(__dirname, '../storage/images') 
 console.log(folder)

try {
    fs.statSync(folder);
    console.log('file or directory exists');
    class ZipAFolder {
 
        static main() {
            zipFolder.zipFolder(folder,folder+'.zip', function(err) {
                if(err) {
                    console.log('Something went wrong!', err);
                }else{
                    console.log('carpeta coprimida satisfactoriamene!!')
                    fs.unlink(folder+'.zip', (error) => {
                        if(error) {
                            console.log('Ha ocurrido un error')
                        }else{
                            console.log('archivo zip eliminado ')
                        }
                        
                    })
                }
            });
        }
    }
     
    ZipAFolder.main();
}
catch (err) {
  if (err.code === 'ENOENT') {
    console.log('file or directory does not exist');
  }
}