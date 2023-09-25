import { Router } from 'express';
import postValidations from '../middlewares/validations/post';
import { handleValidationErrors } from '../middlewares/validations/validator';
import { postController } from '../controllers';
import authenticator from '../middlewares/authenticator';

const router = Router();
const {
  createValidation,
  getValidation
} = postValidations;
const {
  getPost,
  getPosts,
  createPost,
  updatePost,
  deletePost,
} = postController;

router.get('/', getPosts);
router.post('/', authenticator, createValidation, handleValidationErrors, createPost);
router.get('/:id', getValidation, handleValidationErrors, getPost);
router.put('/:id', authenticator, getValidation, handleValidationErrors, updatePost);
router.delete('/:id', authenticator, getValidation, handleValidationErrors, deletePost);


export default router;
