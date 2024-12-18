const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const bcrypt = require('bcrypt'); 
const app = express();
const cron = require('node-cron');



app.use(cors());
app.use(express.json());

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
      area_id,
      tutor1_name,
      tutor1_relationship,
      tutor1_phone,
      tutor2_name,
      tutor2_relationship,
      tutor2_phone,
      disability_type,
      disability_description,
    } = req.body;

    const photo = req.files['photo'] ? req.files['photo'][0].buffer : null;
    const addressProof = req.files['address_proof'] ? req.files['address_proof'][0].buffer : null;
    const idCard = req.files['id_card'] ? req.files['id_card'][0].buffer : null;

    // Validar campos requeridos
    if (!folio || !name || !surname || !birth_date || !gender || !civil_status || !address || !phone || !area_id) {
      return res.status(400).json({ error: 'All required fields must be completed.' });
    }

    // Calcular is_minor basado en birth_date
    const birthDate = new Date(birth_date);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    const isMinor = currentDate < new Date(birthDate.setFullYear(birthDate.getFullYear() + age)) ? age < 18 : age <= 18;

    // Verificar si el folio ya existe
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

      // Insertar en main_persona
      const insertQuery = `
        INSERT INTO main_persona (
          folio, name, surname, birth_date, gender, civil_status, address, estate,
          \`foreign\`, phone, occupation, last_studies, photo, address_proof, id_card,
          created_at, updated_at, areas_id, status, is_minor, is_disabled
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, 0, ?, ?)
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
          area_id,
          isMinor ? 1 : 0,
          disability_type ? 1 : 0, // Si hay discapacidad, marcar como 1
        ],
        (err, result) => {
          if (err) {
            console.error('Error saving to database:', err);
            return res.status(500).json({ error: 'Error saving to database' });
          }

          const mainPersonaId = result.insertId;

          // Insertar en tutors si isMinor es 1
          if (isMinor) {
            const tutor1InsertQuery = `
              INSERT INTO tutors (name, relationship, phone, main_persona_id)
              VALUES (?, ?, ?, ?)
            `;
            db.query(tutor1InsertQuery, [tutor1_name, tutor1_relationship, tutor1_phone, mainPersonaId], (err) => {
              if (err) {
                console.error('Error saving first tutor:', err);
                return res.status(500).json({ error: 'Error saving first tutor' });
              }

              if (tutor2_name && tutor2_relationship && tutor2_phone) {
                const tutor2InsertQuery = `
                  INSERT INTO tutors (name, relationship, phone, main_persona_id)
                  VALUES (?, ?, ?, ?)
                `;
                db.query(tutor2InsertQuery, [tutor2_name, tutor2_relationship, tutor2_phone, mainPersonaId], (err) => {
                  if (err) {
                    console.error('Error saving second tutor:', err);
                    return res.status(500).json({ error: 'Error saving second tutor' });
                  }
                });
              }
            });
          }

          // Registrar discapacidad si aplica
          if (disability_type && disability_description) {
            const disabilityInsertQuery = `
              INSERT INTO disabilities (main_persona_id, disability_type, description, created_at, updated_at)
              VALUES (?, ?, ?, NOW(), NOW())
            `;
            db.query(
              disabilityInsertQuery,
              [mainPersonaId, disability_type, disability_description],
              (err) => {
                if (err) {
                  console.error('Error saving disability:', err);
                  return res.status(500).json({ error: 'Error saving disability' });
                }
              }
            );
          }

          res.json({ message: 'Person, tutors, and disability (if applicable) registered successfully' });
        }
      );
    });
  }
);









app.put(
  '/api/personas/:id',
  upload.fields([{ name: 'photo' }, { name: 'address_proof' }, { name: 'id_card' }]),
  async (req, res) => {
    const { id } = req.params;
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
      area_id,
      tutor1_name,
      tutor1_relationship,
      tutor1_phone,
      tutor2_name,
      tutor2_relationship,
      tutor2_phone,
      disability_type,
      disability_description,
    } = req.body;

    const photo = req.files['photo'] ? req.files['photo'][0].buffer : null;
    const addressProof = req.files['address_proof'] ? req.files['address_proof'][0].buffer : null;
    const idCard = req.files['id_card'] ? req.files['id_card'][0].buffer : null;

    // Validar campos requeridos
    if (!folio || !name || !surname || !birth_date || !gender || !civil_status || !address || !phone || !area_id) {
      return res.status(400).json({ error: 'Todos los campos requeridos deben ser completados.' });
    }

    // Calcular si es menor de edad
    const birthDate = new Date(birth_date);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    const isMinor = currentDate < new Date(birthDate.setFullYear(birthDate.getFullYear() + age)) ? age < 18 : age <= 18;

    const updateQuery = `
      UPDATE main_persona
      SET folio = ?, name = ?, surname = ?, birth_date = ?, gender = ?, civil_status = ?,
          address = ?, estate = ?, \`foreign\` = ?, phone = ?, occupation = ?, last_studies = ?,
          areas_id = ?, updated_at = NOW(), photo = ?, address_proof = ?, id_card = ?, is_minor = ?, is_disabled = ?
      WHERE id = ?
    `;

    const values = [
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
      area_id,
      photo,
      addressProof,
      idCard,
      isMinor ? 1 : 0,
      disability_type ? 1 : 0,
      id,
    ];

    try {
      // Actualizar persona
      await db.promise().query(updateQuery, values);

      // Actualizar tutores si es menor de edad
      if (isMinor) {
        await db.promise().query(`DELETE FROM tutors WHERE main_persona_id = ?`, [id]);

        const tutors = [];
        if (tutor1_name && tutor1_relationship && tutor1_phone) {
          tutors.push([tutor1_name, tutor1_relationship, tutor1_phone, id]);
        }

        if (tutor2_name && tutor2_relationship && tutor2_phone) {
          tutors.push([tutor2_name, tutor2_relationship, tutor2_phone, id]);
        }

        if (tutors.length > 0) {
          const insertTutorQuery = `
            INSERT INTO tutors (name, relationship, phone, main_persona_id)
            VALUES ?
          `;
          await db.promise().query(insertTutorQuery, [tutors]);
        }
      } else {
        // Si no es menor, eliminamos tutores asociados
        await db.promise().query(`DELETE FROM tutors WHERE main_persona_id = ?`, [id]);
      }

      // Actualizar discapacidad si aplica
      if (disability_type && disability_description) {
        await db.promise().query(`DELETE FROM disabilities WHERE main_persona_id = ?`, [id]);

        const insertDisabilityQuery = `
          INSERT INTO disabilities (main_persona_id, disability_type, description, created_at, updated_at)
          VALUES (?, ?, ?, NOW(), NOW())
        `;
        await db.promise().query(insertDisabilityQuery, [id, disability_type, disability_description]);
      } else {
        // Si no hay discapacidad, eliminamos registros existentes
        await db.promise().query(`DELETE FROM disabilities WHERE main_persona_id = ?`, [id]);
      }

      res.json({ message: 'Persona actualizada con éxito.' });
    } catch (err) {
      console.error('Error al actualizar:', err);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  }
);







