const db = require('../db/connection');

exports.selectArticles = () => {
    return db.query(`SELECT * FROM articles;`).then(data => {
        return data.rows;
    });
};
exports.selectArticle = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id]).then(data => {
        return data.rows[0];
    });
};
