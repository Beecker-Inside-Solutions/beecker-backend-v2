const mysql = require("mysql2/promise");
require("dotenv").config();

const localConfig = {
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
};

const connection = mysql.createPool(localConfig);

connection.getConnection((err, conn) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connection established");
  conn.release();
});

module.exports = connection;