app.post('/api/disabilities/update', async (req, res) => {
  const { main_persona_id, disability_type, description } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO disabilities (main_persona_id, disability_type, description)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE
       disability_type = VALUES(disability_type),
       description = VALUES(description)`,
      [main_persona_id, disability_type, description]
    );
    res.status(200).json({ message: 'Discapacidad actualizada correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar discapacidad.' });
  }
});


app.delete('/api/disabilities/:main_persona_id', async (req, res) => {
  const { main_persona_id } = req.params;

  try {
    await db.query(`DELETE FROM disabilities WHERE main_persona_id = ?`, [
      main_persona_id,
    ]);
    res.status(200).json({ message: 'Discapacidad eliminada correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar discapacidad.' });
  }
});

app.get('/api/tutors/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const tutors = await Tutor.findAll({ where: { main_persona_id: id } });

    if (!tutors || tutors.length === 0) {
      return res.status(200).json([]); // Devuelve un array vacío si no hay tutores
    }

    res.status(200).json(tutors);
  } catch (error) {
    console.error("Error fetching tutors:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




// Actualizar o crear tutores
app.post("/api/tutors/update", async (req, res) => {
  try {
    const tutors = req.body;
    for (const tutor of tutors) {
      const existingTutor = await db.query(
        "SELECT * FROM tutors WHERE main_persona_id = ? AND name = ?",
        [tutor.main_persona_id, tutor.name]
      );
      if (existingTutor.length > 0) {
        // Actualizar tutor existente
        await db.query(
          "UPDATE tutors SET relationship = ?, phone = ? WHERE id = ?",
          [tutor.relationship, tutor.phone, existingTutor[0].id]
        );
      } else {
        // Crear tutor nuevo
        await db.query("INSERT INTO tutors (name, relationship, phone, main_persona_id) VALUES (?, ?, ?, ?)", [
          tutor.name,
          tutor.relationship,
          tutor.phone,
          tutor.main_persona_id,
        ]);
      }
    }
    res.status(200).send({ message: "Tutors updated successfully" });
  } catch (error) {
    console.error("Error updating tutors:", error);
    res.status(500).send({ message: "Error updating tutors" });
  }
});



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

    // Procesa los resultados y convierte los archivos
    const processedResults = results.map((person) => {
      // Verifica si los datos son Buffer
      const addressProofBuffer = Buffer.isBuffer(person.address_proof) ? person.address_proof : null;
      const idCardBuffer = Buffer.isBuffer(person.id_card) ? person.id_card : null;

      // Calcula el tamaño en bytes
      const addressProofSize = addressProofBuffer ? addressProofBuffer.byteLength : null;
      const idCardSize = idCardBuffer ? idCardBuffer.byteLength : null;

      return {
        ...person,
        photo: person.photo ? person.photo.toString('base64') : null,
        address_proof: addressProofBuffer ? addressProofBuffer.toString('base64') : null,
        id_card: idCardBuffer ? idCardBuffer.toString('base64') : null,
        address_proof_size: addressProofSize, // Tamaño del archivo en bytes
        id_card_size: idCardSize,            // Tamaño del archivo en bytes
      };
    });

    res.json(processedResults);
  });
});








app.get('/api/personas/:id', (req, res) => {
  const { id } = req.params;

  const queryPersona = `
    SELECT id, folio, photo, name, surname, birth_date, gender, civil_status, 
           address, estate, \`foreign\`, phone, occupation, last_studies, 
           address_proof, id_card, created_at, updated_at, status, is_minor
    FROM main_persona
    WHERE id = ?
  `;

  const queryTutores = `
    SELECT name, relationship, phone 
    FROM tutors 
    WHERE main_persona_id = ?
  `;

  // Obtener datos de la persona
  db.query(queryPersona, [id], (err, personaResults) => {
    if (err) {
      console.error('Error al obtener el perfil:', err);
      return res.status(500).json({ error: 'Error al obtener el perfil' });
    }

    if (personaResults.length === 0) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    // Procesar datos de la persona
    const persona = {
      ...personaResults[0],
      photo: personaResults[0].photo ? personaResults[0].photo.toString('base64') : null,
      address_proof: personaResults[0].address_proof ? personaResults[0].address_proof.toString('base64') : null,
      id_card: personaResults[0].id_card ? personaResults[0].id_card.toString('base64') : null,
    };

    // Obtener tutores si es menor de edad
    if (persona.is_minor) {
      db.query(queryTutores, [id], (err, tutorResults) => {
        if (err) {
          console.error('Error al obtener tutores:', err);
          return res.status(500).json({ error: 'Error al obtener tutores' });
        }

        // Si no hay tutores, retornar un arreglo vacío
        persona.tutors = tutorResults.length > 0 ? tutorResults : [];
        return res.json(persona);
      });
    } else {
      // Si no es menor de edad, retornar la persona directamente
      persona.tutors = []; // Asegurarse de que siempre sea un arreglo
      return res.json(persona);
    }
  });
});






















