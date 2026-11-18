function errorHandler(err, req, res, next) {
  // Email duplicado (violación de UNIQUE en PostgreSQL)
  if (err.code === '23505') {
    return res.status(409).json({ error: 'Email already exists' });
  }

  // Errores creados con createError
  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }

  // Cualquier otro: se registra y se responde genérico
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
}

module.exports = errorHandler;