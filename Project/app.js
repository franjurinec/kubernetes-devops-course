require('dotenv').config()
const express = require('express')
const fs = require('fs')
const path = require('path')
const ImageDownloader = require('image-downloader')

// Public folder location
const basepath = process.env.PUBLIC_PATH ?? '/usr/src/app/files/'


//  ====================
// ==  EXPRESS CONFIG  ==
//  ====================

const app = express()
const port = process.env.PORT ?? 3000
app.set('view engine', 'pug')
app.use(express.static(basepath))



//  =======================
// ==  DAILY IMAGE LOGIC  ==
//  =======================

// Load daily image metadata
let imageMeta = {}
try {
    imageMeta = JSON.parse(fs.readFileSync(path.join(basepath, 'imageMeta.json')))
} catch(err) {
    // console.log(err)
    console.log('Found no existing metadata.')
}

// Download new image and update stored metadata if necessary
async function updateImage() {
    if (new Date().toDateString() === imageMeta.date) return

    await ImageDownloader.image({
        url: 'https://picsum.photos/1024/512',
        dest: path.join(basepath, 'image.jpg')
    }).catch(console.error)
    
    imageMeta.date = new Date().toDateString()
    fs.writeFileSync(path.join(basepath, 'imageMeta.json'), JSON.stringify(imageMeta))
}


//  ============
// ==  ROUTES  ==
//  ============

// Home Page
app.get('/', async (_, res) => {
    await updateImage()
    res.render('index')
})

// Kill Server (for persistence testing)
app.get('/kill', (_, res) => {
    res.send('Shutting down...')
    process.exit(5)
})


// Start Listening
app.listen(port, () => console.log(`Server started on port ${port}`))