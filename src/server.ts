import app from './index'
import logger from './configs/logger';
import environmentConfig from './configs/environment';

const { PORT } = environmentConfig;

app.listen({
  port: PORT,
  host: '0.0.0.0'
}
);

export default app;