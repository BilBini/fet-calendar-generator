const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Class, Department } = require('../models');
const { authMiddleware, authorize } = require('../middleware/auth');

// GET /api/classes
router.get('/', async (req, res) => {
  try {
    const classes = await Class.findAll({ include: Department });
    res.json(classes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/classes
router.post('/',
  authMiddleware,
  authorize(['admin']),
  body('name').notEmpty(),
  body('department_id').isInt(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, department_id } = req.body;
      const newClass = await Class.create({ name, department_id });
      res.json(newClass);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// GET /api/classes/:id
router.get('/:id', async (req, res) => {
  try {
    const classObj = await Class.findByPk(req.params.id, { include: Department });
    if(!classObj) return res.status(404).json({ error: 'Class not found' });
    res.json(classObj);
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/classes/:id
router.put('/:id',
  authMiddleware,
  authorize(['admin']),
  body('name').notEmpty(),
  body('department_id').isInt(),
  async (req, res) => {
    try {
      const classObj = await Class.findByPk(req.params.id);
      if(!classObj) return res.status(404).json({ error: 'Class not found' });
      const { name, department_id } = req.body;
      classObj.name = name;
      classObj.department_id = department_id;
      await classObj.save();
      res.json(classObj);
    } catch(err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// DELETE /api/classes/:id
router.delete('/:id',
  authMiddleware,
  authorize(['admin']),
  async (req, res) => {
    try {
      const classObj = await Class.findByPk(req.params.id);
      if(!classObj) return res.status(404).json({ error: 'Class not found' });
      await classObj.destroy();
      res.json({ message: 'Class deleted' });
    } catch(err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

module.exports = router;
