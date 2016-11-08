'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  fs = require('fs'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
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
  auction.isCurrentUserOwner = getOwnerity(req.user, auction);
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
 * Update an auction
 */
exports.update = function (req, res) {
  var auction = req.auction;

  auction.title = req.body.title;
  auction.desc = req.body.desc;

  auction.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      auction = auction.toJSON();
      auction.isCurrentUserOwner = getOwnerity(req.user, auction);
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
 * Update profile picture
 */
exports.changeCoverImage = function (req, res) {
  var user = req.user;
  var auction = req.auction;
  var uploadDest = config.uploads.coverUpload.dest + auction._id + '/';
  var upload = multer({ dest: uploadDest }).single('newCoverImage');
  var existingImageUrl;

  // Filtering to upload only images
  upload.fileFilter = require(path.resolve('./config/lib/multer')).extensionFilter;

  if (user && auction) {
    existingImageUrl = auction.coverImageURL;
    uploadImage()
      .then(updateAuction)
      .then(deleteOldImage)
      .then(function () {
        res.json(auction);
      })
      .catch(function (err) {
        res.status(422).send(err);
      });
  } else {
    res.status(401).send({
      message: 'User is not signed in'
    });
  }

  function uploadImage () {
    return new Promise(function (resolve, reject) {
      upload(req, res, function (uploadError) {
        if (uploadError) {
          reject(errorHandler.getErrorMessage(uploadError));
        } else {
          resolve();
        }
      });
    });
  }

  function updateAuction () {
    return new Promise(function (resolve, reject) {
      auction.coverImageURL = uploadDest + req.file.filename;
      console.log(uploadDest)
      auction.save(function (err, theuser) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  function deleteOldImage () {
    return new Promise(function (resolve, reject) {
      if (existingImageUrl !== Auction.schema.path('coverImageURL').defaultValue) {
        fs.unlink(existingImageUrl, function (unlinkError) {
          if (unlinkError) {
            console.log(unlinkError);
            reject({
              message: 'Error occurred while deleting old profile picture'
            });
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

};


function getOwnerity (user, auction) {
  return !!(user && auction.user && auction.user._id.toString() === user._id.toString());
}

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
