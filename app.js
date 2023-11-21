const express = require('express');
const { getTopics } = require('./controllers/topics.controller');
const { getApi, getApiHealthCheck } = require('./controllers/api.controller');
const { Four0Four } = require('./controllers/errors.controller');
const { getArticles } = require('./controllers/articles.controller');

const app = express();

app.use(express.json());

app.get('/api/healthcheck', getApiHealthCheck);
app.get('/api', getApi);
app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('*', Four0Four);

module.exports = app;
