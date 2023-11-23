const db = require('../db/connection');

exports.selectArticle = article_id => {
    return db
        .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
        .then(data => {
            if (!data.rows.length) {
                return Promise.reject({ status: 404, msg: 'record does not exist' });
            }
            return data.rows[0];
        })
        .catch(error => {
            if (error.code === '22P02') {
                return Promise.reject({ status: 400, msg: 'bad request' });
            }
            throw error;
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
    return db
        .query('SELECT * FROM comments WHERE article_id = $1 ORDER BY comments.created_at DESC;', [article_id])
        .then(data => {
            if (!data.rows.length) {
                return Promise.reject({ status: 404, msg: 'record does not exist' });
            }
            return data.rows;
        })
        .catch(error => {
            if (error.code === '22P02') {
                return Promise.reject({ status: 400, msg: 'bad request' });
            }

            throw error;
        });
};
