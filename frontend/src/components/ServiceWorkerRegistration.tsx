import { useEffect } from 'react';
import { Workbox } from 'workbox-window';

const ServiceWorkerRegistration = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      const wb = new Workbox('/service-worker.js');

      wb.register()
        .then((registration) => {
          console.log('Service Worker registrado con éxito:', registration);
        })
        .catch((error) => {
          console.error('Error al registrar el Service Worker:', error);
        });

      wb.addEventListener('activated', (event) => {
        if (event.isUpdate) {
          console.log('¡Nuevo Service Worker activado!');
          window.location.reload();
        }
      });

      wb.addEventListener('waiting', (event) => {
        console.log('Hay una nueva versión disponible', event);
      });
    }
  }, []);

  return null;
};

export default ServiceWorkerRegistration;
