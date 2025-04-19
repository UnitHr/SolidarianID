import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

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

async function seedUsers() {
  try {
    await client.connect();
    console.log('📡 Conectado a PostgreSQL');

    const jsonPath = path.join(__dirname, 'usuarios_solidarios.json');
    const data: Usuario[] = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    for (const user of data) {
      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(user.password, 10);

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
          uuidv4(),
          user.firstName,
          user.lastName,
          new Date(user.birthDate),
          user.email,
          hashedPassword, // Contraseña encriptada
          user.bio ?? 'No bio available',
          user.showAge,
          user.showEmail,
          'user', // Rol por defecto
        ],
      );
    }

    console.log('✅ Usuarios insertados correctamente');
  } catch (error) {
    console.error('❌ Error insertando usuarios:', error);
  } finally {
    await client.end();
    console.log('🔌 Conexión cerrada');
  }
}

seedUsers();