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

// Inicialización del servidor
app.listen(3001, () => {
  console.log('Servidor corriendo en el puerto 3001');
});

// Ruta para registrar la entrada
app.post('/api/assistence/entrada/:folio', (req, res) => {
  const folio = req.params.folio;
  const currentDate = new Date();
  const currentDateString = currentDate.toISOString().split('T')[0]; // Fecha en formato YYYY-MM-DD

  // Buscar la persona por folio
  const findPersonQuery = `SELECT id FROM main_persona WHERE folio = ?`;
  db.query(findPersonQuery, [folio], (err, personResults) => {
    if (err || personResults.length === 0) {
      console.error('Error encontrando persona o folio no existente:', err);
      return res.status(404).json({ error: 'Folio no encontrado' });
    }
    const personId = personResults[0].id;

    // Verificar si ya existe una entrada para este usuario hoy
    const checkEntryQuery = `
      SELECT id FROM assistence 
      WHERE main_persona_id = ? AND DATE(created_at) = ?
    `;
    db.query(checkEntryQuery, [personId, currentDateString], (err, assistResults) => {
      if (err) {
        console.error('Error al verificar entrada:', err);
        return res.status(500).json({ error: 'Error en el servidor' });
      }

      // Si ya existe una entrada para hoy, no se agrega otra
      if (assistResults.length > 0) {
        return res.status(409).json({ message: 'Ya se ha registrado una entrada hoy' });
      }

      // Insertar nueva entrada de asistencia
      const insertEntryQuery = `
        INSERT INTO assistence (main_persona_id, created_at)
        VALUES (?, ?)
      `;
      db.query(insertEntryQuery, [personId, currentDate], (err, insertResults) => {
        if (err) {
          console.error('Error registrando entrada:', err);
          return res.status(500).json({ error: 'Error registrando entrada' });
        }
        res.status(200).json({ message: 'Entrada registrada correctamente', assistenceId: insertResults.insertId });
      });
    });
  });
});

// Ruta para registrar la salida
app.put('/api/assistence/salida/:id', (req, res) => {
  const main_persona_id = req.params.id;
  const currentDate = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD

  // Verificar si existe una entrada hoy para esta persona
  const findEntryQuery = `
    SELECT id FROM assistence 
    WHERE main_persona_id = ? AND DATE(created_at) = ? AND exit_time IS NULL
  `;

  db.query(findEntryQuery, [main_persona_id, currentDate], (error, results) => {
    if (error) {
      console.error('Error verificando entrada:', error);
      return res.status(500).json({ error: 'Error verificando entrada' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'No hay registros de entrada para hoy o ya se registró una salida' });
    }

    const assistenceId = results[0].id;
    const exitTime = new Date().toISOString().slice(0, 19).replace('T', ' '); // Formato 'YYYY-MM-DD HH:MM:SS'

    // Actualizar el registro con la hora de salida
    const updateExitQuery = `
      UPDATE assistence SET exit_time = ? WHERE id = ?
    `;

    db.query(updateExitQuery, [exitTime, assistenceId], (error) => {
      if (error) {
        console.error('Error registrando salida:', error);
        return res.status(500).json({ error: 'Error registrando salida' });
      }
      res.status(200).json({ message: 'Salida registrada correctamente', assistenceId });
    });
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
// Ruta para obtener asistencias de un día específico
app.get('/api/assistence/dia/:date', (req, res) => {
  const date = req.params.date;
  const query = `
    SELECT * FROM assistence 
    WHERE DATE(created_at) = ?
  `;
  db.query(query, [date], (error, results) => {
    if (error) {
      console.error('Error obteniendo asistencias por día:', error);
      return res.status(500).json({ error: 'Error al obtener asistencias por día' });
    }
    res.json(results);
  });
});

// Ruta para obtener asistencias de un mes específico
app.get('/api/assistence/mes/:year/:month', (req, res) => {
  const { year, month } = req.params;
  const query = `
    SELECT * FROM assistence 
    WHERE YEAR(created_at) = ? AND MONTH(created_at) = ?
  `;
  db.query(query, [year, month], (error, results) => {
    if (error) {
      console.error('Error obteniendo asistencias por mes:', error);
      return res.status(500).json({ error: 'Error al obtener asistencias por mes' });
    }
    res.json(results);
  });
});

// Ruta para obtener asistencias de un año específico
app.get('/api/assistence/ano/:year', (req, res) => {
  const year = req.params.year;
  const query = `
    SELECT * FROM assistence 
    WHERE YEAR(created_at) = ?
  `;
  db.query(query, [year], (error, results) => {
    if (error) {
      console.error('Error obteniendo asistencias por año:', error);
      return res.status(500).json({ error: 'Error al obtener asistencias por año' });
    }
    res.json(results);
  });
});

// Ruta para obtener inasistencias (dependiendo de cómo estén marcadas)
app.get('/api/inasistencias', (req, res) => {
  const query = `
    SELECT * FROM main_persona 
    WHERE id NOT IN (SELECT main_persona_id FROM assistence)
  `;
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error obteniendo inasistencias:', error);
      return res.status(500).json({ error: 'Error al obtener inasistencias' });
    }
    res.json(results);
  });
});
