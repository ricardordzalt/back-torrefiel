
const mongoose = require('mongoose')
const config = require('../config')

const connection = mongoose.connection

connection.once('open', () => console.log('MongoDB database connection established successfolly') )


async function connecBD(port, host, dbName) {
    // const uri = `mongodb://${host}:${port}/${dbName}`
    const uri = process.env.DB_MONGO
    await mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
}
const port = config.db.port
const host = config.db.host
const dbName = config.db.dbName
connecBD(port, host, dbName)

module.exports = connecBD