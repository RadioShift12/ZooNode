const { body } = require('express-validator');

exports.validateAnimal = [
  body('name').trim().escape().notEmpty().withMessage('Name is required'),
  body('species').trim().escape().notEmpty().withMessage('Species is required'),
  body('healthStatus').isIn(['Healthy', 'Sick', 'Recovering', 'Critical'])
    .withMessage('Invalid health status'),
  body('visitorCount').optional().isInt({ min: 0 })
];