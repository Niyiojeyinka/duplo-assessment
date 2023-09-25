import { body, param } from 'express-validator';

export default {
  idValidation: [
    param('id').isNumeric().withMessage('Id should be a number').notEmpty().withMessage('Id is required'),
  ],
  registerValidation: [
    body('email').isEmail().withMessage('Not a valid email').notEmpty().withMessage('Email is required').normalizeEmail(),
    body('password').isLength({ min: 5 }).withMessage('Password should be at least 5 chars').notEmpty().withMessage('Password is required'),
    body('name').isString().withMessage('Name should be a string').notEmpty().withMessage('Name is required'),
  ],

  loginValidation: [
    body('email').isEmail().withMessage('Not a valid email').notEmpty().withMessage('Email is required').normalizeEmail(),
    body('password').isLength({ min: 5 }).withMessage('Password should be at least 5 chars').notEmpty().withMessage('Password is required')
  ]
}
