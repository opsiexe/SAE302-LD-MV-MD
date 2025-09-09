import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from 'redis';
import { WebSocketServer } from 'ws';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connexion Redis
const redisClient = createClient({ url: process.env.REDIS_URL });
redisClient.connect().catch(console.error);

// Ping route
app.get('/ping', (req, res) => res.json({ message: 'pong' }));

// Lancement serveur HTTP
const server = app.listen(process.env.PORT || 5000, () =>
  console.log('Backend running on port 5000')
);

// WebSocket
const wss = new WebSocketServer({ server });
wss.on('connection', ws => {
  ws.send(JSON.stringify({ message: 'Connected to WebSocket backend' }));
});

// TTL (durée en cache Redis)
const TTL_CURRENT = Number(process.env.CACHE_TTL_CURRENT) || 300;     // 5 min
const TTL_FORECAST = Number(process.env.CACHE_TTL_FORECAST) || 3600; // 1h

/**
 * Route : météo actuelle
 */
app.get('/weather/current', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Merci de fournir lat et lon en query params' });
    }

    const cacheKey = `weather:current:${lat}:${lon}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log("data-from-redis");
      return res.json(JSON.parse(cached));
    }

    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=${process.env.WEATHER_API_KEY}&units=metric&lang=fr`;
    console.log("API-call: ", url);

    const response = await fetch(url);
    const data = await response.json();

    await redisClient.set(cacheKey, JSON.stringify(data), { EX: TTL_CURRENT });
    console.log("Data-stored-in-redis-on:", cacheKey);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Impossible de récupérer les données de l’API' });
  }
});

/**
 * Route : prévisions horaires
 */
app.get('/weather/hourly', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Merci de fournir lat et lon en query params' });
    }

    const cacheKey = `weather:hourly:${lat}:${lon}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log("data-from-redis");
      return res.json(JSON.parse(cached));
    }

    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,daily,alerts&appid=${process.env.WEATHER_API_KEY}&units=metric&lang=fr`;
    console.log("API-call: ", url);

    const response = await fetch(url);
    const data = await response.json();

    await redisClient.set(cacheKey, JSON.stringify(data), { EX: TTL_FORECAST });
    console.log("Data-stored-in-redis-on:", cacheKey);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Impossible de récupérer les données de l’API' });
  }
});

/**
 * Route : prévisions journalières
 */
app.get('/weather/daily', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Merci de fournir lat et lon en query params' });
    }

    const cacheKey = `weather:daily:${lat}:${lon}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log("data-from-redis");
      return res.json(JSON.parse(cached));
    }

    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${process.env.WEATHER_API_KEY}&units=metric&lang=fr`;
    console.log("API-call: ", url);

    const response = await fetch(url);
    const data = await response.json();

    await redisClient.set(cacheKey, JSON.stringify(data), { EX: TTL_FORECAST });
    console.log("Data-stored-in-redis-on:", cacheKey);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Impossible de récupérer les données de l’API' });
  }
});

/**
 * Route : alertes météo
 */
app.get('/weather/alerts', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Merci de fournir lat et lon en query params' });
    }

    const cacheKey = `weather:alerts:${lat}:${lon}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log("data-from-redis");
      return res.json(JSON.parse(cached));
    }

    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,daily&appid=${process.env.WEATHER_API_KEY}&units=metric&lang=fr`;
    console.log("API-call: ", url);

    const response = await fetch(url);
    const data = await response.json();

    await redisClient.set(cacheKey, JSON.stringify(data), { EX: TTL_FORECAST });
    console.log("Data-stored-in-redis-on:", cacheKey);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Impossible de récupérer les données de l’API' });
  }
});

app.get('/geocoding', async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({ error: 'Merci de fournir la ville en query params' });
    }

    const cacheKey = `geocoding:${city}`;
    const cached = await redisClient.get(cacheKey);

    if(cached){
      console.log("data-from-redis");
      return res.json(JSON.parse(cached));
    }

    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${process.env.GEOCODING_API_KEY}`;
    console.log("API-call: ", url);

    const response = await fetch(url);
    const data = await response.json();

    await redisClient.set(cacheKey, JSON.stringify(data));
    console.log("Data-stored-in-redis-on:", cacheKey);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Impossible de récupérer les données de l’API' });
  }
});

app.get('/geocoding/reverse', async (req, res) => {
  try {
    const { lat,lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Merci de fournir la lattitude et la longitude en query params' });
    }

    const cacheKey = `geocoding:reverse:${lat}:${lon}`;
    const cached = await redisClient.get(cacheKey);

    if(cached){
      console.log("data-from-redis");
      return res.json(JSON.parse(cached));
    }

    const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${process.env.GEOCODING_API_KEY}`;
    console.log("API-call: ", url);

    const response = await fetch(url);
    const data = await response.json();

    await redisClient.set(cacheKey, JSON.stringify(data));
    console.log("Data-stored-in-redis-on:", cacheKey);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Impossible de récupérer les données de l’API' });
  }
});