(function () {
  'use strict';

  angular
    .module('auctions.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig ($stateProvider) {
    $stateProvider
      .state('auctions', {
        abstract: true,
        url: '/auctions',
        template: '<ui-view/>'
      })
      .state('auctions.index', {
        url: '',
        templateUrl: '/modules/auctions/client/views/auctions.client.view.html',
        controller: 'ItemsController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Mean Auctions!'
        },
        resolve: {
          auctionResolve: newAuction
        }
      });

  }

  newAuction.$inject = ['AuctionItemsService'];

  function newAuction(AuctionItemsService) {
    return new AuctionItemsService();
  }
}());
