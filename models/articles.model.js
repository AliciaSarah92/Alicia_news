const db = require('../db/connection');

exports.selectArticle = article_id => {
    if (isNaN(article_id)) {
        return Promise.reject({ status: 400, msg: 'bad request' });
    }
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id]).then(data => {
        if (!data.rows.length) {
            return Promise.reject({ status: 404, msg: 'record does not exist' });
        }
        return data.rows[0];
    });
};

exports.selectArticles = () => {
    return db.query(`SELECT * FROM articles;`).then(data => {
        return data.rows;
    });
};

exports.selectArticlesWithoutBody = () => {
    return db
        .query(
            `SELECT
  articles.article_id,
  articles.author,
  articles.title,
  articles.topic,
  articles.created_at,
  articles.votes,
  articles.article_img_url,
  COUNT(comments.comment_id) AS comment_count
FROM
  articles
LEFT JOIN
  comments ON articles.article_id = comments.article_id
GROUP BY
  articles.article_id
ORDER BY
  articles.created_at DESC`
        )
        .then(data => {
            return data.rows;
        });
};
exports.selectComments = article_id => {
    if (isNaN(article_id)) {
        return Promise.reject({ status: 400, msg: 'bad request' });
    }
    return db.query('SELECT * FROM comments WHERE article_id = $1;', [article_id])
        .then(data => {
            if (!data.rows.length) {
                return Promise.reject({ status: 404, msg: 'record does not exist' });
            }
            return data.rows;
        });
};
