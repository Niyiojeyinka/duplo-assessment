import app from './index'
import logger from './configs/logger';
import environmentConfig from './configs/environment';

const { PORT } = environmentConfig;

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});

app.listen({
  port: PORT
}
);

export default app;