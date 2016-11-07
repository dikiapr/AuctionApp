'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Article Schema
 */
var AuctionSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  desc: {
    type: String,
    default: '',
    required: 'Desc cannot be blank'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  coverImageURL: {
    type: String,
    default: 'modules/auctions/client/img/profile/default.png'
  }
});

mongoose.model('Auction', AuctionSchema);
