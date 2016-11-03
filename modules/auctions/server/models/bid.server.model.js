'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Article Schema
 */
var BidSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  value: {
    type: Number,
    default: '',
    required: 'Price cannot be blank'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  auctionItem: {
    type: Schema.ObjectId,
    ref: 'AuctionItem'
  }
});

mongoose.model('AuctionBid', BidSchema);
