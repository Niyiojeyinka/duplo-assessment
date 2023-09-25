import { authorController } from '../controllers';
import { FastifyInstance, FastifyPluginCallback } from 'fastify';

const {
  register,
  login
} = authorController;
console.log('authorRouter');
const authorRouter: FastifyPluginCallback = (app: FastifyInstance, opts, done) => {
  app.post('/register', register);
  app.post('/login', login);
  done();
}

export default authorRouter;