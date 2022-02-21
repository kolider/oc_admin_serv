const
    mysql = require('mysql2'),
    config = require('config')

const pool = mysql.createPool({
    host: config.get('mysql.host'),
    user: config.get('mysql.user'),
    password: config.get('mysql.password'),
    database: config.get('mysql.db_name'),
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0
})

module.exports = {
    getPool: () => (pool),
    getPoolPromise: () => (pool.promise())
}