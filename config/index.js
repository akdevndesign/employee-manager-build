const mysql = require('mysql2');

const db = mysql.createConnection(
    {
    host: '127.0.0.1',
    user: 'root',
    password: '12345',
    database: 'employee_db'
    },
    console.log('Created connection')
)

module.exports = db; 