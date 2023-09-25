import { Router } from 'express';
import authorValidations from '../middlewares/validations/author';
import { handleValidationErrors } from '../middlewares/validations/validator';
import { authorController } from '../controllers';

const router = Router();
const {
  registerValidation,
  loginValidation,
} = authorValidations;
const {
  register,
  login
} = authorController;

router.post('/', registerValidation, handleValidationErrors, register);
router.post('/login', loginValidation, login);

export default router;
