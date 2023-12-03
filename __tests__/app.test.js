const request = require('supertest');
const app = require('../app');
const seed = require('../db/seeds/seed');
const db = require('../db/connection');
const testData = require('../db/data/test-data');
const endpoints = require('../endpoints.json');

beforeEach(() => {
    return seed(testData);
});

afterAll(() => {
    return db.end();
});
describe('hits the /api endoint', () => {
    test('should return an object describing all available endpoints', () => {
        return request(app)
            .get('/api')
            .expect(200)
            .then(({ body }) => {
                expect(body).toEqual(endpoints);
            });
    });
});
describe('GET /api/healthcheck', () => {
    test('should return a 200 status code', () => {
        return request(app).get('/api/healthcheck').expect(200);
    });
});
describe('GET /api/topics', () => {
    test('should return a 200 status code', () => {
        return request(app).get('/api/topics').expect(200);
    });
    test('returns an array of topic objects', () => {
        return request(app)
            .get('/api/topics')
            .then(({ body }) => {
                expect(body.topics.length).toBeGreaterThan(0);
                expect(body.topics[0]).toEqual(
                    expect.objectContaining({
                        slug: expect.any(String),
                        description: expect.any(String),
                    })
                );
            });
    });
    test('if GET/api/topics is misplet, should return a 404 status code', () => {
        return request(app).get('/api/topiqs').expect(404);
    });
});
describe('GET /api/articles/id', () => {
    test('return an article by the article_id', () => {
        return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(response => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        article_id: 1,
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                    })
                );
            });
    });
    test('should return a 404 error if route is incorrect', () => {
        return request(app)
            .get('/api/articlez/99')
            .expect(404)
            .then(response => {
                expect(response.error.status).toBe(404);
            });
    });
    test('should return a 400 error if invalid article_id', () => {
        return request(app)
            .get('/api/articles/9hi')
            .expect(400)
            .then(response => {
                expect(response.error.status).toBe(400);
            });
    });
});
describe('GET /api/articles', () => {
    test('should return a 200 status code', () => {
        return request(app).get('/api/articles').expect(200);
    });
    test('returns an array of article objects', () => {
        return request(app)
            .get('/api/articles/')
            .then(({ body }) => {
                expect(body.articles.length).toBeGreaterThan(0);
                body.articles.forEach(article => {
                    expect.objectContaining({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comment_count: expect.any(Number),
                    });
                });
            });
    });
    test('should ensure that the articles are sorted by date in descending order', () => {
        return request(app)
            .get('/api/articles')
            .then(({ body }) => {
                expect(body.articles).toBeSortedBy('created_at', { descending: true });
            });
    });
    test('should return a 404 error if route does not exist', () => {
        return request(app)
            .get('/api/articlez')
            .expect(404)
            .then(response => {
                expect(response.error.status).toBe(404);
            });
    });
});
describe('GET /api/articles/:article_id/comments', () => {
    test('should return a 200 status code', () => {
        return request(app).get('/api/articles/3/comments').expect(200);
    });
    test('should return a 200 if article has no comments', () => {
        return request(app)
            .get('/api/articles/2/comments')
            .expect(200)
            .then(({ body }) => {
                expect(body.comments).toEqual([]);
                expect(body.comments).toHaveLength(0);
            });
    });
    test('should respond with an array of comment objects given the article_id', () => {
        return request(app)
            .get('/api/articles/3/comments')
            .then(({ body }) => {
                expect(body.comments.length).toBeGreaterThan(0);
                body.comments.forEach(comment => {
                    expect.objectContaining({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        article_id: expect.any(Number),
                    });
                });
            });
    });
    test('should ensure that the comments are sorted by date in descending order', () => {
        return request(app)
            .get('/api/articles/3/comments')
            .then(({ body }) => {
                expect(body.comments).toBeSortedBy('created_at', { descending: true });
            });
    });
    test('should return a 400 error if no article_id', () => {
        return request(app)
            .get('/api/articles/9hi/comments')
            .expect(400)
            .then(response => {
                expect(response.error.status).toBe(400);
            });
    });
    test('should return a 404 error if route does not exist', () => {
        return request(app)
            .get('/api/articles/3/commen')
            .expect(404)
            .then(response => {
                expect(response.error.status).toBe(404);
            });
    });
});
describe('POST /api/articles/:article_id/comments', () => {
    test('201: returns the new comment, ignores unnecessary properties', async () => {
        const {
            body: {
                comments: { comment },
            },
        } = await request(app)
            .post('/api/articles/2/comments')
            .send({
                username: 'butter_bridge',
                body: 'hi',
                article_id: 2,
            })
            .expect(201);

        const { rows } = comment;
        const { body, author, comment_id, created_at, votes } = rows[0];

        expect(comment).toBeInstanceOf(Object);
        expect(body).toEqual('hi');
        expect({
            body,
            author,
            comment_id,
            created_at,
            votes,
        }).toEqual(
            expect.objectContaining({
                comment_id: expect.any(Number),
                author: expect.any(String),
                votes: expect.any(Number),
                created_at: expect.any(String),
                body: expect.any(String),
            })
        );
    });
    test('should return a 400 error if no article_id', () => {
        return request(app)
            .post('/api/articles/9hi/comments')
            .expect(400)
            .then(response => {
                expect(response.error.status).toBe(400);
            });
    });
    test('should return a 404 error if route does not exist', () => {
        return request(app)
            .post('/api/articles/3/commen')
            .expect(404)
            .then(response => {
                expect(response.error.status).toBe(404);
            });
    });
    test('should return a 404 error if the username passed does not exist', async () => {
        const response = await request(app)
            .post('/api/articles/3/comments')
            .send({
                username: 'alicia',
                body: 'hi',
                article_id: 2,
            })
            .expect(404);

        const { error } = response.body;
        expect(error.msg).toEqual('username not found');
    });
});
describe('PATCH /api/articles/:article_id', () => {
    test('should update negative votes by article_id', async () => {
        const newVotes = { inc_votes: -9 };

        const response = await request(app).patch('/api/articles/1').send(newVotes).expect(201);

        expect({
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            votes: 91,
            article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
        }).toEqual(response.body.article);
    });
    test('should update positive votes by article_id', async () => {
        const newVotes = { inc_votes: 3 };

        const response = await request(app).patch('/api/articles/1').send(newVotes).expect(201);

        expect({
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            votes: 103,
            article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
        }).toEqual(response.body.article);
    });
    test('should return a 400 error if no article_id', () => {
        return request(app)
            .patch('/api/articles/rgreg')
            .expect(400)
            .then(response => {
                expect(response.error.status).toBe(400);
            });
    });
    test('should return a 400 error if no inc_votes', async () => {
        const response = await request(app).patch('/api/articles/1').send({}).expect(400);
        const { error } = response.body;

        expect(response.error.status).toBe(400);
        expect(error.msg).toBe('incrementor input needed');
    });
    test('should return a 404 error if route does not exist', () => {
        return request(app)
            .patch('/api/articlez/1')
            .expect(404)
            .then(response => {
                expect(response.error.status).toBe(404);
            });
    });
});
describe('DELETE /api/comments/:comment_id', () => {
    test('should delete comment by comment_id', async () => {
        const response = await request(app).delete('/api/comments/1').expect(204);

        expect(response.body).toEqual({});
    });
    test('should return a 404 error if route does not exist', () => {
        return request(app)
            .delete('/api/commentz/1')
            .expect(404)
            .then(response => {
                expect(response.error.status).toBe(404);
            });
    });
    test('should return a 400 error if comment_id does not exist', () => {
        return request(app)
            .delete('/api/comments/hi')
            .expect(400)
            .then(response => {
                expect(response.error.status).toBe(400);
            });
    });
});
describe('GET /api/users', () => {
    test('should return a 200 status code', () => {
        return request(app).get('/api/users').expect(200);
    });
    test('returns an array of user objects', () => {
        return request(app)
            .get('/api/users')
            .then(({ body }) => {
                expect(body.users.length).toBeGreaterThan(0);
                body.users.forEach(user => {
                    expect.objectContaining({
                        username: expect.any(String),
                        avatar_url: expect.any(String),
                        name: expect.any(String),
                    });
                });
            });
    });
    test('should return a 404 error if route does not exist', () => {
        return request(app)
            .get('/api/userz')
            .expect(404)
            .then(response => {
                expect(response.error.status).toBe(404);
            });
    });
})