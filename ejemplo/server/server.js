const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const bcrypt = require('bcrypt'); // Asegúrate de instalar bcrypt usando npm
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
const cron = require('node-cron');
cron.schedule('59 23 * * *', () => {
  console.log('Cron job ejecutado a las 23:59');
 
});

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'angel820',
  database: 'ceceq'
});

db.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err.stack);
    return;
  }
  console.log('Conectado a la base de datos');
});


// Ruta de autenticación (login)
app.post('/api/login', (req, res) => {
  const { usuario, password } = req.body;
  const query = 'SELECT * FROM auth_user WHERE username = ?';
  db.query(query, [usuario], async (err, results) => {
    if (err) {
      console.error('Error en la consulta de usuario:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    if (results.length > 0) {
      const user = results[0];
      console.log('Usuario encontrado:', user);

      try {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          res.status(200).json({
            message: 'Inicio de sesión exitoso',
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
            },
          });
        } else {
          console.error('Contraseña incorrecta');
          res.status(401).json({ error: 'Contraseña incorrecta' });
        }
      } catch (compareError) {
        console.error('Error en la comparación de contraseña:', compareError);
        res.status(500).json({ error: 'Error en la verificación de la contraseña' });
      }
    } else {
      console.error('Usuario no encontrado');
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  });
});


// Configuración de Multer para recibir archivos sin guardarlos en el sistema de archivos
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10485760 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const validMimeTypes = {
      photo: ['image/jpeg', 'image/png', 'image/jpg'],
      address_proof: ['application/pdf'],
      id_card: ['application/pdf']
    };

    if (validMimeTypes[file.fieldname] && !validMimeTypes[file.fieldname].includes(file.mimetype)) {
      return cb(new Error(`Tipo de archivo no válido para ${file.fieldname}`));
    }
    cb(null, true);
  }
});

// Ruta para crear una nueva persona con foto y documentos en la base de datos
app.post('/api/crud', upload.fields([
  { name: 'photo' },
  { name: 'address_proof' },
  { name: 'id_card' }
]), (req, res) => {
  const currentDate = new Date();

  const photo = req.files['photo'] ? req.files['photo'][0].buffer : null;
  const addressProof = req.files['address_proof'] ? req.files['address_proof'][0].buffer : null;
  const idCard = req.files['id_card'] ? req.files['id_card'][0].buffer : null;

  const query = `
    INSERT INTO main_persona (
      folio, name, surname, birth_date, gender, civil_status, 
      address, estate, \`foreign\`, phone, occupation, last_studies,
      photo, address_proof, id_card, created_at, updated_at, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    req.body.folio, req.body.name, req.body.surname, req.body.birth_date, req.body.gender,
    req.body.civil_status, req.body.address, req.body.estate, req.body.foreign,
    req.body.phone, req.body.occupation, req.body.last_studies, photo,
    addressProof, idCard, currentDate, currentDate, 0
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al insertar los datos:', err);
      return res.status(500).json({ error: 'Error al insertar los datos en la base de datos' });
    }
    res.status(200).json({ message: 'Persona registrada exitosamente', id: result.insertId });
  });
});

// Ruta para obtener una persona y su foto/documentos
app.get('/api/personas/:id', (req, res) => {
  const personId = req.params.id;
  const query = `
    SELECT id, folio, photo, name, surname, birth_date, gender, civil_status, 
           address, estate, \`foreign\`, phone, occupation, last_studies, 
           address_proof, id_card, created_at, updated_at, status
    FROM main_persona
    WHERE id = ?
  `;

  db.query(query, [personId], (err, results) => {
    if (err) {
      console.error('Error al obtener los datos de la base de datos:', err);
      return res.status(500).json({ error: 'Error al obtener los datos de la base de datos' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }

    const person = results[0];

    // Convierte datos binarios a Base64 para enviarlos en la respuesta
    person.photo = person.photo ? person.photo.toString('base64') : null;
    person.address_proof = person.address_proof ? person.address_proof.toString('base64') : null;
    person.id_card = person.id_card ? person.id_card.toString('base64') : null;

    res.json(person);
  });
});

app.get('/api/user-avatar/:id', (req, res) => {
  const userId = req.params.id;

  // Consulta para obtener la foto desde main_persona usando el main_persona_id relacionado
  const query = `
    SELECT mp.photo 
    FROM auth_user au
    INNER JOIN main_persona mp ON au.main_persona_id = mp.id
    WHERE au.id = ?
  `;

  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error('Error al obtener la foto:', error);
      return res.status(500).json({ error: 'Error al obtener la foto del usuario' });
    }

    if (results.length === 0 || !results[0].photo) {
      return res.status(404).json({ error: 'Foto no encontrada' });
    }

    // Devuelve la foto como base64
    const photo = results[0].photo.toString('base64');
    res.json({ avatar: `data:image/jpeg;base64,${photo}` });
  });
});













