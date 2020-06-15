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

}, {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id;
      delete ret.__v;
    }
  }
}
);

schema.virtual('bids', {
  ref: 'Bid',
  localField: '_id',
  foreignField: 'auction'
});

module.exports = mongoose.model('Auction', schema);
