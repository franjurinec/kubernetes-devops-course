const fs = require('fs')
const crypto = require('crypto')

let hash = crypto.randomUUID()

const filePath = '/usr/src/app/files/timestamp.txt'

// Read timestamp on every file change
fs.watchFile(filePath, () => {
    let timestamp = fs.readFileSync(filePath).toString()
    console.log(`${timestamp}: ${hash}`)
})