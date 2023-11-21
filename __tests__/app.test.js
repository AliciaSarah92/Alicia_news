const request = require('supertest');
const app = require('../app');
const seed = require('../db/seeds/seed');
const db = require('../db/connection');
const testData = require('../db/data/test-data');
const endpoints = require('../endpoints.json')


beforeEach(() => {
    return seed(testData);
});

afterAll(() => {
    return db.end();
});
describe('hits the /api endoint', () => {
    test('should return an object describing all available endpoints', () => {
        return request(app).get('/api').expect(200).then(({body}) => {
            expect(body).toEqual(endpoints)
        })
    })
})
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
describe('GET /api/articles', () => {
    test('should return a 200 status code', () => {
        return request(app).get('/api/articles').expect(200);
    });
    test('returns an array of article objects', () => {
        return request(app)
            .get('/api/articles')
            .then(({ body }) => {
                expect(body.articles.length).toBeGreaterThan(0);
                expect(body.articles[0]).toEqual(
                    expect.objectContaining({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String)
                    })
                );
            });
    });
})
