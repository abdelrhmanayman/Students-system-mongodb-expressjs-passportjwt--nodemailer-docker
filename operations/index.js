const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path: '../.env' })
const helmet = require('helmet')
const compression = require('compression')
const router = require('./routes')
const { authMiddleware } = require('qurba-package')

mongoose.connect(process.env.MONGOURL, { useNewUrlParser: true, autoReconnect: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(_ => { console.log('Opeartions connected to mongo!') })

const app = express()
app.use(compression())
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(authMiddleware)
app.use(router)

app.listen(process.env.OPERATION_PORT, () => console.log('up on 4000'))