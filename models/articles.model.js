const db = require('../db/connection');

exports.selectArticle = article_id => {
    return db
        .query(
            `SELECT
        articles.article_id,
        articles.author,
        articles.body,
        articles.title,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COUNT(comments.comment_id) AS comment_count
      FROM
        articles
      LEFT JOIN
        comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY
        articles.article_id;`,
            [article_id]
        )
        .then(data => {
            return data.rows[0];
        })
        .catch(error => {
            throw error;
        });
};

exports.selectArticles = data => {
    const { topic, sort_by, order } = data;
    let params = [];
    let query = `SELECT
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
    comments ON articles.article_id = comments.article_id `;

    if (topic) {
        params.push(topic);
        query += `WHERE
        articles.topic = $1 `;
    }
    
    query += `GROUP BY
    articles.article_id`;
    
    if(order && sort_by) {
        query += ` ORDER BY articles.${sort_by || 'articles.created_at'} ${order || 'DESC'}`;
        params.push(sort_by);
        params.push(order);
    }
    if(!sort_by && !order) {
        query += ` ORDER BY articles.created_at DESC`;
    }
    console.log(query, params)
    return db.query(query, params).then(data => {
        return data.rows;
    });
};

exports.selectComments = article_id => {
    return db
        .query('SELECT * FROM comments WHERE article_id = $1 ORDER BY comments.created_at DESC;', [article_id])
        .then(data => {
            return data.rows;
        })
        .catch(error => {
            throw error;
        });
};
exports.createComment = newComment => {
    const { username, body, article_id } = newComment;

    const query = `INSERT INTO comments (author, article_id, body) 
    VALUES ($1, $2, $3) 
    RETURNING *
    `;
    const values = [username, article_id, body];

    return db
        .query(query, values)
        .then(comment => ({ comment }))
        .catch(error => {
            throw error;
        });
};
exports.updateVotes = async newVotes => {
    const { votes, article_id } = newVotes;
    let votesCount = 0;

    const article = await this.selectArticle(article_id);
    if (votes < 0) {
        votesCount = article.votes += votes;
    } else {
        votesCount = article.votes + votes;
    }

    return db.query(`UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING article_id, title, topic, author, body, votes, article_img_url;`, [votesCount, article_id]).then(({ rows }) => {
        return rows[0];
    });
};
exports.deleteComment = comment_id => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id]);
};
