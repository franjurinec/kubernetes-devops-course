require('dotenv').config()
const express = require('express')
const app = express()

const port = process.env.PORT ?? 3000;
const url = process.env.WEBSITE_URL ?? 'https://franjurinec.dev/'

app.get('/', async (req, res) => {
  let websiteResult = await fetch(url)
  console.log(websiteResult)
  res.send(await websiteResult.text())
})

// Start Listening
app.listen(port, () => console.log(`Server started on port ${port}`))