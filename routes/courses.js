const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Course, User, Class } = require('../models');
const { authMiddleware, authorize } = require('../middleware/auth');

// GET /api/courses
router.get('/', authMiddleware, async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [
        { model: User, attributes: ['id','name'] },
        { model: Class, attributes: ['id','name'] }
      ]
    });
    res.json(courses);
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/courses
router.post('/',
  authMiddleware,
  authorize(['admin']),
  body('name').notEmpty(),
  body('teacher_id').isInt(),
  body('class_id').isInt(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { name, teacher_id, class_id } = req.body;
      const course = await Course.create({ name, teacher_id, class_id });
      res.json(course);
    } catch(err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// etc. GET /api/courses/:id, PUT, DELETE if needed

module.exports = router;
