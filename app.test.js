const app = require('../app');
const expect = require('chai').expect;
const request = require('supertest');

describe('Express App', () => {
    it('GET / should return a message', () => {
      return request(app)
        .get('/')
        .expect(200, 'Hello Express!');
    });
});
