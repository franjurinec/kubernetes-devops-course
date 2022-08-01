require('dotenv').config()
const express = require('express')
const NATS = require('nats')
const natsSC = NATS.StringCodec()

const db = process.env.NO_DB ? {query: () => console.log('DB Query Triggered')} : require('./db')

const homepageClientURL = process.env.FRONTEND_URL ?? '/'

const connPromise = NATS.connect({servers: process.env.NATS_URL ?? 'nats://nats:4222'})


//  ====================
// ==  EXPRESS CONFIG  ==
//  ====================

const app = express()
const port = process.env.PORT ?? 3000
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))


//  =========================
// ==  DB INIT & FUNCTIONS  ==
//  =========================
let databaseReady = false
db.awaitConnection().then(async () => {
    await db.query('CREATE TABLE IF NOT EXISTS todos ( \
        id SERIAL PRIMARY KEY, \
        value VARCHAR(140) NOT NULL \
    )')
    
    databaseReady = true
})


async function insertTodo(text) {
    await db.query('INSERT INTO todos (value) VALUES ($1)', [text])
}

async function deleteTodo(id) {
    await db.query('DELETE FROM todos WHERE id = $1', [id])
}

async function getTodos() {
    return await db.query('SELECT id, value FROM todos').then(res => res.rows)
}

//  ============
// ==  ROUTES  ==
//  ============

app.get('/', (_, res) => {
    res.sendStatus(200)
})

app.get('/databaseready', (_, res) => {
    if (!databaseReady) {
        res.sendStatus(503)
        return
    }
    res.sendStatus(200)
})

app.post('/todos', async (req, res) => {
    if(req.body.todoText.length > 140) {
        const errorMsg = 'New todo request exceeds 140 characters.'
        console.error(errorMsg)
        res.json({error: errorMsg})
        return
    }
    (await connPromise).publish('todo-data', natsSC.encode(`ADDED TODO: ${req.body.todoText}`))
    console.log(`Creating new todo: ${req.body.todoText}`)
    await insertTodo(req.body.todoText)
    res.redirect(homepageClientURL)
})

app.put('/todos/:todoId', async (req, res) => {
    (await connPromise).publish('todo-data', natsSC.encode(`REMOVED TODO [${req.params.todoId}]`))
    console.log(`Deleting todo #${req.params.todoId}`)
    await deleteTodo(req.params.todoId)
    res.redirect(homepageClientURL)
})

app.get('/todos', async (_, res) => {
    res.json(await getTodos())
})


// Start Listening
app.listen(port, () => console.log(`Server started on port ${port}`))