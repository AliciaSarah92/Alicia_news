const { selectArticles, selectArticle } = require('../models/articles.model');

exports.getArticles = (req, res) => {
    selectArticles().then(response => {
        res.status(200).send({ articles: response });
    });
};

exports.getArticle = (req, res) => {
    const { article_id } = req.params;
    if (isNaN(article_id)) {
        res.status(400).send({ msg: 'bad request' });
    }
    selectArticle(article_id).then(article => {
        if (!article) {
            res.status(404).send({ msg: 'record does not exist' });
        }
        res.status(200).send(article);
    });
};
