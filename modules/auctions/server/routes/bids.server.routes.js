'use strict';

/**
 * Module dependencies
 */
var bids = require('../controllers/bids.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/auctions/:auctionId/bids')
    .get(bids.index);
    // .post(bids.create);

  app.route('/api/bids')
    .get(bids.index)
    .post(bids.create);

  // Single article routes
  // app.route('/api/auctions/:auctionId/bids/:bidId')
    // .get(bids.read)
    // .put(auctions.update)
    // .delete(auctions.delete);

  // // Finish by binding the article middleware
  app.param('bidId', bids.bidByID);
};
