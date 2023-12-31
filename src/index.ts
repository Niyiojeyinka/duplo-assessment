import Ajv from 'ajv';
import logger from './configs/logger';
import fastify from 'fastify';
import ajvErrors from 'ajv-errors';
import type { FastifyInstance, FastifyReply as Response, FastifyRequest as Request } from "fastify";
import { errorHandler } from './utils/error-handler';
import prisma from './configs/database';
import redis from './configs/redis';
import authorRouter from './routes/author-router';
import postRouter from './routes/post-router';

const ajv = new Ajv({
   allErrors: true,
   removeAdditional: true,
   useDefaults: true,
   coerceTypes: 'array',
 });

ajvErrors(ajv);

let app: FastifyInstance = fastify({ 
   logger: false ,
   ajv: {
      customOptions: {
        allErrors: true,
      },
      plugins: [
        ajvErrors
      ]
   }
});
app.get('/health', (req: Request, res: Response) => {
   res.send({ status: 'ok' });
});
app.register(authorRouter, { prefix: '/authors' });
app.register(postRouter, { prefix: '/posts' });
app.setErrorHandler(errorHandler);

process.on('SIGINT', async () => {
   await prisma.$disconnect();
   process.exit(0);
});
process.on('exit', () => {
    redis.disconnect();
});
redis.on('error', (error) => {
    logger.error('Redis error:', error);
});
redis.on('connect', () => {
    logger.info('Redis connected');
});

export default app;
