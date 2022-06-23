require('dotenv').config()
const crypto = require('crypto')
const express = require('express')

const app = express()
const port = process.env.PORT ?? 3000

const helloMessage = process.env.MESSAGE ?? 'No message specified.'
const hash = crypto.randomUUID()

setInterval(() => console.log(`${new Date().toISOString()}: ${hash}`), 5000)

app.get('/', async (_, res) => {
    let pingPongData = await fetch('http://ping-pong-svc/count').then(res => res.json()).catch(() => 0)
    res.send(`${helloMessage}
                <br> ${new Date().toISOString()}: ${hash} 
                <br> Ping / Pongs: ${pingPongData.count ?? 0}`)
})

app.listen(port)