import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from 'redis';
import { WebSocketServer } from 'ws';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const redisClient = createClient({ url: process.env.REDIS_URL });
redisClient.connect().catch(console.error);

app.get('/ping', (req, res) => res.json({ message: 'pong' }));

const server = app.listen(process.env.PORT || 5000, () => console.log('Backend running on port 5000'));

const wss = new WebSocketServer({ server });
wss.on('connection', ws => {
  ws.send(JSON.stringify({ message: 'Connected to WebSocket backend' }));
});
