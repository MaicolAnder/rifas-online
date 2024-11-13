import { Router } from 'express';
import { body } from 'express-validator';
import { getDatabase } from '../database/database';
import { validateRequest } from '../middleware/validate-request';

const router = Router();
const db = getDatabase();

// Create user
router.post(
  '/',
  [
    body('nombres').notEmpty(),
    body('apellidos').notEmpty(),
    body('correo').isEmail(),
    body('telefono').notEmpty(),
    body('identificacion').notEmpty(),
    body('tipo_identificacion').isIn(['CC', 'CE', 'PASAPORTE']),
    body('fecha_nacimiento').isISO8601(),
    body('ubicacion').notEmpty(),
    validateRequest
  ],
  (req: any, res: any) => {
    const user = req.body;

    db.run(
      `INSERT INTO users (
        nombres, apellidos, correo, telefono,
        identificacion, tipo_identificacion,
        fecha_nacimiento, ubicacion
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.nombres,
        user.apellidos,
        user.correo,
        user.telefono,
        user.identificacion,
        user.tipo_identificacion,
        user.fecha_nacimiento,
        user.ubicacion
      ],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({
              error: 'User with this email or identification already exists'
            });
          }
          return res.status(500).json({ error: 'Error creating user' });
        }
        res.status(201).json({ id: this.lastID });
      }
    );
  }
);

// Get user by ID
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM users WHERE id = ?', [req.params.id], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Error retrieving user' });
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  });
});

export const userRoutes = router;
