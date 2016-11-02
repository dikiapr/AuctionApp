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
  }
});

mongoose.model('AuctionItem', AuctionItemSchema);
