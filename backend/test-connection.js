const oracledb = require('oracledb');

// Ruta del Instant Client recién descargado
oracledb.initOracleClient({ libDir: 'C:\\oracle\\instantclient_23_8' });

const config = {
  user: 'bd2admin',
  password: 'admin',
  connectionString: 'localhost:1521/xe'
};

async function testConnection() {
  let connection;

  try {
    connection = await oracledb.getConnection(config);
    console.log('✅ Conexión exitosa con Oracle.');
    const result = await connection.execute(`SELECT sysdate FROM dual`);
    console.log('Resultado:', result.rows[0]);
  } catch (err) {
    console.error('❌ Error al conectar con Oracle:', err);
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log('🔌 Conexión cerrada.');
      } catch (err) {
        console.error('❌ Error al cerrar la conexión:', err);
      }
    }
  }
}

testConnection();
