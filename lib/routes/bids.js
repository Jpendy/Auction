const { Router } = require('express');
const Bid = require('../models/Bid');
const { ensureAuth } = require('../middleware/ensureAuth');
module.exports = Router()

  .post('/', ensureAuth, (req, res, next) => {
    Bid
      .findOneAndUpdate({ auction: req.body.auction, user: req.body.user }, { ...req.body, user: req.user._id }, { new: true, upsert: true })
      .then(bid => res.send(bid))
      .catch(next);
  })

  .get('/:id', ensureAuth, (req, res, next) => {
    Bid
      .findById(req.params.id)
      .select({
        price: true,
        quantity: true
      })
      .populate('user')
      .populate('auction')
     
      .then(bid => res.send(bid))
      .catch(next);       
  });
