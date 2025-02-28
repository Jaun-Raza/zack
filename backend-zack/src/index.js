import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cloudflare from 'cloudflare-express'
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

app.set('trust proxy', 1)
app.use(cloudflare.restore());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, '../build')));

app.get('/test', function (req, res, next) {
    res.send("Your IP is: " + req.cf_ip);
    console.log("Your IP is: " + req.ip);
});

// Routes
app.use('/auth', authRoutes);
app.use('/image', imageRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/../build/index.html'));
});

app.listen(port, () => console.log(`Server started on http://localhost:${port}`));