module.exports = (server) => {
   const SocketIO = require('socket.io')
   const io = SocketIO(server)
   io.on('connect', () => {

    console.log('Conectado!!')
   })

}