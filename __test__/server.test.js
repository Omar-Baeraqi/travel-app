const request = require('supertest');
const server = require('../src/server/server');

describe("Testing the server status", () => {
    test("Testing the server response", async () => {
        const response = await request('http://localhost:8000').get('/');
        expect(response.statusCode).toBe(200);
    })
});