app.get('/api/assistence', (req, res) => {
  const query = `
    SELECT 
      mp.id AS main_persona_id, 
      mp.folio, 
      mp.photo, 
      mp.name, 
      mp.surname, 
      mp.phone, 
      mp.status, 
      a.created_at AS hora_entrada, 
      a.exit_time AS hora_salida
    FROM main_persona mp
    LEFT JOIN (
      SELECT 
        main_persona_id, 
        MAX(id) AS last_assistence_id
      FROM assistence
      GROUP BY main_persona_id
    ) la ON mp.id = la.main_persona_id
    LEFT JOIN assistence a ON la.last_assistence_id = a.id
    ORDER BY mp.id;
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error obteniendo asistencias:', error);
      return res.status(500).json({ error: 'Error al obtener asistencias' });
    }
    res.json(results);
  });
});


// Ruta para registrar entrada
app.post('/api/assistence/entrada/:id', (req, res) => {
  const main_persona_id = req.params.id;
  const currentDate = new Date();

  // Verifica si ya existe un registro de entrada sin salida
  const findQuery = `
    SELECT * FROM assistence 
    WHERE main_persona_id = ? AND exit_time IS NULL
  `;

  db.query(findQuery, [main_persona_id], (err, results) => {
    if (err) {
      console.error('Error al verificar entrada:', err);
      return res.status(500).json({ error: 'Error al verificar entrada' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'El usuario ya tiene una entrada registrada sin salida.' });
    }

    // Inserta un nuevo registro de entrada
    const insertQuery = `
      INSERT INTO assistence (created_at, exit_time, section_event, main_persona_id) 
      VALUES (?, NULL, NULL, ?)
    `;

    db.query(insertQuery, [currentDate, main_persona_id], (err) => {
      if (err) {
        console.error('Error al registrar entrada:', err);
        return res.status(500).json({ error: 'Error al registrar entrada' });
      }

      res.status(200).json({ message: 'Entrada registrada correctamente.' });
    });
  });
});

app.put('/api/assistence/salida/:id', (req, res) => {
  const main_persona_id = req.params.id;
  const currentDate = new Date();

  // Busca la última entrada sin salida registrada para este usuario
  const findQuery = `
    SELECT * FROM assistence 
    WHERE main_persona_id = ? AND exit_time IS NULL
    ORDER BY created_at DESC
    LIMIT 1
  `;

  db.query(findQuery, [main_persona_id], (err, results) => {
    if (err) {
      console.error('Error al verificar salida:', err);
      return res.status(500).json({ error: 'Error al verificar salida' });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: 'No hay entradas registradas sin salida para este usuario.' });
    }

    const assistenceId = results[0].id;

    // Actualiza el registro con la hora de salida
    const updateQuery = `
      UPDATE assistence 
      SET exit_time = ? 
      WHERE id = ?
    `;

    db.query(updateQuery, [currentDate, assistenceId], (err) => {
      if (err) {
        console.error('Error al registrar salida:', err);
        return res.status(500).json({ error: 'Error al registrar salida' });
      }

      res.status(200).json({ message: 'Salida registrada correctamente.' });
    });
  });
});



// Ruta para obtener entradas sin salida
app.get('/api/assistence/entradasSinSalida', (req, res) => {
  const query = `
    SELECT mp.id, mp.folio, mp.name, mp.surname, mp.phone, mp.status, a.created_at AS hora_entrada
    FROM main_persona mp
    JOIN assistence a ON mp.id = a.main_persona_id
    WHERE a.exit_time IS NULL
    ORDER BY a.created_at DESC
  `;
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error obteniendo entradas sin salida:', error);
      return res.status(500).json({ error: 'Error al obtener entradas sin salida' });
    }
    res.json(results);
  });
});



// Inicialización del servidor
app.listen(3001, () => {
  console.log('Servidor corriendo en el puerto 3001');
});