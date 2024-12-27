const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Timetable, Class, Course } = require('../models');
const { authMiddleware, authorize } = require('../middleware/auth');
const { generateTimetableForClass } = require('../utils/timetableGenerator');

// GET /api/timetables
router.get('/', async (req, res) => {
  try {
    const { class_id } = req.query;
    const where = {};
    if(class_id) where.class_id = class_id;

    const timetables = await Timetable.findAll({
      where,
      include: [
        { model: Class, attributes: ['id','name'] },
        { model: Course, attributes: ['id','name'] }
      ]
    });
    res.json(timetables);
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/timetables
router.post('/',
  authMiddleware,
  authorize(['admin']),
  body('class_id').isInt(),
  body('course_id').isInt(),
  body('day').isIn(['Monday','Tuesday','Wednesday','Thursday','Friday']),
  body('start_time').notEmpty(),
  body('end_time').notEmpty(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { class_id, course_id, day, start_time, end_time } = req.body;
      const entry = await Timetable.create({
        class_id,
        course_id,
        day,
        start_time,
        end_time
      });
      res.json(entry);
    } catch(err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// POST /api/timetables/generate
router.post('/generate',
  authMiddleware,
  authorize(['admin']),
  body('class_id').isInt(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { class_id } = req.body;
      const classObj = await Class.findByPk(class_id, { include: Course });
      if(!classObj) {
        return res.status(404).json({ error: 'Class not found' });
      }
      const generated = await generateTimetableForClass(classObj);
      res.json(generated);
    } catch(err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// DELETE /api/timetables/:id (optional)
router.delete('/:id',
  authMiddleware,
  authorize(['admin']),
  async (req, res) => {
    try {
      const entry = await Timetable.findByPk(req.params.id);
      if(!entry) return res.status(404).json({ error: 'Timetable entry not found' });
      await entry.destroy();
      res.json({ message: 'Timetable entry deleted' });
    } catch(err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

module.exports = router;
