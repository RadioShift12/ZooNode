const express = require('express');
const helmet = require('helmet');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const zooRoutes = require('./routes/zooRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();


app.set('trust proxy', 1);

// 1. Basic Headers & Protection
app.use(helmet()); 
app.use(express.json());
app.use(cookieParser());

// 2. Rate Limiting (DoS Protection)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// 3. CSRF Protection
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Route to provide CSRF token
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Routes
// I wanted an actual page.
app.use(express.static('public'));

app.use('/api/zoo', zooRoutes);

// Error Handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[SERVER] Zoo Management System running on port ${PORT}`);
});