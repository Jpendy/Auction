const mongoose = require('mongoose');

const schema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  quantity: {
    type: Number,
    required: true
  },

  endDate: {
    type: Date,
    required: true
  }

});

module.exports = mongoose.model('Auction', schema);
