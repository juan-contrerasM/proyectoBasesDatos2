// backend/server.js
const express = require('express');
const oracledb = require('oracledb');
oracledb.initOracleClient({ libDir: 'C:\\oracle\\instantclient_23_8' });
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());



// Configuración de Oracle
const dbConfig = {
  user: 'bd2admin',
  password: 'admin',
  connectionString: 'localhost:1521/xe' 
};

// Registro de usuario (profesor o alumno)
app.post('/api/registro', async (req, res) => {
  const {
    num_identificacion, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
    fecha_nacimiento, genero, departamento, direccion, fecha_ingreso,
    correo, clave, tipo_usuario
  } = req.body;

  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(`
      BEGIN
        crear_usuario(
          :num_identificacion, :primer_nombre, :segundo_nombre, :primer_apellido, :segundo_apellido,
          TO_DATE(:fecha_nacimiento, 'YYYY-MM-DD'), :genero, :departamento, :direccion,
          TO_DATE(:fecha_ingreso, 'YYYY-MM-DD'), :correo, :clave, :tipo_usuario
        );
      END;
    `, {
      num_identificacion, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
      fecha_nacimiento, genero, departamento, direccion, fecha_ingreso,
      correo, clave, tipo_usuario
    });

    res.status(200).json({ message: 'Usuario registrado exitosamente.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar el usuario.' });
  } finally {
    if (connection) await connection.close();
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { correo, clave } = req.body;
  let connection;
  console.log(correo, clave);

  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(`
        SELECT 
        usuario.num_identificacion, usuario.primer_nombre,
        CASE
            WHEN profesor.num_identificacion IS NOT NULL THEN 'PROFESOR'
            ELSE 'ALUMNO'
        END AS tipo_usuario
      FROM usuario
      LEFT JOIN profesor ON usuario.num_identificacion = profesor.num_identificacion
      LEFT JOIN alumno ON usuario.num_identificacion = alumno.num_identificacion
      WHERE correo = :correo AND clave = :clave
    `, { correo, clave }, { outFormat: oracledb.OUT_FORMAT_OBJECT });

    if (result.rows.length > 0) {
      res.status(200).json({ user: result.rows[0] });
    } else {
      res.status(401).json({ error: 'Credenciales inválidas.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al iniciar sesión.' });
  } finally {
    if (connection) await connection.close();
  }
});

app.listen(3000, () => {
  console.log('Servidor backend corriendo en http://localhost:3000');
});
