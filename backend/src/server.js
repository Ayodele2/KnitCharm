import express from 'express';

const app = express();

app.get('/api/login', (req, res) => {
    res.send('Hello World!');
});

app.listen(3000, () => {
    console.log("Server is up and running");
});