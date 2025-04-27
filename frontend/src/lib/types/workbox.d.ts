declare global {
  // Aseguramos que __WB_MANIFEST sea del tipo correcto (un array de archivos)
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    __WB_MANIFEST: Array<any>;
  }
}

// Esto permite que TypeScript reconozca el tipo de __WB_MANIFEST.
export {};
