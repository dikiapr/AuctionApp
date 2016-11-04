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
 * Create an article
 */
exports.create = function (req, res) {
  var auction = new AuctionItem(req.body);
  auction.user = req.user;
  auction.lastBidValue = auction.minBid;
  auction.lastBidDate = auction.created;

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

  // auction.name = req.body.title;
  // auction.closed = new Date(req.body.closed);
  // auction.minBid = req.body.minBid;

  var statuses = ['open', 'close'];
  var newStatus = req.query.status;

  if (newStatus && newStatus.indexOf(newStatus) > -1 ) {
    auction.status = newStatus;
    auction.closedAt = new Date();
  }

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
  AuctionItem.find().sort('-lastBid').populate('user', 'displayName').exec(function (err, items) {
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
 * Show the current article
 */
exports.lastBid = function (req, res) {
  AuctionBid.findOne({auctionItem: req.auction}).sort('-created').populate('user', 'displayName').exec(function (err, items) {
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
 * Acution middleware
 */
exports.auctionByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Auction is invalid'
    });
  }

  AuctionItem.findById(id).populate('user', 'displayName').exec(function (err, auction) {
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
