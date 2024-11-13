import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './database/database';
import { ticketRoutes } from './routes/ticket.routes';
import { userRoutes } from './routes/user.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Configure CORS for Angular frontend
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// Initialize database
let dbInit =  initializeDatabase();
console.log('Init DB',dbInit)

// Routes
app.use('/api/tickets', ticketRoutes);
app.use('/api/users', userRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Accepting requests from ${process.env.FRONTEND_URL}`);
});
