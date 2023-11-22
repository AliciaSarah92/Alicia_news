const { selectArticles, selectArticle } = require('../models/articles.model');

exports.getArticles = (req, res) => {
    selectArticles().then(response => {
        res.status(200).send({ articles: response });
    });
};

exports.getArticle = (req, res, next) => {
    const { article_id } = req.params;

    selectArticle(article_id)
        .then(article => {
            res.status(200).send(article);
        })
        .catch(next);
};
