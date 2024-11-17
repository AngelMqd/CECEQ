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
// Base path para almacenar archivos
const mediaBasePath = path.join('C:/Users/100097567/Documents/CECEQ/media');
app.use('/media/photos', express.static(path.join('C:/Users/100097567/Documents/CECEQ/media/photos')));

// Servir archivos estáticos
app.use('/uploads/photos', express.static(path.join(mediaBasePath, 'photos')));
app.use('/uploads/address', express.static(path.join(mediaBasePath, 'address')));
app.use('/uploads/card', express.static(path.join(mediaBasePath, 'card')));

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

app.get('/api/user-avatar/:id', (req, res) => {
  const userId = req.params.id;
  const query = `
    SELECT mp.photo FROM auth_user au
    JOIN main_persona mp ON au.main_persona_id = mp.id
    WHERE au.id = ?
  `;

  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error('Error al obtener el avatar:', error);
      return res.status(500).json({ error: 'Error al obtener el avatar' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ avatarUrl: results[0].photo });
  });
});
// Ruta para obtener todas las personas
app.get('/api/personas', (req, res) => {
  const query = `
    SELECT * FROM main_persona 
    WHERE status = 0 
    ORDER BY created_at DESC
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener los datos:', err);
      return res.status(500).json({ error: 'Error al obtener los datos de la base de datos' });
    }
    res.json(results);
  });
});

// Ruta para obtener una persona por ID
app.get('/api/personas/:id', (req, res) => {
  const personId = req.params.id;
  const query = `
    SELECT id, folio, photo, name, surname, birth_date, gender, civil_status, 
           address, estate, \`foreign\`, phone, occupation, last_studies, 
           created_at, updated_at, status
    FROM main_persona
    WHERE id = ?
  `;

  db.query(query, [personId], (error, results) => {
    if (error) {
      console.error('Error al obtener los datos de la base de datos:', error);
      return res.status(500).json({ error: 'Error al obtener los datos de la base de datos' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }
    res.json(results[0]);
  });
});

// Configuración de almacenamiento de archivos con Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const filePathMap = {
      'photo': path.join(mediaBasePath, 'photos'),
      'address_proof': path.join(mediaBasePath, 'address'),
      'id_card': path.join(mediaBasePath, 'card'),
    };
    const filePath = filePathMap[file.fieldname];
    fs.mkdir(filePath, { recursive: true }, (err) => {
      if (err && err.code !== 'EEXIST') {
        console.error('Error al crear el directorio:', err);
        return cb(err);
      }
      cb(null, filePath);
    });
  },
  filename: (req, file, cb) => {
    const { name, surname } = req.body;
    const fileExtension = path.extname(file.originalname);
    cb(null, `${name}_${surname}_${Date.now()}${fileExtension}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10485760 }, // 10 MB
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'photo' && !file.mimetype.startsWith('image/')) {
      return cb(new Error('Tipo de archivo no válido para foto'));
    }
    if (['address_proof', 'id_card'].includes(file.fieldname) && file.mimetype !== 'application/pdf') {
      return cb(new Error('Solo se aceptan PDFs para el comprobante de domicilio y la identificación'));
    }
    cb(null, true);
  }
});

// Ruta para crear una nueva persona
app.post('/api/crud', upload.fields([
  { name: 'photo' },
  { name: 'address_proof' },
  { name: 'id_card' }
]), (req, res) => {
  const currentDate = new Date();
  const photoUrl = req.files['photo'] ? `/uploads/photos/${req.files['photo'][0].filename}` : null;
  const addressProofUrl = req.files['address_proof'] ? `/uploads/address/${req.files['address_proof'][0].filename}` : null;
  const idCardUrl = req.files['id_card'] ? `/uploads/card/${req.files['id_card'][0].filename}` : null;

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
    req.body.phone, req.body.occupation, req.body.last_studies, photoUrl,
    addressProofUrl, idCardUrl, currentDate, currentDate, 0
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al insertar los datos:', err);
      return res.status(500).json({ error: 'Error al insertar los datos en la base de datos' });
    }
    res.status(200).json({ message: 'Persona registrada exitosamente', id: result.insertId });
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
        assistence.main_persona_id, 
        assistence.created_at, 
        assistence.exit_time
      FROM assistence
      INNER JOIN (
        SELECT 
          main_persona_id, 
          MAX(created_at) AS max_created_at
        FROM assistence
        WHERE DATE(created_at) = CURDATE()
        GROUP BY main_persona_id
      ) recent ON assistence.main_persona_id = recent.main_persona_id 
               AND assistence.created_at = recent.max_created_at
    ) a ON mp.id = a.main_persona_id
    ORDER BY a.created_at DESC;
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

// Reinicio diario de la tabla de asistencias a las 23:59
cron.schedule('59 23 * * *', () => {
  const truncateTableQuery = `TRUNCATE TABLE assistence`;
  db.query(truncateTableQuery, (err) => {
    if (err) {
      console.error('Error al reiniciar la tabla de asistencias:', err);
    } else {
      console.log('Tabla de asistencias reiniciada correctamente');
    }
  });
});

// Inicialización del servidor
app.listen(3001, () => {
  console.log('Servidor corriendo en el puerto 3001');
});