'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  AuctionItem = mongoose.model('AuctionItem'),
  AuctionBid = mongoose.model('AuctionBid'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an bid
 */
exports.create = function (req, res) {
  var bid = new AuctionBid(req.body);
  if (req.auction) {
    bid.auctionItem = req.auction;
  }
  bid.user = req.user;
  bid.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      AuctionItem.findOneAndUpdate({ _id: bid.auctionItem }, { lastBidValue: bid.value, lastBidDate: bid.created }, function (err, doc) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(bid);
        }
      });
    }
  });
};


/**
 * List of bid
 */
exports.index = function (req, res) {
  var query = {};
  if (req.query) {
    query = req.query;
    // FIX THIS
    if (query.hasOwnProperty('auctionItem') && typeof query.auctionItem === 'string') {
      query.auctionItem = JSON.parse(query.auctionItem);
    }
  }
  if (req.auctionItem) query.auctionItem = { _id: req.auction._id };

  AuctionBid.find(query).sort('-value').populate('user', 'displayName profileImageURL').populate('auctionItem', '_id').exec(function (err, items) {
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
exports.bidByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Bid is invalid'
    });
  }

  AuctionBid.findById(id).exec(function (err, bid) {
    if (err) {
      return next(err);
    } else if (!bid) {
      return res.status(404).send({
        message: 'No bid with that identifier has been found'
      });
    }
    req.bid = bid;
    next();
  });
};
