'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Auction = mongoose.model('Auction'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Show the current article
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var auction = req.auction ? req.auction.toJSON() : {};

  // Add a custom field to the auction, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the auction model.
  auction.isCurrentUserOwner = !!(req.user && auction.user && auction.user._id.toString() === req.user._id.toString());

  res.json(auction);
};

/**
 * List of bid
 */
exports.index = function (req, res) {

  Auction.find().sort('-created').populate('user', 'displayName').exec(function (err, items) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(items);
    }
  });
};

/**
 * Create an auction
 */
exports.create = function (req, res) {
  var auction = new Auction(req.body);
  auction.user = req.user;

  auction.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(auction);
    }
  });
};

/**
 * Delete an auction
 */
exports.delete = function (req, res) {
  var auction = req.auction;

  auction.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(auction);
    }
  });
};

/**
 * Auction middleware
 */
exports.auctionByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Auction is invalid'
    });
  }

  Auction.findById(id).populate('user', 'displayName').exec(function (err, auction) {
    if (err) {
      return next(err);
    } else if (!auction) {
      return res.status(404).send({
        message: 'No auction with that identifier has been found'
      });
    }
    req.auction = auction;
    next();
  });
};
