import { urlBase64ToUint8Array } from '../utils/base64Utils';

const PUSH_SERVER_URL = 'http://localhost:4000/push';

/**
 * Registers a service worker and subscribes the user to push notifications.
 */
async function registerServiceWorker() {
  try {
    const registration = await navigator.serviceWorker.register('/javascripts/sw.js');
    console.log('Service Worker registrado:', registration);
    return registration;
  } catch (error) {
    console.error('Error al registrar el Service Worker:', error);
    throw error;
  }
}

/**
 * Subscribes the user to the Push Manager using the VAPID public key.
 */
async function subscribeUserToPushManager(registration: ServiceWorkerRegistration) {
  try {
    const response = await fetch(`${PUSH_SERVER_URL}/vapidPublicKey`, {
      credentials: 'include',
    });
    const vapidPublicKey = await response.text();
    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey,
    });

    console.log('Nueva suscripción creada:', subscription);
    return subscription;
  } catch (error) {
    console.error('Error al suscribir al usuario al Push Manager:', error);
    throw error;
  }
}

/**
 * Registers the subscription on the server.
 */
async function registerSubscriptionOnServer(subscription: PushSubscription, userId: string) {
  try {
    const serverResponse = await fetch(`${PUSH_SERVER_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ subscription, userId }),
    });

    if (serverResponse.ok) {
      console.log('Suscripción registrada en el servidor');
    } else {
      console.error(
        'Error al registrar la suscripción en el servidor:',
        await serverResponse.text()
      );
    }
  } catch (error) {
    console.error('Error al enviar la suscripción al servidor:', error);
    throw error;
  }
}

/**
 * Enables notifications by requesting permission and registering the service worker.
 */
export async function enableNotifications() {
  if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      try {
        const registration = await registerServiceWorker();
        const subscription = await subscribeUserToPushManager(registration);

        const userId = JSON.parse(localStorage.getItem('user') || '{}').userId;

        await registerSubscriptionOnServer(subscription, userId);
        return true;
      } catch (error) {
        console.error('Error during notifications activation:', error);
      }
    } else {
      console.log('Notification permission denied');
    }
  } else {
    console.log('Notificaciones or Service Workers not supported by this browser');
  }
  return false; // Return false if notifications are not enabled
}
