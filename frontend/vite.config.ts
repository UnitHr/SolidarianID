import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
//import fs from 'fs';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  /* server: {
    https: {
      key: fs.readFileSync('clave_privada.pem'),
      cert: fs.readFileSync('certificado_autofirmado.pem'),
    },
  }, */
});
