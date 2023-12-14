const { selectUser } = require('../models/users.model');
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
    if (req.query['sort_by'] && req.query['order']) {
        let { topic, sort_by, order } = req.query;
        selectArticles({ topic: topic, sort_by: sort_by, order: order }).then(response => {
            res.status(200).send({ articles: response });
        });
    } else {
        if (Object.keys(req.query).length && !req.query['topic']) {
            return res.status(400).json({
                error: {
                    msg: 'invalid query',
                },
            });
        }
        let { topic } = req.query;
        selectArticles({ topic:topic, sort_by: false, order: false}).then(response => {
            res.status(200).send({ articles: response });
        });
    }
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
    const user = await selectUser(username).then(user => {
        return user;
    });
    return !!user;
};

exports.postComment = async (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;
    const newComment = { username, body, article_id };

    if (username) {
        const validUser = await this.usernameExists(username);
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
