const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const { config } = require('dotenv')

config()

const angelRoutes = require('./routes/angel.routes')


//Use express para los middleware
const app = express();
app.use(bodyParser.json()) //parseador de bodies

//aca conectare la base de datos:

mongoose.connect(process.env.MONGO_URL, { dbName: process.env.MONGO_DB_NAME })
const db = mongoose.connection;

app.use('/angel', angelRoutes)



const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto: ${port}`)
})
