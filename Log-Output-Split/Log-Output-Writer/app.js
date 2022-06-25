require('dotenv').config()
const fs = require('fs/promises')

const filePath = process.env.FILE_PATH ?? '/usr/src/app/files/timestamp.txt'

setInterval(() => {
    fs.writeFile(filePath, new Date().toISOString())
}, 5000)
