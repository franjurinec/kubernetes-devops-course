const express = require('express')
const fs = require('fs')
const ImageDownloader = require('image-downloader')

// Static local storage location
const basepath = '/usr/src/app/files/'

// Express Setup
const app = express()
const port = process.env.PORT ?? 3000
app.set('view engine', 'pug')
app.use(express.static(basepath))

// Load daily image metadata
let imageMeta = {}
try {
    imageMeta = JSON.parse(fs.readFileSync(basepath + 'imageMeta.json'))
} catch(err) {
    // console.log(err)
    console.log('Found no existing metadata.')
}

// Download new image and update stored metadata
async function updateImage() {
    // Guard clause - stop if image is up-to-date
    if (new Date().toDateString() === imageMeta.date) return

    await ImageDownloader.image({
        url: 'https://picsum.photos/1024/512',
        dest: basepath + 'daily.jpg'
    }).catch(err => {
        if (err.code === 'EAI_AGAIN') return
        console.log(err)
    })
    
    imageMeta.date = new Date().toDateString()
    fs.writeFileSync(basepath + 'imageMeta.json', JSON.stringify(imageMeta))
}

// Routes
app.get('/', async (req, res) => {
    await updateImage()
    res.render('index')
})

app.get('/kill', (req, res) => {
    res.send('Shutting down...')
    process.exit(5)
})

// Start Listening
app.listen(port, () => console.log(`Server started on port ${port}`))