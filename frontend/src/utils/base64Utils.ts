export function urlBase64ToUint8Array(base64String: string) {
  if (!base64String) {
    throw new Error('El valor de base64String está vacío o es inválido.');
  }

  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  try {
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  } catch (error) {
    console.error('Error al decodificar Base64:', error);
    throw new Error('El valor de base64String no es válido.');
  }
}
