const fs = require('fs/promises')

setInterval(() => {
    fs.writeFile('/usr/src/app/files/timestamp.txt', new Date().toISOString())
}, 5000)