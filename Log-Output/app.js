const crypto = require('crypto')
const express = require('express')

const app = express()
const port = process.env.PORT ?? 3000

let hash = crypto.randomUUID()

setInterval(() => console.log(`${new Date().toISOString()}: ${hash}`), 5000)

app.get('/', async (_, res) => {
    let pingPongData = await fetch('http://ping-pong-svc/count').then(res => res.json())
    res.send(`${new Date().toISOString()}: ${hash} <br> Ping / Pongs: ${pingPongData.count}`)
})

app.listen(port)