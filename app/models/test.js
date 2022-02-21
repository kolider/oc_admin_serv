'use strict';

const config = require('config')

const pool = require('mysql2').createPool({
    host: config.get('mysql.host'),
    user: config.get('mysql.user'),
    password: config.get('mysql.password'),
    database: config.get('mysql.db_name'),
    // waitForConnections: true,
    // connectionLimit: 10,
    // queueLimit: 0
});

setInterval(() => {
    for (let i = 0; i < 5; ++i) {
        pool.query("SELECT 1", (err, rows, fields) => {
            console.log(fields);
            // Connection is automatically released once query resolves
        });
    }
}, 1000);

setInterval(() => {
    for (let i = 0; i < 5; ++i) {
        pool.getConnection((err, db) => {
            db.query('select sleep(0.5) as qqq', (err, rows, fields) => {
                // console.log(rows, fields);
                db.release();
            });
        });
    }
}, 1000);