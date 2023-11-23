const express = require('express');
const { getTopics } = require('./controllers/topics.controller');
const { getApi, getApiHealthCheck } = require('./controllers/api.controller');
const { Four0Four, handleCustomErrors, handlePsqlErrors, handleServerErrors } = require('./controllers/errors.controller');
const { getArticles, getArticle, getComments } = require('./controllers/articles.controller');

const app = express();

app.use(express.json());

app.get('/api/healthcheck', getApiHealthCheck);
app.get('/api', getApi);
app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticle);
app.get('/api/articles/:article_id/comments', getComments);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

app.get('*', Four0Four);

module.exports = app;
