import { authorController } from '../controllers';
import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { registerValidationSchema, loginValidationSchema } from '../middlewares/validations/author';

const {
  register,
  login
} = authorController;

const authorRouter: FastifyPluginCallback = (app: FastifyInstance, opts, done) => {
  app.post('/register', { schema: registerValidationSchema }, register);
  app.post('/login', { schema: loginValidationSchema }, login);
  done();
}

export default authorRouter;
