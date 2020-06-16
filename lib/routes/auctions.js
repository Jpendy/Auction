const { Router } = require('express');
const Auction = require('../models/Auction');
const { ensureAuth } = require('../middleware/ensureAuth');

module.exports = Router()

  .post('/', ensureAuth, (req, res, next) => {
    Auction
      .create({
        ...req.body,
        user: req.user._id })
      .then(auction => res.send(auction))
      .catch(next);
  })

  .get('/', ensureAuth, (req, res, next) => {
    Auction
      .find()
      .then(auction => res.send(auction))
      .catch(next);
  })

  .get('/:id', ensureAuth, (req, res, next) => {
    Auction
      .findById(req.params.id)
      .populate('user')
      .populate('bids')
      .then(auction => res.send(auction))
      .catch(next);
  });
     
