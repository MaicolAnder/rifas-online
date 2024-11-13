import { Router, Request, Response } from 'express';
import { body, param } from 'express-validator';
import { getDatabase } from '../database/database';
import { validateRequest } from '../middleware/validate-request';

const router = Router();
const db = getDatabase();

// Get all tickets
router.get('/', async (req: Request, res: Response) => {
  try {
    const tickets = await new Promise<any[]>((resolve, reject) => {
      db.all('SELECT * FROM tickets', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    res.json(tickets);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error retrieving tickets' });
  }
});

// Select a ticket
router.post(
  '/:numero/select',
  [
    param('numero').isInt({ min: 1, max: 100 }),
    validateRequest
  ],
  async (req: Request, res: Response) => {
    const numero = parseInt(req.params.numero);

    try {
      const result = await new Promise<{ changes: number }>((resolve, reject) => {
        db.run(
          'UPDATE tickets SET estado = ?, fecha_seleccion = CURRENT_TIMESTAMP WHERE numero = ? AND estado = ?',
          ['seleccionado', numero, 'disponible'],
          function (err) {
            if (err) reject(err);
            else resolve({ changes: this.changes });
          }
        );
      });

      if (result.changes === 0) {
        return res.status(409).json({ error: 'Ticket not available' });
      }

      res.json({ message: 'Ticket selected successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error selecting ticket' });
    }
  }
);

// Confirm ticket purchase
router.post(
  '/:numero/confirm',
  [
    param('numero').isInt({ min: 1, max: 100 }),
    body('userId').isInt(),
    validateRequest
  ],
  async (req: Request, res: Response) => {
    const numero = parseInt(req.params.numero);
    const { userId } = req.body;

    try {
      const result = await new Promise<{ changes: number }>((resolve, reject) => {
        db.run(
          'UPDATE tickets SET estado = ?, user_id = ?, fecha_pago = CURRENT_TIMESTAMP WHERE numero = ? AND estado = ?',
          ['pagado', userId, numero, 'seleccionado'],
          function (err) {
            if (err) reject(err);
            else resolve({ changes: this.changes });
          }
        );
      });

      if (result.changes === 0) {
        return res.status(409).json({ error: 'Invalid ticket state' });
      }

      res.json({ message: 'Ticket confirmed successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error confirming ticket' });
    }
  }
);

export const ticketRoutes = router;
