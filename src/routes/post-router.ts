import { postController } from '../controllers';
import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import authenticator from '../middlewares/authenticator';

const {
  getPost,
  getPosts,
  createPost,
  updatePost,
  deletePost,
} = postController;

const postRouter: FastifyPluginCallback = (app: FastifyInstance, opts, done) => {
  app.post('/',  { preHandler: [authenticator] }, createPost);
  app.get('/', getPosts);
  app.get('/:id', getPost);
  app.put('/:id', updatePost);
  app.delete('/:id', deletePost);

  done();
};

export default postRouter;