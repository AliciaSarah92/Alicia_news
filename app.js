const express = require('express');
const { getTopics } = require('./controllers/topics.controller');
const { getApi, getApiHealthCheck } = require('./controllers/api.controller');
const { Four0Four, handleCustomErrors, handlePsqlErrors, handleServerErrors } = require('./controllers/errors.controller');
const { getArticles, getArticle, updatedVotes, getComments, postComment, deleteComment } = require('./controllers/articles.controller');
const { getUsers } = require('./controllers/users.controller'); 
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

app.get('/api/healthcheck', getApiHealthCheck);
app.get('/api', getApi);
app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticle);
app.get('/api/articles/:article_id/comments', getComments);
app.get('/api/users', getUsers)

app.post('/api/articles/:article_id/comments', postComment)
app.patch('/api/articles/:article_id', updatedVotes)
app.delete('/api/comments/:comment_id', deleteComment)

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

app.get('*', Four0Four);

module.exports = app;
