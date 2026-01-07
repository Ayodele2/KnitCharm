import express from 'express';
import path from 'path';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import { clerkMiddleware } from "@clerk/express";

const app = express();

const __dirname = path.resolve();

app.use(clerkMiddleware()) // adds auth object under the req => req.auth 

app.get('/api/login', (req, res) => {
    res.send('Hello World!');
});

// make app ready for deployment 
if (ENV.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "../admin/dist")));

    app.get(/.*/, (req, res) => {
        res.sendFile(path.join(__dirname, "../admin", "dist", "index.html"));
    });
}

app.listen(ENV.PORT, () => {
    console.log(`Server is running on port ${ENV.PORT}`);
    connectDB();
});