app.post('/api/personas/:id/block', (req, res) => {
  const { id } = req.params;

  // Actualizar el estado de la persona en la base de datos
  const query = 'UPDATE main_persona SET status = 1 WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al bloquear el usuario:', err);
      return res.status(500).json({ error: 'Error al bloquear el usuario' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario bloqueado con éxito' });
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

    // Procesar los resultados para convertir las imágenes a Base64
    const processedResults = results.map((person) => ({
      ...person,
      photo: person.photo ? person.photo.toString('base64') : null, // Convertir foto a Base64
    }));

    res.json(processedResults);
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







app.get('/api/assistence/by-date/:date', (req, res) => {
  const selectedDate = req.params.date;

  const query = `
    SELECT 
      a.id, 
      a.created_at, 
      a.exit_time, 
      a.section_event, 
      a.main_persona_id, 
      mp.folio, 
      mp.name, 
      mp.surname, 
      mp.phone, 
      mp.photo 
    FROM assistence a
    JOIN main_persona mp ON a.main_persona_id = mp.id
    WHERE DATE(a.created_at) = ?
  `;

  db.query(query, [selectedDate], (error, results) => {
    if (error) {
      console.error('Error al obtener asistencias por fecha:', error);
      return res.status(500).json({ error: 'Error al obtener asistencias por fecha' });
    }

    res.json(results);
  });
});



app.get('/api/assistence/details', (req, res) => {
  const { date } = req.query;
  const startDate = `${date} 00:00:00`;
  const endDate = `${date} 23:59:59`;

  const query = `
    SELECT 
      mp.folio, mp.name, mp.surname, mp.phone, a.created_at AS hora_entrada, 
      a.exit_time AS hora_salida, a.section_event
    FROM assistence a
    JOIN main_persona mp ON a.main_persona_id = mp.id
    WHERE a.created_at BETWEEN ? AND ?
    ORDER BY a.created_at;
  `;

  db.query(query, [startDate, endDate], (error, results) => {
    if (error) {
      console.error('Error al obtener detalles:', error);
      return res.status(500).json({ error: 'Error al obtener detalles de asistencia' });
    }
    res.json(results);
  });
});





app.get('/api/assistence/date/:date', (req, res) => {
  const date = req.params.date; // Fecha recibida como parámetro
  const query = `
    SELECT 
        mp.folio, 
        mp.name, 
        mp.surname, 
        mp.phone, 
        a.created_at AS hora_entrada, 
        a.exit_time AS hora_salida, 
        a.section_event
    FROM 
        assistence a
    JOIN 
        main_persona mp ON mp.id = a.main_persona_id
    WHERE 
        DATE(a.created_at) = ?;
  `;

  db.query(query, [date], (err, results) => {
    if (err) {
      console.error('Error ejecutando la consulta:', err);
      return res.status(500).json({ error: 'Error ejecutando la consulta' });
    }
    res.json(results);
  });
});





// Endpoints
app.get('/api/areas', (req, res) => {
  const query = 'SELECT id, area_name, abbreviation FROM areas'; 
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener los grupos:', err);
      res.status(500).json({ error: 'Error al obtener los grupos' });
    } else {
      res.json(results);
    }
  });
});

