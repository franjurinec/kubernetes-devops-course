require('dotenv').config()

const todosEndpoint = new URL('/todos', process.env.BACKEND_URL ?? 'http://project-backend-svc/')

async function addRandomTodo() {
    let randomWikiURL = await fetch('https://en.wikipedia.org/wiki/Special:Random').then(res => res.url)

    await fetch(todosEndpoint, {
        method: 'POST',
        redirect: 'manual',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'todoText': `Read ${randomWikiURL}`})
    })
}

addRandomTodo()
