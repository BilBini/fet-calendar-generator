const express = require('express');
const router = express.Router();
const { Attendance, Course, User } = require('../models');
const { body, validationResult } = require('express-validator');

// GET /api/attendance
// e.g. ?course_id=2&date=2024-01-01
router.get('/', async (req, res) => {
  try {
    const where = {};
    if (req.query.course_id) where.course_id = req.query.course_id;
    if (req.query.date) where.date = req.query.date;

    const records = await Attendance.findAll({
      where,
      include: [
        { model: User, attributes: ['id', 'name'] },
        { model: Course, attributes: ['id', 'name'] },
      ]
    });
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/attendance
router.post('/',
  body('student_id').isInt(),
  body('course_id').isInt(),
  body('date').notEmpty(),
  body('status').isIn(['present','absent','late']),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { student_id, course_id, date, status } = req.body;
      const newRec = await Attendance.create({
        student_id,
        course_id,
        date,
        status
      });
      res.json(newRec);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// More routes as needed (PUT, DELETE, etc.)

module.exports = router;
