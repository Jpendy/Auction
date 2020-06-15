const mongoose = require('mongoose');

const schema = new mongoose.Schema({

  auction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction',
    required: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  price: {
    type: String,
    required: true
  },

  quantity: {
    type: Number,
    required: true
  },

  accepted: {
    type: String,
    required: true
  }

});

module.exports = mongoose.model('Bid', schema);
