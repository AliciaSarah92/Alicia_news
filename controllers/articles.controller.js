const { response } = require('../app');
const comments = require('../db/data/test-data/comments');
const { selectArticles, selectArticle, selectComments, createComment } = require('../models/articles.model');

exports.getArticle = (req, res, next) => {
    const { article_id } = req.params;

    selectArticle(article_id)
        .then(article => {
            res.status(200).send(article);
        })
        .catch(next);
};

exports.getArticles = (req, res) => {
    selectArticles().then(response => {
        res.status(200).send({ articles: response });
    });
};

exports.getComments = (req, res, next) => {
    const { article_id } = req.params;

    selectComments(article_id)
        .then(response => {
            res.status(200).send({ comments: response });
        })
        .catch(next);
};
exports.postComment = async (req, res, next) => {
        const { article_id } = req.params;
        const { username, body } = req.body;
        const newComment = { username, body, article_id };
    
        createComment(newComment)
        .then((response) => {
            res.status(201).json({comments: response})
        })
        .catch(next)
    } 
    
