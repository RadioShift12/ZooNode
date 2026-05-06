const express = require('express');
const router = express.Router();
const { validateAnimal } = require('../middleware/validator');
const { validationResult } = require('express-validator');

// In-memory data store (for development)
let animals = [
  { id: '1', name: 'Leo', species: 'Lion', healthStatus: 'Healthy', visitorCount: 0 }
];

// POST: Update Animal Status / Add Animal
router.post('/update-animal', validateAnimal, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('[VALIDATION ERROR]', errors.array());
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { id, name, species, healthStatus } = req.body;
  
  // Logic to find and update or push new record
  const index = animals.findIndex(a => a.id === id);
  if (index !== -1) {
    animals[index] = { ...animals[index], name, species, healthStatus };
    console.log(`[UPDATE] Animal ID ${id} updated successfully.`);
  } else {
    const newAnimal = { id: Date.now().toString(), name, species, healthStatus, visitorCount: 0 };
    animals.push(newAnimal);
    console.log(`[CREATE] New animal ${name} added.`);
  }

  res.status(200).json({ success: true, data: animals });
});

// GET: Health Monitoring
router.get('/health-report', (req, res) => {
  const critical = animals.filter(a => a.healthStatus === 'Critical');
  console.log(`[MONITOR] Health report generated. ${critical.length} critical cases.`);
  res.json({ totalCount: animals.length, criticalCases: critical });
});

// POST: Visitor Tracking
router.post('/track-visitor/:id', (req, res) => {
  const animal = animals.find(a => a.id === req.params.id);
  if (!animal) return res.status(404).send('Animal not found');
  
  animal.visitorCount++;
  console.log(`[VISITOR] Count incremented for ${animal.name}.`);
  res.json({ id: animal.id, currentVisitors: animal.visitorCount });
});

module.exports = router;