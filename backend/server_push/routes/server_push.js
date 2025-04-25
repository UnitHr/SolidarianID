// Use the web-push library to hide the implementation details of the communication
// between the application server and the push service.
// For details, see https://tools.ietf.org/html/draft-ietf-webpush-protocol and
// https://tools.ietf.org/html/draft-ietf-webpush-encryption.
import webPush from 'web-push';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Actualiza la configuración de CORS
router.use(
  cors({
    origin: 'http://localhost:5173', // Cambia esto al origen del frontend
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }),
);

// Añade un middleware para los headers de CORS
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); // Cambia esto al origen del frontend);
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);

  // Para peticiones OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  next();
});

// Almacenamiento en memoria para las suscripciones
const subscriptions = [];

if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
  console.error(
    'You must set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY environment variables. You can use the following ones:',
    webPush.generateVAPIDKeys(),
  );
  throw new Error('Missing VAPID keys');
}

// Set the keys used for encrypting the push messages.
webPush.setVapidDetails(
  'mailto:tu_email@ejemplo.com', // Cambia esto a tu email real
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY,
);

router.get('/', function rootHandler(req, res) {
  res.send('Push System : Working...');
});

router.get('/vapidPublicKey', function vapidPublicKeyHandler(req, res) {
  res.send(process.env.VAPID_PUBLIC_KEY);
});

router.post('/register', function registerHandler(req, res) {
  const { subscription, userId, userRoles } = req.body;

  // Verificar que la suscripción sea válida
  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ error: 'Suscripción inválida' });
  }

  // Verificar que se envíen el ID y el rol del usuario
  if (!userId || !userRoles) {
    return res.status(400).json({ error: 'Se requiere id y rol del usuario' });
  }

  // Comprobar si ya existe la suscripción
  const existingSubscriptionIndex = subscriptions.findIndex(
    (sub) => sub.subscription.endpoint === subscription.endpoint,
  );

  // Si ya existe, actualizarla; si no, agregarla
  if (existingSubscriptionIndex !== -1) {
    subscriptions[existingSubscriptionIndex] = {
      subscription,
      userId,
      userRoles,
    };
    console.log('Suscripción actualizada:', subscription.endpoint);
  } else {
    subscriptions.push({ subscription, userId, userRoles });
    console.log('Nueva suscripción registrada:', subscription.endpoint);
  }

  res.status(201).json({ message: 'Suscripción registrada exitosamente' });
});

// Ruta para enviar notificación a una suscripción específica
router.post('/sendNotification', function sendNotificationHandler(req, res) {
  const { subscription, payload, ttl = 86400, delay = 0 } = req.body;

  // Verificar que la suscripción sea válida
  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ error: 'Suscripción inválida' });
  }

  setTimeout(function sendNotification() {
    webPush
      .sendNotification(subscription, payload, { TTL: ttl })
      .then(function onSuccess() {
        res.status(201).json({ message: 'Notificación enviada' });
      })
      .catch(function onError(error) {
        console.error('Error al enviar notificación:', error);
        res.status(500).json({ error: 'Error al enviar notificación' });
      });
  }, delay * 1000);
});

// Nueva ruta para enviar notificación a todas las suscripciones
router.post('/sendToAll', function sendToAllHandler(req, res) {
  const { payload, ttl = 86400 } = req.body;

  if (!payload) {
    return res.status(400).json({ error: 'Se requiere payload' });
  }

  if (subscriptions.length === 0) {
    return res.status(404).json({ error: 'No hay suscripciones registradas' });
  }

  const sendPromises = subscriptions.map((subscription) => {
    return webPush
      .sendNotification(subscription, payload, { TTL: ttl })
      .catch((error) => {
        console.error('Error al enviar a:', subscription.endpoint, error);
        // Si el error es que la suscripción ha expirado, la eliminamos
        if (error.statusCode === 410) {
          const index = subscriptions.findIndex(
            (sub) => sub.endpoint === subscription.endpoint,
          );
          if (index !== -1) {
            subscriptions.splice(index, 1);
            console.log(
              'Suscripción eliminada por expiración:',
              subscription.endpoint,
            );
          }
        }
        return { error: true, endpoint: subscription.endpoint };
      });
  });

  Promise.all(sendPromises)
    .then((results) => {
      const successful = results.filter(
        (result) => !result || !result.error,
      ).length;
      res.json({
        message: `Notificaciones enviadas: ${successful} de ${subscriptions.length}`,
      });
    })
    .catch((error) => {
      console.error('Error al enviar notificaciones:', error);
      res.status(500).json({ error: 'Error al enviar notificaciones' });
    });
});

// Ruta para enviar notificación solo a los administradores
router.post('/sendToAdmins', function sendToAdminsHandler(req, res) {
  const { payload, ttl = 86400 } = req.body;

  if (!payload) {
    return res.status(400).json({ error: 'Se requiere payload' });
  }

  // Filtrar suscripciones donde el rol del usuario incluye 'admin'
  const adminSubscriptions = subscriptions.filter((sub) =>
    sub.userRoles.includes('admin'),
  );

  if (adminSubscriptions.length === 0) {
    return res.status(404).json({ error: 'No hay administradores suscritos' });
  }

  const sendPromises = adminSubscriptions.map((subscription) => {
    return webPush
      .sendNotification(subscription.subscription, payload, { TTL: ttl })
      .catch((error) => {
        console.error(
          'Error al enviar a:',
          subscription.subscription.endpoint,
          error,
        );
        // Si el error es que la suscripción ha expirado, la eliminamos
        if (error.statusCode === 410) {
          const index = subscriptions.findIndex(
            (sub) =>
              sub.subscription.endpoint === subscription.subscription.endpoint,
          );
          if (index !== -1) {
            subscriptions.splice(index, 1);
            console.log(
              'Suscripción eliminada por expiración:',
              subscription.subscription.endpoint,
            );
          }
        }
        return { error: true, endpoint: subscription.subscription.endpoint };
      });
  });

  Promise.all(sendPromises)
    .then((results) => {
      const successful = results.filter(
        (result) => !result || !result.error,
      ).length;
      res.json({
        message: `Notificaciones enviadas a administradores: ${successful} de ${adminSubscriptions.length}`,
      });
    })
    .catch((error) => {
      console.error('Error al enviar notificaciones:', error);
      res.status(500).json({ error: 'Error al enviar notificaciones' });
    });
});

// Ruta para listar todas las suscripciones (útil para debugging)
router.get('/subscriptions', function listSubscriptionsHandler(req, res) {
  res.json({
    count: subscriptions.length,
    subscriptions: subscriptions.map((sub) => ({
      subscription: sub.subscription, // Devuelve la suscripción completa
      userId: sub.userId, // Incluye el ID del usuario
      userRoles: sub.userRoles, // Incluye el rol del usuario
    })),
  });
});

// Ruta para verificar si un usuario está suscrito
router.get(
  '/subscription/:userId',
  function checkSubscriptionHandler(req, res) {
    const { userId } = req.params;

    // Buscar si existe una suscripción para el userId proporcionado
    const subscription = subscriptions.find((sub) => sub.userId === userId);

    if (subscription) {
      res.json({ isSubscribed: true, subscription: subscription.subscription });
    } else {
      res.json({ isSubscribed: false });
    }
  },
);

export default router;
