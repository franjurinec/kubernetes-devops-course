const fs = require('fs')
const crypto = require('crypto')
const express = require('express')

const app = express()
const port = process.env.PORT ?? 3000

let hash = crypto.randomUUID()

setInterval(() => console.log(`${new Date().toISOString()}: ${hash}`), 5000)

app.get('/', (req, res) => {
    let pingPongCount = fs.readFileSync('/usr/src/app/files/ping-pong-counter.txt').toString()
    res.send(`${new Date().toISOString()}: ${hash} <br> Ping / Pongs: ${pingPongCount}`)
})

app.listen(port)