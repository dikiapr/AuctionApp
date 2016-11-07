'use strict';

/**
 * Module dependencies
 */
var items = require('../controllers/items.server.controller');

module.exports = function (app) {

  app.route('/api/auctionitems')
    .get(items.index)
    .post(items.create);

  app.route('/api/auctionItems/:auctionItemId')
    .get(items.read)
    .put(items.update)
    .delete(items.delete);

  app.route('/api/auctionItems/:auctionItemId/last-bid')
    .get(items.lastBid);

  // NESTED
  app.route('/api/auctions/:auctionId/items')
    .get(items.index);

  app.param('auctionItemId', items.auctionItemByID);
};
