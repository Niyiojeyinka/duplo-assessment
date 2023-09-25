import { Router } from 'express';
import authorRoutes from './author-routes';
import postRoutes from './post-routes';

const rootRouter = Router();

rootRouter.use('/authors', authorRoutes);
rootRouter.use('/posts', postRoutes);

export default rootRouter;
