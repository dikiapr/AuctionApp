'use strict';

/**
 * Module dependencies
 */
var auctions = require('../controllers/auctions.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/auctions')
    .get(auctions.index)
    .post(auctions.create);

  // Single article routes
  app.route('/api/auctions/:auctionId')
  //   .get(articles.read)
    // .put(auctions.update)
    .delete(auctions.delete);

  // // Finish by binding the article middleware
  app.param('auctionId', auctions.auctionByID);
};
