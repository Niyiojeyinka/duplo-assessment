import { body, param } from 'express-validator';

export default {
  createValidation: [
    body('title').isString().withMessage('Title should be a string').notEmpty().withMessage('Title is required'),
    body('content').isString().withMessage('Content should be a string').notEmpty().withMessage('Content is required'),
  ],
  getValidation: [
    param('id').isNumeric().withMessage('Id should be a number').notEmpty().withMessage('Id is required'),
  ]
}
