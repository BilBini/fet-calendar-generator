const express = require('express');
const router = express.Router();
const { Grade, User, Course } = require('../models');
const { body, validationResult } = require('express-validator');

// GET /api/grades
// e.g. /api/grades?student_id=1 or ?course_id=5
router.get('/', async (req, res) => {
  try {
    const where = {};
    if (req.query.student_id) where.student_id = req.query.student_id;
    if (req.query.course_id) where.course_id = req.query.course_id;

    const grades = await Grade.findAll({
      where,
      include: [
        { model: User, attributes: ['id', 'name'] },
        { model: Course, attributes: ['id', 'name'] }
      ]
    });
    res.json(grades);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/grades
router.post('/',
  body('student_id').isInt(),
  body('course_id').isInt(),
  body('grade').notEmpty(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { student_id, course_id, grade, note } = req.body;
      const entry = await Grade.create({ student_id, course_id, grade, note });
      res.json(entry);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Could add PUT /api/grades/:id, DELETE /api/grades/:id, etc.

module.exports = router;
