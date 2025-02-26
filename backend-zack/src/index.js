import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import rateLimit from "express-rate-limit"
import cors from 'cors';

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import { promisify } from 'util';
import { pipeline } from 'stream';
const streamPipeline = promisify(pipeline);

import authRoutes from './routes/authRoutes.js';
import imageRoutes from './routes/imageRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

app.set('trust proxy', 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, '../build')));

const apiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: process.env.UPLOADPERHOUR, 
    message: 'Too many requests from this IP, please try again later',
});

// Middleware for preventing spam
app.use('/image/upload', apiLimiter);
app.use((err, req, res, next) => {
    if (err instanceof Error) {
        res.status(429).json({ error: 'Too many requests from this IP, please try again later' });
    } else {
        next(err);
    }
});

// Routes
app.use('/auth', authRoutes);
app.use('/image', imageRoutes);

app.get('/ip', (request, response) => response.send(request.ip))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/../build/index.html'));
});

app.listen(port, () => console.log(`Server started on http://localhost:${port}`));