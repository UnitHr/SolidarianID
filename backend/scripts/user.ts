import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

interface Usuario {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  password: string;
  bio?: string;
  showAge: boolean;
  showEmail: boolean;
}

const client = new Client({
  user: 'admin',
  host: 'localhost',
  database: 'solidarianid',
  password: 'admin',
  port: 5432,
});

async function seed() {
  try {
    await client.connect();
    console.log('📡 Conectado a PostgreSQL');

    const jsonPath = path.join(__dirname, 'usuarios_solidarios.json');
    const data: Usuario[] = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    for (const u of data) {
      await client.query(
        `
        INSERT INTO "user" (
          id,
          "firstName",
          "lastName",
          "birthDate",
          email,
          password,
          bio,
          "showAge",
          "showEmail",
          role
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (email) DO NOTHING
        `,
        [
          uuidv4(), // Generamos un UUID para el id
          u.firstName,
          u.lastName,
          new Date(u.birthDate), // Convertimos la fecha a objeto Date
          u.email,
          u.password,
          u.bio ?? 'No bio available',
          u.showAge,
          u.showEmail,
          'user', // rol por defecto
        ],
      );
    }

    console.log('✅ Usuarios insertados correctamente');
  } catch (err) {
    console.error('❌ Error insertando usuarios:', err);
  } finally {
    await client.end();
    console.log('🔌 Conexión cerrada');
  }
}

seed();
