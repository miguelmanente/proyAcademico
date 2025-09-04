const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',      // tu usuario MySQL
  password: '',  
  port: 8080,    // tu contraseña
  database: 'Escuela',
  multipleStatements: true
});

connection.connect(err => {
  if (err) throw err;
  console.log('✅ Conectado a MySQL');
});

module.exports = connection;