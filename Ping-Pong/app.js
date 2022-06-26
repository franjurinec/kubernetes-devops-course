const express = require('express')
const db = require('./db')

const app = express()
const port = process.env.PORT ?? 3000


// CREATE TABLE AND INSERT DEFAULT VALUE IF NOT ALREADY EXISTING

db.query('CREATE TABLE IF NOT EXISTS ping_pong ( \
    name varchar(45) NOT NULL, \
    value integer NOT NULL, \
    PRIMARY KEY (name) \
)')

db.query('INSERT INTO ping_pong (name, value) VALUES (\'count\', \'0\') ON CONFLICT (name) DO NOTHING')


// DEFINE HELPER DATABASE FUNCTIONS

async function getCount() {
    let result = await db.query('SELECT value FROM ping_pong WHERE name = \'count\'')
    return result.rows[0].value
}

async function incrementCount() {
    await db.query('UPDATE ping_pong SET value = value + 1 WHERE name = \'count\'')
}


// ROUTES

app.get('/pingpong', async (_, res) => {
    await incrementCount()
    res.send(`pong ${await getCount()}`)
})

app.get('/count', async (_, res) => {
    res.json({count: await getCount()})
})

app.listen(port)