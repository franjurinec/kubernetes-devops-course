const express = require('express')

const app = express()
const port = process.env.PORT ?? 3000

let counter = 0

app.get('/pingpong', (_, res) => {
    counter += 1
    res.send(`pong ${counter}`)
})

app.get('/count', (_, res) => {
    res.json({count: counter})
})

app.listen(port)