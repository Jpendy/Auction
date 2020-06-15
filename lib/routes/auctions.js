const { Router } = require('express');
const Auction = require('../models/Auction');

module.exports = Router()

  .post('/', (req, res, next) => {
    Auction
      .create(req.body)
      .then(auction => res.send(auction))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Auction
      .find()
      .then(auction => res.send(auction))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Auction
      .findById(req.params.id)
      .populate('user')
      .populate('bids')
      .then(auction => res.send(auction))
      .catch(next);
  });
     
