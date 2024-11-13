import sqlite3 from 'sqlite3';
import { Database } from 'sqlite3';

let db: Database | null = null;

// Función para inicializar la base de datos
export async function initializeDatabase(): Promise<void> {
  console.log('Staring database')
  return new Promise<void>((resolve, reject) => {
    db = new sqlite3.Database('raffle.db', (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
        return;
      }

      createTables()
        .then(resolve)
        .catch(reject);
    });
  });
}

// Crear tablas
async function createTables(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }

    db.serialize(() => {
      // Tabla de usuarios
      db?.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombres TEXT NOT NULL,
          apellidos TEXT NOT NULL,
          correo TEXT NOT NULL UNIQUE,
          telefono TEXT NOT NULL,
          identificacion TEXT NOT NULL UNIQUE,
          tipo_identificacion TEXT NOT NULL,
          fecha_nacimiento TEXT NOT NULL,
          ubicacion TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Error creating users table:', err);
          reject(err);
        }
      });

      // Tabla de tickets
      db?.run(`
        CREATE TABLE IF NOT EXISTS tickets (
          numero INTEGER PRIMARY KEY,
          estado TEXT NOT NULL,
          user_id INTEGER,
          fecha_seleccion DATETIME,
          fecha_pago DATETIME,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `, (err) => {
        if (err) {
          console.error('Error creating tickets table:', err);
          reject(err);
        }
      });

      // Inicializar tickets si la tabla está vacía
      db?.get('SELECT COUNT(*) as count FROM tickets', (err, row: any) => {
        if (err) {
          console.error('Error checking tickets:', err);
          reject(err);
          return;
        }

        if (row.count === 0) {
          const stmt = db?.prepare('INSERT INTO tickets (numero, estado) VALUES (?, ?)');
          for (let i = 1; i <= 100; i++) {
            stmt?.run(i, 'disponible', (err: any) => {
              if (err) {
                console.error('Error inserting ticket:', err);
                reject(err);
                return;
              }
            });
          }
          stmt?.finalize();
        }
        resolve();
      });
    });
  });
}

// Función para obtener la base de datos
export function getDatabase(): Database {
  initializeDatabase();
  if (!db) {
    throw new Error('Database not initialized error. Call initializeDatabase() first.');
  }

  return db;
}
