const express = require('express');
const { getTopics } = require('./controllers/topics.controller');
const endpoints = require('./endpoints.json')

const app = express();

app.use(express.json());

app.get('/api/healthcheck', (req, res) => {
    res.status(200).send({ msg: 'Welcome to Alicia News' });
});

app.get('/api', (req, res) => {
res.status(200).send(endpoints)
});

app.get('/api/topics', getTopics);

app.get('*', (req, res) => {
    res.status(404).send({ msg: 'Page not found' });
});

module.exports = app;
