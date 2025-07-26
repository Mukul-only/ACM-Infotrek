import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import logger from './utils/logger.js';
import connectDB from './utils/db.js';
import authRoutes from './routes/auth.route.js';
import adminRoutes from './routes/admin.route.js';
import registerRoutes from './routes/register.route.js';
import {connectRedis} from './utils/redis-client.js'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; 
connectDB();
logger.info('Database connection established');

connectRedis();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Middleware for routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/event', registerRoutes);

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Node.js server!');
});

// Start the server
app.listen(PORT, () => {
    logger.info('Server is starting...');
    console.log(`Server is running on http://localhost:${PORT}`);
});