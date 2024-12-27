require('dotenv').config();

const express = require('express');
const next = require('next');
const cors = require('cors');
const helmet = require('helmet');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const app = express();
  const PORT = process.env.PORT || 4000;

  app.use(cors());
  app.use(helmet());
  app.use(express.json());

  // Import routes
  const authRoutes = require('./routes/auth');
  const departmentRoutes = require('./routes/departments');
  const classesRoutes = require('./routes/classes');
  const coursesRoutes = require('./routes/courses');
  const timetablesRoutes = require('./routes/timetables');

  // Mount them
  app.use('/api/auth', authRoutes);
  app.use('/api/departments', departmentRoutes);
  app.use('/api/classes', classesRoutes);
  app.use('/api/courses', coursesRoutes);
  app.use('/api/timetables', timetablesRoutes);

  // Next handles everything else
  app.all('*', (req, res) => {
    return handle(req, res);
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Next.js server failed to start:', err);
});

