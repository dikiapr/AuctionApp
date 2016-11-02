'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  AuctionItem = mongoose.model('AuctionItem'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an article
 */
exports.create = function (req, res) {
  var auction = new AuctionItem(req.body);

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
 Update an auction
 */
exports.update = function (req, res) {
  var auction = req.auction;

  auction.name = req.body.title;
  auction.closed = new Date(req.body.closed);
  auction.minBid = req.body.minBid;

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
 * List of auction
 */
exports.index = function (req, res) {
  AuctionItem.find().sort('-closed').exec(function (err, items) {
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
 * Acution middleware
 */
exports.auctionByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Auction is invalid'
    });
  }

  AuctionItem.findById(id).exec(function (err, auction) {
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
