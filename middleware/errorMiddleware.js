exports.errorHandler = (err, req, res, next) => {
  // CSRF Error handling
  if (err.code === 'EBADCSRFTOKEN') {
    console.error('[SECURITY ALERT] Invalid CSRF Token attempted.');
    return res.status(403).json({ error: 'Session expired or invalid form submission.' });
  }

  console.error(`[ERROR] ${err.stack}`);
  res.status(500).json({
    message: 'A server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
};