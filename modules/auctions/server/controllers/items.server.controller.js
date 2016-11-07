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
  var item = req.auctionItem ? req.auctionItem.toJSON() : {};

  // Add a custom field to the auction, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the auction model.
  item.isCurrentUserOwner = !!(req.user && item.user && item.user._id.toString() === req.user._id.toString());

  res.json(item);
};

/**
 * Create an article
 */
exports.create = function (req, res) {
  var item = new AuctionItem(req.body);
  item.user = req.user;
  item.lastBidValue = item.minBid;

  item.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(item);
    }
  });
};

/**
 Update an auction
 */
exports.update = function (req, res) {
  var item = req.auctionItem;

  // auction.name = req.body.title;
  // auction.closed = new Date(req.body.closed);
  // auction.minBid = req.body.minBid;

  var statuses = ['open', 'close'];
  var newStatus = req.query.status;

  if (newStatus && newStatus.indexOf(newStatus) > -1) {
    item.status = newStatus;
    item.closedAt = new Date();
  }

  item.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(item);
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
  var item = req.auctionItem;

  item.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(item);
    }
  });
};

/**
 * Show the current article
 */
exports.lastBid = function (req, res) {
  AuctionBid.findOne({ auctionItem: req.auctionItem }).sort('-created').populate('user', 'displayName').exec(function (err, items) {
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
exports.auctionItemByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Auction Item is invalid'
    });
  }

  AuctionItem.findById(id).populate('user', 'displayName').exec(function (err, item) {
    if (err) {
      return next(err);
    } else if (!item) {
      return res.status(404).send({
        message: 'No auction item with that identifier has been found'
      });
    }
    req.auctionItem = item;
    next();
  });
};
