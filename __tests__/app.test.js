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
    test('should return a 404 error if incorrect article_id does not exist', () => {
        return request(app)
            .get('/api/articles/99')
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
                body.articles.forEach((article) => {
                    expect.objectContaining({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comment_count: expect.any(Number) 
                    }) 
                });
            });
    });
    test('should ensure that the articles are sorted by date in descending order', () => {
        return request(app)
        .get('/api/articles').then(({body}) => {
            expect(body.articles).toBeSortedBy('created_at', {descending: true})
        })
    })
    test('should return a 404 error if route does not exist', () => {
        return request(app)
            .get('/api/articlez')
            .expect(404)
            .then(response => {
                expect(response.error.status).toBe(404);
            });
    });
});
