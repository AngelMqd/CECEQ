const bcrypt = require('bcrypt');

(async () => {
  const password = 'admin';
  const saltRounds = 10;

  try {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('Nuevo hash generado para "admin":', hash);
  } catch (error) {
    console.error('Error al generar el hash:', error);
  }
})();
