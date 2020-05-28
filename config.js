require('dotenv').config();

config = {
    app: {
        port: process.env.PORT,
        host: process.env.HOST

    }, 
    db: {
        port: process.env.DB_PORT,
        host: process.env.DB_HOST,
        dbName: process.env.DB_NAME
    }
}

module.exports = config