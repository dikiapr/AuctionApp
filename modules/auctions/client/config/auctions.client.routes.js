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
        controller: 'AuctionsController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Mean Auctions!'
        },
        resolve: {
          auctionResolve: newAuction
        }
      })
      .state('auctions.items', {
        url: '/:auctionId',
        templateUrl: '/modules/auctions/client/views/items.client.view.html',
        controller: 'ItemsController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Mean Auction Items!'
        },
        resolve: {
          auctionResolve: getAuction,
        }
      });

  }

  newAuction.$inject = ['AuctionsService'];
  function newAuction(AuctionsService) {
    return new AuctionsService();
  }

  getAuction.$inject = ['$stateParams', 'AuctionsService'];
  function getAuction($stateParams, AuctionsService) {
    return AuctionsService.get({
      auctionId: $stateParams.auctionId
    }).$promise;
  }

}());
