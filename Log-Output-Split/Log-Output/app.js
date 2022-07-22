require('dotenv').config()
const fs = require('fs')
const crypto = require('crypto')
const express = require('express')

const app = express()
const port = process.env.PORT ?? 3000

const helloMessage = process.env.MESSAGE ?? 'No message specified.'
const hash = crypto.randomUUID()

const filePath = process.env.FILE_PATH ?? '/usr/src/app/files/timestamp.txt'
fs.writeFileSync(filePath, new Date().toISOString())

// Read timestamp on every file change - updated by Log-Output-Writer every 5s
fs.watchFile(filePath, () => {
    let timestamp = fs.readFileSync(filePath).toString()
    console.log(`${timestamp}: ${hash}`)
})

app.get('/', async (_, res) => {
    let pingPongData = await fetch('http://ping-pong-svc/count').then(res => res.json()).catch(() => 0)
    res.send(`${helloMessage}
                <br> ${new Date().toISOString()}: ${hash} 
                <br> Ping / Pongs: ${pingPongData.count ?? 0}`)
})

app.get('/ready', async (_, res) => {
    await fetch('http://ping-pong-svc/databaseready')
        .then(() => res.sendStatus(200))
        .catch(() => res.sendStatus(503))
})

app.listen(port)