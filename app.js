const express = require('express');
const { getTopics } = require('./controllers/topics.controller');
const { getApi, getApiHealthCheck } = require('./controllers/api.controller');
const { Four0Four, handleCustomErrors, handlePsqlErrors, handleServerErrors } = require('./controllers/errors.controller');
const { getArticles, getArticle, updatedVotes, getComments, postComment } = require('./controllers/articles.controller');

const app = express();

app.use(express.json());

app.get('/api/healthcheck', getApiHealthCheck);
app.get('/api', getApi);
app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticle);
app.get('/api/articles/:article_id/comments', getComments);

app.post('/api/articles/:article_id/comments', postComment)
app.patch('/api/articles/:article_id', updatedVotes)

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

app.get('*', Four0Four);

module.exports = app;