app.post('/api/areas', (req, res) => {
  console.log('Datos recibidos en el backend:', req.body);

  const { area_name, abbreviation } = req.body;

  if (!area_name || !abbreviation) {
    console.error('Validación fallida:', { area_name, abbreviation });
    return res.status(400).json({ error: 'Nombre del grupo y abreviación son obligatorios' });
  }

  console.log('Validación exitosa:', { area_name, abbreviation });

  const query = 'INSERT INTO areas (area_name, abbreviation) VALUES (?, ?)';
  db.query(query, [area_name, abbreviation], (err, results) => {
    if (err) {
      console.error('Error al ejecutar el query:', err.sqlMessage || err.message);
      return res.status(500).json({ error: err.sqlMessage || 'Error al crear el grupo' });
    }
    console.log('Grupo creado exitosamente:', results);
    res.status(201).json({ message: 'Grupo creado con éxito', id: results.insertId });
  });
});

// Actualizar un grupo
app.put('/api/areas/:id', (req, res) => {
  const groupId = req.params.id;
  const { area_name, abbreviation } = req.body;

  if (!area_name || !abbreviation) {
    return res.status(400).json({ error: 'Nombre del grupo y abreviación son obligatorios' });
  }

  const query = 'UPDATE areas SET area_name = ?, abbreviation = ? WHERE id = ?';
  db.query(query, [area_name, abbreviation, groupId], (err, results) => {
    if (err) {
      console.error('Error al actualizar el grupo:', err);
      return res.status(500).json({ error: 'Error al actualizar el grupo' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Grupo no encontrado' });
    }
    res.json({ message: 'Grupo actualizado con éxito' });
  });
});

// Eliminar un grupo
app.delete('/api/areas/:id', (req, res) => {
  const groupId = req.params.id;

  const query = 'DELETE FROM areas WHERE id = ?';
  db.query(query, [groupId], (err, results) => {
    if (err) {
      console.error('Error al eliminar el grupo:', err);
      return res.status(500).json({ error: 'Error al eliminar el grupo' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Grupo no encontrado' });
    }
    res.json({ message: 'Grupo eliminado con éxito' });
  });
});

app.get('/api/notifications', (req, res) => {
  const query = `
    SELECT w.id, w.reason, w.date_issued, a.area_name, m.name AS main_persona_name
    FROM warnings w
    JOIN areas a ON w.area_id = a.id
    JOIN main_persona m ON w.main_persona_id = m.id
    WHERE w.check IS NULL
    ORDER BY w.date_issued DESC;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener notificaciones:", err);
      res.status(500).json({ error: "Error al obtener notificaciones" });
    } else {
      res.json(results);
    }
  });
});



// Endpoint para obtener notificaciones pendientes
app.put('/api/notifications/:id/check', (req, res) => {
  const { id } = req.params;

  const deleteQuery = `
    DELETE FROM warnings
    WHERE id = ?;
  `;

  db.query(deleteQuery, [id], (err) => {
    if (err) {
      console.error("Error al eliminar la notificación:", err);
      return res.status(500).json({ error: 'Error al eliminar la notificación' });
    }

    // Consulta para obtener las notificaciones restantes
    const getRemainingQuery = `
      SELECT w.id, w.reason, w.date_issued, a.area_name, m.name AS main_persona_name
      FROM warnings w
      JOIN areas a ON w.area_id = a.id
      JOIN main_persona m ON w.main_persona_id = m.id
      WHERE w.check IS NULL;
    `;

    db.query(getRemainingQuery, (err, results) => {
      if (err) {
        console.error("Error al obtener notificaciones restantes:", err);
        return res.status(500).json({ error: 'Error al obtener notificaciones restantes' });
      }

      // Depuración adicional
      console.log("Resultados de getRemainingQuery:", results);

      if (!results || results.length === 0) {
        console.warn("No se encontraron notificaciones restantes.");
        return res.json({
          message: 'Notificación marcada como revisada',
          remainingNotifications: [], // Lista vacía si no hay notificaciones restantes
        });
      }

      res.json({
        message: 'Notificación marcada como revisada',
        remainingNotifications: results, // Devuelve las notificaciones restantes
      });
    });
  });
});










// Función para generar notificaciones para perfiles desactualizados
const generateWarnings = () => {
  console.log("Generando notificaciones para perfiles desactualizados...");

  const query = `
    SELECT id AS main_persona_id, areas_id AS area_id
    FROM main_persona
    WHERE DATEDIFF(NOW(), updated_at) > 365;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error al buscar personas desactualizadas:", err);
      return;
    }

    if (results.length === 0) {
      console.log("No se encontraron personas desactualizadas.");
      return;
    }

    results.forEach(({ main_persona_id, area_id }) => {
      const warningsQuery = `
        INSERT INTO warnings (user_id, area_id, reason, date_issued, main_persona_id)
        VALUES (?, ?, 'Actualizar documentación', NOW(), ?)
        ON DUPLICATE KEY UPDATE date_issued = NOW();
      `;

      const userId = 1; // Cambia esto según el usuario autenticado

      db.query(warningsQuery, [userId, area_id, main_persona_id], (err) => {
        if (err) {
          console.error("Error al insertar notificación:", err);
        } else {
          console.log(`Notificación generada para persona ID ${main_persona_id}.`);
        }
      });
    });
  });
};






// Tarea programada para ejecutar cada hora
cron.schedule('0 * * * *', async () => {
  console.log("Iniciando revisión de personas desactualizadas...");

  // Limpia notificaciones repetidas
  const cleanupQuery = `
    DELETE w1
    FROM warnings w1
    JOIN warnings w2
    ON w1.main_persona_id = w2.main_persona_id
    AND w1.id > w2.id
    AND w1.reason = w2.reason
    WHERE w1.check IS NULL;
  `;

  db.query(cleanupQuery, (err, results) => {
    if (err) {
      console.error("Error al limpiar notificaciones repetidas:", err);
    } else {
      console.log("Notificaciones repetidas eliminadas:", results.affectedRows);
    }
  });

  // Consulta para obtener las personas con más de un año sin actualizar
  const query = `
      SELECT id AS main_persona_id, areas_id AS area_id
      FROM main_persona
      WHERE DATEDIFF(NOW(), updated_at) > 365;
  `;

  db.query(query, (err, results) => {
      if (err) {
          console.error("Error al buscar personas desactualizadas:", err);
          return;
      }

      results.forEach(({ main_persona_id, area_id }) => {
          const warningsQuery = `
              INSERT INTO warnings (user_id, area_id, reason, date_issued, main_persona_id)
              VALUES (?, ?, 'Actualizar documentación', NOW(), ?)
              ON DUPLICATE KEY UPDATE date_issued = NOW();
          `;

          const userId = 1; // Cambia esto según el usuario actualmente logueado o usa un valor por defecto

          db.query(warningsQuery, [userId, area_id, main_persona_id], (err) => {
              if (err) {
                  console.error("Error al insertar notificación:", err);
              } else {
                  console.log(`Notificación generada para persona ID ${main_persona_id}.`);
              }
          });
      });
  });
});




// Endpoint para obtener las fechas únicas de asistencias
app.get('/api/assistence/dates', async (req, res) => {
  try {
    const query = `
      SELECT DISTINCT DATE(created_at) as date
      FROM assistence
      WHERE created_at IS NOT NULL
      ORDER BY date ASC
    `;
    const [results] = await db.query(query); // Asegúrate de usar la conexión a tu base de datos
    const dates = results.map((row) => row.date); // Mapea los resultados a un arreglo de fechas
    res.json(dates);
  } catch (error) {
    console.error('Error al obtener fechas:', error);
    res.status(500).json({ error: 'Error al obtener fechas de asistencia' });
  }
});





app.use((req, res, next) => {
  console.log(`Solicitud recibida: ${req.method} ${req.url}`);
  next(); // Asegura que se pase al siguiente middleware o ruta
});


// Inicialización del servidor
app.listen(3001, () => {
  console.log('Servidor corriendo en el puerto 3001');
});