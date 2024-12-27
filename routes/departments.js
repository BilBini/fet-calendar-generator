const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Department } = require('../models');

// GET /api/departments
router.get('/', async (req, res) => {
  try {
    const departments = await Department.findAll();
    res.json(departments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/departments
router.post('/',
  body('name').notEmpty(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { name, description } = req.body;
      const dept = await Department.create({ name, description });
      res.json(dept);
    } catch(err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// GET /api/departments/:id
router.get('/:id', async (req, res) => {
  try {
    const dept = await Department.findByPk(req.params.id);
    if(!dept) return res.status(404).json({ error: 'Not found' });
    res.json(dept);
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/departments/:id
router.put('/:id',
  body('name').notEmpty(),
  async (req, res) => {
    try {
      const dept = await Department.findByPk(req.params.id);
      if(!dept) return res.status(404).json({ error: 'Not found' });
      const { name, description } = req.body;
      dept.name = name;
      dept.description = description;
      await dept.save();
      res.json(dept);
    } catch(err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// DELETE /api/departments/:id
router.delete('/:id', async (req, res) => {
  try {
    const dept = await Department.findByPk(req.params.id);
    if(!dept) return res.status(404).json({ error: 'Not found' });
    await dept.destroy();
    res.json({ message: 'Department deleted' });
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
