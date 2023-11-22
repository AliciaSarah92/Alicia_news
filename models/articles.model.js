const db = require('../db/connection');

exports.selectArticles = () => {
    return db.query(`SELECT * FROM articles;`).then(data => {
        return data.rows;
    });
};
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
