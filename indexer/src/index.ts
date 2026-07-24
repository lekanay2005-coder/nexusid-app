import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pino from 'pino';
import profileRouter from './routes/profile';
import reputationRouter from './routes/reputation';
import { startEventListener } from './eventListener';

dotenv.config();

const logger = pino({ name: 'indexer-server' });
const app = express();
const port = process.env.INDEXER_PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/profile', profileRouter);
app.use('/api/reputation', reputationRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

app.listen(port, () => {
  logger.info(`NexusID Indexer running on port ${port}`);
  startEventListener().catch((err) => {
    logger.error({ err }, "Event listener failed to start");
  });
});
