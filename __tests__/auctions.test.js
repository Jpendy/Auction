const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');
const User = require('../lib/models/User');

const request = require('supertest');
const app = require('../lib/app');

describe('auction routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  let user;
  beforeEach(async() => {
    user = await User.create({
      email: 'jake@jake.com',
      password: 'thisIsPassword'
    });
  });


  it('it creates a new auction', () => {

    return request(app)
      .post('/api/v1/auctions')
      .send({
        user: user.id,
        title: 'auction 1',
        description: 'this is auction 1',
        quantity: 5,
        endDate: Date.now()  
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),  
          user: user.id,
          title: 'auction 1',
          description: 'this is auction 1',
          quantity: 5,
          endDate: expect.any(String),
          __v: 0  
        });
      });
  });
});


