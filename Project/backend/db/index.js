const { Pool } = require('pg')

const pool = new Pool()

module.exports = {
  query: (text, params) => pool.query(text, params),
  awaitConnection: () => new Promise(resolve => {
    setInterval(() => {
      pool.connect().then(conn => {
        conn.release()
        resolve('Connected!')
        clearInterval(this)
      }).catch((_) => {
        // console.error('Failed to reach DB, retrying in 10s...')
      })
    }, 10000)
  })
}