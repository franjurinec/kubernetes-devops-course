const express = require('express')
const fs = require('fs/promises')

const app = express()
const port = process.env.PORT ?? 3000

let counter = 0
fs.writeFile('ping-pong-counter.txt', String(0))

app.get('/pingpong', (req, res) => {
    counter += 1
    fs.writeFile('/usr/src/app/files/ping-pong-counter.txt', String(counter))
    res.send(`pong ${counter}`)
})

app.listen(port)