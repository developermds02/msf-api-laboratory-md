require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const router = require('./routes/medic')

app.use(cors())
app.use(express.json({ limit: '50mb' }))

const { PORT, NODE_ENV, PORT_DEV } = process.env
const port = NODE_ENV === 'development' ? PORT_DEV : PORT

// routes
app.use(router)

const server = app.listen(port, () => {
  console.log(`server listening on ${port}`)
})

module.exports = { app, server }
