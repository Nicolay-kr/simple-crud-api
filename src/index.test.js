const { server } = require('./index.js');
const request = require('supertest');
const dbJSON = require('../db.json');

const testserver = server;

// data base
const persons = {
  "persons": [
    {
      "id": "f64ff3fb-cb55-4377-a214-de628786e7ce",
      "name": "Dmitri",
      "age": 30,
      "hobbies":["fishing","football"] 
    },
    {
      "id": "f58d44b2-1fc4-4a5b-9163-6256812038df",
      "name": "Nicolay",
      "age": 35,
      "hobbies":["table tennis","walking","table games"] 
    },
    {
      "id": "76f6fe64-925b-4eb6-92f3-350ebc0fabb8",
      "name": "Olga",
      "age": 25,
      "hobbies":["shoping","cinema"] 
    }
  ]
};

describe('Test server', () => {
  afterAll(() => {
    testserver.close();
  });

  test('Get request should returns status 200', async () => {
    const response = await request(testserver).get('/person');
    expect(response.status).toBe(200);

  });

  test('Get request shoul return person', async () => {
    const response = await request(testserver).get(
      '/person/f64ff3fb-cb55-4377-a214-de628786e7ce'
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      "id": 'f64ff3fb-cb55-4377-a214-de628786e7ce',
      "name": 'Dmitri',
      "age": 30,
      "hobbies": ['fishing', 'football'],
    });
  });

  test('DELETE request should delete person and return all users', async () => {
    const response = await request(testserver).delete('/person/f64ff3fb-cb55-4377-a214-de628786e7ce');
    expect(response.status).toBe(204);
  });
});