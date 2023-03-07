import mysql from 'mysql2'

import dotenv from 'dotenv'
dotenv.config()

mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()


//query that displays table in the from ""
const result = await Pool.query("SELECT * FROM notes ")