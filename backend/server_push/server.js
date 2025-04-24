//import fs from 'fs';
import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import http from 'http';
import serverPushRouter from './routes/server_push.js';

import cors from 'cors';

dotenv.config();

const app = express();

// Aumentar el límite de tamaño para los JSON
app.use(bodyParser.json({ limit: '1mb' }));

// Middleware para manejo de errores de parsing JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'JSON inválido' });
  }
  next();
});

// Ruta principal
app.get('/', (req, res) => {
  res.send('Push notification server is running!');
});

// Registrar las rutas de server_push.js
app.use('/push', serverPushRouter);

// Configurar CORS para toda la aplicación
app.use(
  cors({
    origin: 'http://localhost:5173', // Cambia esto al origen del frontend
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

// Añadir headers CORS específicos
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  next();
});

const port = process.env.PORT || 4000; // Usar PORT de las variables de entorno o 4000 por defecto

try {
  const server = http.createServer(app);

  server.listen(port, () => {
    console.log(
      `Push notification server started and listening on http://localhost:${port}`,
    );
    console.log(`Test the server at: http://localhost:${port}/push`);
  });
} catch (error) {
  console.error('Error al iniciar el servidor:', error);

  // Fallback al servidor HTTP si hay problema con los certificados
  console.log('Intentando iniciar servidor HTTP en modo de emergencia...');
  app.listen(port, () => {
    console.log(
      `Push notification server started in HTTP mode on port ${port}`,
    );
    console.log(
      `WARNING: Las notificaciones push requieren HTTP en producción`,
    );
  });
}
