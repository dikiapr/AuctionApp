'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Article Schema
 */
var AuctionItemSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  closed: {
    type: Date,
    default: '',
    required: 'Date cannot be blank'
  },
  minBid: {
    type: Number,
    default: '',
    required: 'Price cannot be blank'
  },
  status: {
    type: String,
    default: 'open'
  },
  closedAt: {
    type: Date,
    default: ''
  },
  lastBidValue: {
    type: Number,
    default: '',
    required: 'Price cannot be blank'
  },
  lastBidDate: {
    type: Date,
    default: Date.now
  },
  bids: {
    type: Schema.Types.ObjectId,
    ref: 'Bid'
  },
  coverImageURL: {
    type: String,
    default: 'modules/auctions/client/img/profile/default.png'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  auction: {
    type: Schema.ObjectId,
    ref: 'Auction'
  }
});

mongoose.model('AuctionItem', AuctionItemSchema);
