const { selectArticles } = require('../models/articles.model');

exports.getArticles = (req, res) => {
    selectArticles()
        .then(response => {
            res.status(200).send({ articles: response });
        })
};
