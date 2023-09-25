import logger from './configs/logger';
import express, { Request, Response } from "express";
import { errorHandler } from './middlewares/errorHandler';
import rootRouter from './routes';
import prisma from './configs/database';
import redis from './configs/redis';
import bodyPayloadValidator from './middlewares/bodyPayloadValidator';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json({
   inflate: true,
   strict: true,
   verify: bodyPayloadValidator}
));
app.get('/health', (req: Request, res: Response) => {
   res.status(200).json('OK');
});
app.use('/', rootRouter);
app.use(errorHandler);
process.on('unhandledRejection', (err) => {
   logger.error(err);
   process.exit(1);
});
process.on('uncaughtException', (err) => {
   logger.error(err);
   process.exit(1);
});
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
