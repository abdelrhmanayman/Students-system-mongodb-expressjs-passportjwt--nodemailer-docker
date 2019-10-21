const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path: '../.env' }) // configuring .env file
const helmet = require('helmet')
const compression = require('compression')
const router = require('./routes')


mongoose.connect(process.env.MONGOURL, { useNewUrlParser: true, autoReconnect: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(_ => { console.log('Search connected to mongo!') }).catch(({ message }) => { console.log(message) })

const app = express()

app.use(compression())
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(router)

app.listen(process.env.SEARCH_PORT, () => console.log('search started on 800!'))