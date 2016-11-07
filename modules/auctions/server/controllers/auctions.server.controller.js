'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Auction = mongoose.model('Auction'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


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
