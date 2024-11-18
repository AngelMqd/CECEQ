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
app.use((req, res, next) => {
  console.log(`Solicitud recibida: ${req.method} ${req.url}`);
  next(); // Asegura que se pase al siguiente middleware o ruta
});

// Ruta de ejemplo para obtener las áreas
app.get('/api/areas', (req, res) => {
  const query = 'SELECT id, area_name, abbreviation FROM areas';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener las áreas:', err); // Agrega este mensaje para depuración
      return res.status(500).json({ error: 'Error al obtener las áreas de la base de datos' });
    }
    res.json(results);
  });
});

// Configuración de Multer para almacenar archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10485760 }, // Límite de 10 MB
  fileFilter: (req, file, cb) => {
    const validMimeTypes = {
      photo: ['image/jpeg', 'image/png', 'image/jpg'],
      address_proof: ['application/pdf'],
      id_card: ['application/pdf']
    };

    if (!validMimeTypes[file.fieldname]?.includes(file.mimetype)) {
      return cb(new Error(`Tipo de archivo no válido para ${file.fieldname}`));
    }
    cb(null, true);
  }
});;
app.get('/api/last-folio/:abbreviation', (req, res) => {
  const { abbreviation } = req.params;
  const query = `
    SELECT MAX(CAST(SUBSTRING(folio, LENGTH(folio) - 3 + 1) AS UNSIGNED)) AS lastFolioNumber
    FROM main_persona;
  `;


  db.query(query, [abbreviation, abbreviation], (err, results) => {
    if (err) {
      console.error('Error fetching last folio number:', err);
      return res.status(500).json({ error: 'Error fetching last folio number' });
    }

    // Validar que haya resultados
    const lastFolioNumber = results[0]?.lastFolioNumber || 0;
    res.json({ lastFolioNumber });
  });
});


// Create person endpoint - updated to match new schema
app.post(
  '/api/crud',
  upload.fields([{ name: 'photo' }, { name: 'address_proof' }, { name: 'id_card' }]),
  (req, res) => {
    const {
      folio,
      name,
      surname,
      birth_date,
      gender,
      civil_status,
      address,
      estate,
      foreign: isForeign,
      phone,
      occupation,
      last_studies,
      area_id
    } = req.body;

    const photo = req.files['photo'] ? req.files['photo'][0].buffer : null;
    const addressProof = req.files['address_proof'] ? req.files['address_proof'][0].buffer : null;
    const idCard = req.files['id_card'] ? req.files['id_card'][0].buffer : null;

    // Validate required fields
    if (!folio || !name || !surname || !birth_date || !gender || !civil_status || !address || !phone || !area_id) {
      return res.status(400).json({ error: 'All required fields must be completed.' });
    }

    // Check if the folio already exists
    const checkFolioQuery = 'SELECT COUNT(*) AS count FROM main_persona WHERE folio = ?';

    db.query(checkFolioQuery, [folio], (err, results) => {
      if (err) {
        console.error('Error checking folio:', err);
        return res.status(500).json({ error: 'Error checking folio' });
      }

      const folioExists = results[0].count > 0;
      if (folioExists) {
        return res.status(400).json({ error: 'The folio already exists.' });
      }

      // Proceed with the insertion if the folio doesn't exist
      const insertQuery = `
        INSERT INTO main_persona (
          folio, name, surname, birth_date, gender, civil_status, address, estate,
          \`foreign\`, phone, occupation, last_studies, photo, address_proof, id_card, 
          created_at, updated_at, areas_id, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, 0)
      `;

      db.query(
        insertQuery,
        [
          folio,
          name,
          surname,
          birth_date,
          gender,
          civil_status,
          address,
          estate,
          isForeign || 0,
          phone,
          occupation,
          last_studies,
          photo,
          addressProof,
          idCard,
          area_id
        ],
        (err) => {
          if (err) {
            console.error('Error saving to database:', err);
            return res.status(500).json({ error: 'Error saving to database' });
          }
          res.json({ message: 'Person registered successfully' });
        }
      );
    });
  }
);


// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: 'File processing error: ' + err.message });
  }
  if (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error occurred' });
  }
  next();
});
// Ruta para obtener todas las personas y sus fotos/documentos
app.get('/api/personas', (req, res) => {
  const query = `
    SELECT id, folio, photo, name, surname, birth_date, gender, civil_status, 
           address, estate, \`foreign\`, phone, occupation, last_studies, 
           address_proof, id_card, created_at, updated_at, status
    FROM main_persona
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener los datos de la base de datos:', err);
      return res.status(500).json({ error: 'Error al obtener los datos de la base de datos' });
    }

    // Convierte las fotos y documentos en Base64
    const processedResults = results.map((person) => ({
      ...person,
      photo: person.photo ? person.photo.toString('base64') : null,
      address_proof: person.address_proof ? person.address_proof.toString('base64') : null,
      id_card: person.id_card ? person.id_card.toString('base64') : null,
    }));

    res.json(processedResults);
  });
});


app.get('/api/user-avatar/:id', (req, res) => {
  const userId = req.params.id;

  const query = `
    SELECT mp.photo
    FROM auth_user au
    JOIN main_persona mp ON au.main_persona_id = mp.id
    WHERE au.id = ?
  `;

  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error('Error en la consulta:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    if (results.length > 0 && results[0].photo) {
      const photoBase64 = `data:image/jpeg;base64,${results[0].photo.toString('base64')}`;
      res.json({ avatar: photoBase64 });
    } else {
      res.status(404).json({ message: 'Foto no encontrada' });
    }
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