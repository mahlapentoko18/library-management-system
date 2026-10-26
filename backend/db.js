const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',       // Change to your MySQL username
    password: '123456',       // Change to your MySQL password
    database: 'library_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;