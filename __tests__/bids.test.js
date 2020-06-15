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

  it('it creates a new bid, or updates it if it already exists', () => {

    return request(app)
      .post('/api/v1/bids')
      .auth('jake@jake.com', 'thisIsPassword')
      .send({
        auction: auction.id,
        user: user.id,
        price: '$10',
        quantity: 5,
        accepted: true 
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: bid.id,  
          auction: auction.id,
          user: user.id,
          price: '$10',
          quantity: 5,
          accepted: true,
          __v: 0 
        });          
      });

  });

  it('it gets a bid by id with GET and populates user and auction and selects price and quantity', () => {
      
    return request(app)
      .get(`/api/v1/bids/${bid._id}`)
      .auth('jake@jake.com', 'thisIsPassword')
      .then(res =>
        expect(res.body).toEqual({
          _id: expect.anything(),
          auction:  {
            _id: expect.anything(),
            description: 'this is auction 1',
            endDate: expect.any(String),
            quantity: 5,
            title: 'auction 1',
            user: user.id,
          },
          price: '$5',
          quantity: 5,
          user:  {
            _id: user.id,
            email: 'jake@jake.com',
          }
        })
      );
  });

});
