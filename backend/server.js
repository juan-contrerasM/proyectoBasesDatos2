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
  user: 'db2admin',
  password: 'admin',
  connectionString: 'localhost:1521/xe' 
};

// Registro de usuario (profesor o alumno)
app.post('/api/registro', async (req, res) => {
  const {
    num_identificacion, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
    fecha_nacimiento, genero, departamento, direccion, fecha_ingreso,
    correo, clave, tipo_usuario, tipo_contrato, nivel_estudios, programa_academico
  } = req.body;

  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(`
      BEGIN
        crear_usuario(
          :num_identificacion, :primer_nombre, :segundo_nombre, :primer_apellido, :segundo_apellido,
          TO_DATE(:fecha_nacimiento, 'YYYY-MM-DD'), :genero, :departamento, :direccion,
          TO_DATE(:fecha_ingreso, 'YYYY-MM-DD'), :correo, :clave, :tipo_usuario, :tipo_contrato, :nivel_estudios, :programa_academico
        );
      END;
    `, {
      num_identificacion, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
      fecha_nacimiento, genero, departamento, direccion, fecha_ingreso,
      correo, clave, tipo_usuario, tipo_contrato, nivel_estudios, programa_academico
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


// CREAR PREGUNTA
app.post('/api/pregunta', async (req, res) => {
  let connection;

  try {
    const { pregunta, respuestas } = req.body;

    connection = await oracledb.getConnection(dbConfig);

    // 1. Crear la pregunta y obtener el ID generado
    const result = await connection.execute(
      `
      BEGIN
        CREAR_PREGUNTA(
          :porcentaje,
          :numero_respuestas,
          :tiempo_respuesta,
          :requiereRevision,
          :esPublica,
          :contenido,
          :justificacion,
          :estado,
          :tema_id_tema,
          :tipo_dificultad_id_dificultad,
          :tipo_pregunta_id_tipo_pregunta,
          :p_id_generado
        );
      END;
      `,
      {
        porcentaje: pregunta.porcentaje,
        numero_respuestas: pregunta.numero_respuestas,
        tiempo_respuesta: pregunta.tiempo_respuesta,
        requiereRevision: pregunta.requiereRevision,
        esPublica: pregunta.esPublica,
        contenido: pregunta.contenido,
        justificacion: pregunta.justificacion,
        estado: pregunta.estado,
        tema_id_tema: pregunta.tema_id_tema,
        tipo_dificultad_id_dificultad: pregunta.tipo_dificultad_id_dificultad,
        tipo_pregunta_id_tipo_pregunta: pregunta.tipo_pregunta_id_tipo_pregunta,
        p_id_generado: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: true }
    );

    const idPregunta = result.outBinds.p_id_generado;

    console.log(respuestas + 'kkkkkkk');

    // 2. Insertar respuestas asociadas a esa pregunta
    for (const r of respuestas) {
      console.log(r);
      await connection.execute(
        `
        BEGIN
          INSERTAR_RESPUESTA(
            :id_pregunta,
            :contenido,
            :es_correcta
          );
        END;
        `,
        {
          id_pregunta: idPregunta,
          contenido: r.contenido,
          es_correcta: r.es_correcta
        },
        { autoCommit: true }
      );
    }

    res.status(201).json({ message: 'Pregunta y respuestas registradas correctamente' });

  } catch (err) {
    console.error('Error al registrar pregunta/respuestas:', err);
    res.status(500).json({ error: 'Error al registrar la pregunta y sus respuestas' });
  } finally {
    if (connection) await connection.close();
  }
});



// VER PREGUNTAS

app.get('/api/preguntas', async (req, res) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT 
         p.ID_PREGUNTA,
         TO_CHAR(p.CONTENIDO) AS CONTENIDO,
         TO_CHAR(p.JUSTIFICACION) AS JUSTIFICACION,
         p.PORCENTAJE,
         p.NUMERO_RESPUESTAS,
         p.TIEMPO_RESPUESTA,
         p.REQUIEREREVISION,
         p.ESPUBLICA,
         d.NOMBRE AS DIFICULTAD,
         t.NOMBRE AS TEMA,
         tp.NOMBRE AS TIPO_PREGUNTA,
         r.texto AS RESPUESTA

       FROM 
         PREGUNTA p
       LEFT JOIN TIPO_DIFICULTAD d ON p.TIPO_DIFICULTAD_ID_DIFICULTAD = d.ID_DIFICULTAD
       LEFT JOIN TEMA t ON p.TEMA_ID_TEMA = t.ID_TEMA
       LEFT JOIN TIPO_PREGUNTA tp ON p.TIPO_PREGUNTA_ID_TIPO_PREGUNTA = tp.ID_TIPO_PREGUNTA
       LEFT JOIN RESPUESTA r ON p.ID_PREGUNTA = r.id_pregunta
       WHERE 
         p.ESTADO = 1
       ORDER BY 
         p.ID_PREGUNTA`,
      {},
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener preguntas:', err);
    res.status(500).json({ error: 'Error al obtener preguntas' });
  } finally {
    if (connection) await connection.close();
  }
});



// CREAR QUIZ

app.post('/api/quiz', async (req, res) => {
  const {
    nombre, descripcion, curso_id, profesor_id, config_id, categoria_id
  } = req.body;

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(`
      BEGIN
        crear_quiz(
          :nombre,
          :descripcion,
          :curso_id,
          :profesor_id,
          :config_id,
          :categoria_id
        );
      END;
    `, {
      nombre, descripcion,
      curso_id_curso: curso_id,
      profesor_id,
      config_id,
      categoria_id
    });

    res.status(200).json({ message: 'Quiz creado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear quiz' });
  } finally {
    if (connection) await connection.close();
  }
});


// VER QUIZ

app.get('/api/quizzes', async (req, res) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(`SELECT * FROM quiz`, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT
    });

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener quizzes' });
  } finally {
    if (connection) await connection.close();
  }
});

app.get('/api/dificultad', async (req, res) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(`SELECT * FROM tipo_dificultad`, {}, {
      outFormat: oracledb.OUT_FORMAT_OBJECT
    });

    res.json(result.rows);
    console.log(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los registros de dificultad' });
  } finally {
    if (connection) await connection.close();
  }

});

app.get('/api/tipospregunta', async (req, res) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(`SELECT * FROM tipo_pregunta`, {}, {
      outFormat: oracledb.OUT_FORMAT_OBJECT
    });

    res.json(result.rows);
    console.log(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los tipos de pregunta' });
  } finally {
    if (connection) await connection.close();
  }

});

app.get('/api/temas', async (req, res) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(`SELECT * FROM TEMA`, {}, {
      outFormat: oracledb.OUT_FORMAT_OBJECT
    });

    res.json(result.rows);
    console.log(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los temas' });
  } finally {
    if (connection) await connection.close();
  }

});


app.get('/api/categorias', async (req, res) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(`SELECT * FROM CATEGORIA`, {}, {
      outFormat: oracledb.OUT_FORMAT_OBJECT
    });

    res.json(result.rows);
    console.log(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener las categorias.' });
  } finally {
    if (connection) await connection.close();
  }

});

app.get('/api/preguntas/tema/:temaId', async (req, res) => {
  const temaId = req.params.temaId;

  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `
   SELECT 
  p.id_pregunta,
  p.contenido,
  p.justificacion,
  p.numero_respuestas,
  p.porcentaje,
  p.requiereRevision,
  p.tiempo_respuesta,
  p.espublica,
  p.estado,
  p.tema_id_tema,
  p.tipo_dificultad_id_dificultad,
  p.tipo_pregunta_id_tipo_pregunta,
  '[' || LISTAGG(
    'respuesta:' || r.texto || ',es_correcta:' || 
    CASE r.es_correcta WHEN 1 THEN 'true' ELSE 'false' END,
    '; '
  ) WITHIN GROUP (ORDER BY r.id_respuesta) || ']' AS respuestas_json
FROM pregunta p
JOIN banco_pregunta_pregunta bp ON bp.pregunta_id = p.id_pregunta
LEFT JOIN respuesta r ON r.id_pregunta = p.id_pregunta
WHERE p.tema_id_tema = :temaId
GROUP BY 
  p.id_pregunta, p.contenido, p.justificacion, p.numero_respuestas,
  p.porcentaje, p.requiereRevision, p.tiempo_respuesta,
  p.espublica, p.estado, p.tema_id_tema,
  p.tipo_dificultad_id_dificultad, p.tipo_pregunta_id_tipo_pregunta


      `,
      { temaId: Number(temaId) },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener preguntas por tema:', err);
    res.status(500).json({ error: 'Error al obtener preguntas por tema.' });
  } finally {
    if (connection) await connection.close();
  }
});



app.get('/api/cursos', async (req, res) => {
  const profesorId = req.query.profesor;

  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);
    console.log('Profesor ID:', profesorId);

    const result = await connection.execute(
      `SELECT * FROM CURSO WHERE profesor_num_identificacion = :profesor_id`,
      { profesor_id: profesorId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener los cursos del profesor:', err);
    res.status(500).json({ error: 'Error al obtener los cursos.' });
  } finally {
    if (connection) await connection.close();
  }
});
