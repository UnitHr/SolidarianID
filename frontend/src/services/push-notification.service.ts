import { urlBase64ToUint8Array } from '../utils/base64Utils';

export async function registerServiceWorker() {
  try {
    const registration = await navigator.serviceWorker.register('/javascripts/sw.js');
    console.log('Service Worker registrado:', registration);
    return registration;
  } catch (error) {
    console.error('Error al registrar el Service Worker:', error);
    throw error;
  }
}

export async function subscribeUserToPushManager(registration: ServiceWorkerRegistration) {
  try {
    const response = await fetch('http://localhost:4000/push/vapidPublicKey', {
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

export async function registerSubscriptionOnServer(
  subscription: PushSubscription,
  userId: string,
  userRoles: string[]
) {
  try {
    const serverResponse = await fetch('http://localhost:4000/push/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ subscription, userId, userRoles }),
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
