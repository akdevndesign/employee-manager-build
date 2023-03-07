const mysql = require('mysql2');

const db = mysql.createConnection(
    {host: 'localhost' || 3001,
    user: 'root',
    password: '12345',
    database: 'employee_db'
    }
)

module.exports = db; 