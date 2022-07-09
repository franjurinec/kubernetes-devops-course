require('dotenv').config()
const express = require('express')

const db = process.env.NO_DB ? {query: () => console.log('DB Query Triggered')} : require('./db')

const homepageClientURL = process.env.FRONTEND_URL ?? '/'

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

db.query('CREATE TABLE IF NOT EXISTS todos ( \
    id SERIAL PRIMARY KEY, \
    value VARCHAR(140) NOT NULL \
)')

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

app.post('/todos', async (req, res) => {
    if(req.body.todoText.length > 140) {
        const errorMsg = 'New todo request exceeds 140 characters.'
        console.error(errorMsg)
        res.json({error: errorMsg})
        return
    }

    console.log(`Creating new todo: ${req.body.todoText}`)
    await insertTodo(req.body.todoText)
    res.redirect(homepageClientURL)
})

app.delete('/todos', async (req, res) => {
    console.log(`Deleting todo #${req.body.todoId}`)
    await deleteTodo(req.body.todoId)
    res.redirect(homepageClientURL)
})

app.get('/todos', async (_, res) => {
    res.json(await getTodos())
})


// Start Listening
app.listen(port, () => console.log(`Server started on port ${port}`))