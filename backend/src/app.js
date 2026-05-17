require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const { errorHandler } = require('./middleware/errorHandler');
const { sequelize } = require('./models');

const app = express();

app.use(helmet());
app.use(cors({ origin: config.cors.origin, credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/students', require('./routes/students'));
app.use('/api/teachers', require('./routes/teachers'));
app.use('/api/classes', require('./routes/classes'));
app.use('/api/sections', require('./routes/sections'));
app.use('/api/subjects', require('./routes/subjects'));
app.use('/api/exams', require('./routes/exams'));
app.use('/api/marks', require('./routes/marks'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/fees', require('./routes/fees'));
app.use('/api/discipline', require('./routes/discipline'));
app.use('/api/timetable', require('./routes/timetable'));
app.use('/api/communication', require('./routes/communication'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/departments', require('./routes/departments'));
app.use('/api/auth/invites', require('./routes/invites'));
app.use('/api/lost-items', require('./routes/lostitems'));
app.use('/api/login-requests', require('./routes/loginRequests'));
app.use('/api/audit', require('./routes/audit'));
app.use('/api/school', require('./routes/levelsTrades'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/import', require('./routes/import'));
app.use('/api/email', require('./routes/email'));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Acadex API is running', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

const PORT = config.port;

sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully');
    return sequelize.sync({ force: process.env.NODE_ENV === 'development' });
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to database:', err);
    process.exit(1);
  });

module.exports = app;
