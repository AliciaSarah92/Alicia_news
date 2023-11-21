const request = require('supertest');
const app = require('../app');
const seed = require('../db/seeds/seed');
const db = require('../db/connection');
const topics = require('../db/data/test-data');

beforeEach(() => {
    return seed(topics);
});

afterAll(() => {
    return db.end();
});
describe('hits the /api endoint', () => {
    test('should return a 200 status code', () => {
        return request(app).get('/api').expect(200);
    });
    test("should return an object describing all available endpoints", () => {
        return request(app).get('/api').then(({body}) => {
            expect(body).toBe(body)
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
