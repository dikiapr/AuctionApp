(function (app) {
  'use strict';

  app.registerModule('auctions', ['core']);
  app.registerModule('auctions.routes', ['ui.router', 'core.routes']);
  app.registerModule('auctions.services');

}(ApplicationConfiguration));
