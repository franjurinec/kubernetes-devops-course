require('dotenv').config()
const express = require('express')

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


//  =================
// ==  TODOS LOGIC  ==
//  =================

let todos = []


//  ============
// ==  ROUTES  ==
//  ============

app.post('/todos', (req, res) => {
    let newTodoData = req.body
    todos.push(newTodoData.todoText)
    res.redirect(homepageClientURL)
})

app.get('/todos', (_, res) => {
    res.json(todos)
})


// Start Listening
app.listen(port, () => console.log(`Server started on port ${port}`))