const users = require('../db/data/test-data/users');
const { selectArticles, selectArticle, selectComments, createComment, updateVotes, deleteComment } = require('../models/articles.model');

exports.getArticle = (req, res, next) => {
    const { article_id } = req.params;

    selectArticle(article_id)
        .then(article => {
            res.status(200).send(article);
        })
        .catch(next);
};

exports.getArticles = (req, res) => {
    if (Object.keys(req.query).length && !req.query['topic']) {
        return res.status(400).json({
            error: {
                msg: 'invalid query',
            },
        });
    }
    const { topic } = req.query;
    selectArticles(topic).then(response => {
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

exports.usernameExists = async username => {
    const user = users.find(user => user.username === username);
    return !!user;
};

exports.postComment = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;
    const newComment = { username, body, article_id };
    console.log(username)

    if (username) {
        const validUser = this.usernameExists(username);
        console.log(validUser)
        if (!validUser) {
            return res.status(404).json({
                error: {
                    msg: 'username not found',
                },
            });
        }
    }
    createComment(newComment)
        .then(response => {
            res.status(201).json({ comments: response });
        })
        .catch(next);
};
exports.updatedVotes = async (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;

    if (!inc_votes) {
        return res.status(400).json({
            error: {
                msg: 'incrementor input needed',
            },
        });
    }

    updateVotes({ votes: inc_votes, article_id: article_id })
        .then(response => {
            res.status(201).json({ article: response });
        })
        .catch(next);
};

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params;

    if (!comment_id) {
        return res.status(400).json({
            error: {
                msg: 'incrementor input needed',
            },
        });
    }

    deleteComment(comment_id)
        .then(response => {
            res.status(204).json({ comment: response });
        })
        .catch(next);
};
