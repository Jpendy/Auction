const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');

const User = require('../lib/models/User');
const Auction = require('../lib/models/Auction');
const Bid = require('../lib/models/Bid');

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
  let auction;
  let bid;

  beforeEach(async() => {
    user = await User.create({
      email: 'jake@jake.com',
      password: 'thisIsPassword'
    });

    auction = await Auction.create({
      user: user.id,
      title: 'auction 1',
      description: 'this is auction 1',
      quantity: 5,
      endDate: Date.now()  
    });

    bid = await Bid.create({
      auction: auction.id,
      user: user.id,
      price: '$5',
      quantity: 5,
      accepted: true  
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
        });
      });
  });

  it('it gets an auction by id and populates the user and lists all bids', () => {
      
    return request(app)
      .get(`/api/v1/auctions/${auction._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),  
          user: user.id,
          title: 'auction 1',
          description: 'this is auction 1',
          quantity: 5,
          endDate: expect.any(String),
          user: { 
            _id: user.id,
            email: 'jake@jake.com',
          },
          bids: [{
            _id: bid.id,
            accepted: true,
            auction: auction.id,
            price: '$5',
            quantity: 5,
            user: user.id,
            __v: 0
          }]  
        });
      });
  });

  it('it gets all auctions with GET', () => {
      
    return request(app)
      .get('/api/v1/auctions')
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.anything(),  
          user: user.id,
          title: 'auction 1',
          description: 'this is auction 1',
          quantity: 5,
          endDate: expect.any(String),
        }]);
      });

  });
});


