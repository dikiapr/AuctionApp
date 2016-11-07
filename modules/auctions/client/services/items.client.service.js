(function () {
  'use strict';

  angular
    .module('auctions.services')
    .factory('AuctionItemsService', AuctionItemsService);

  AuctionItemsService.$inject = ['$resource', '$log', 'BidsService'];

  function AuctionItemsService($resource, $log, BidsService) {
    var AuctionItem = $resource('/api/auctionItems/:auctionItemId', {
      auctionItemId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      close: {
        method: 'PUT',
        params: {status: 'close'}
      },
      getLastBid: {
        method: 'GET',
        action: 'last-bid'
      }
    });

    angular.extend(AuctionItem.prototype, {
      createOrUpdate: function () {
        var auction = this;
        return createOrUpdate(auction);
      },
      newBid: function () {
        var auction = this;
        return new BidsService({ auctionItem: auction });
      },
      bids: function () {
        var auction = this;
        return BidsService.query({ auctionItem: { _id: auction._id } });
      }
    });

    return AuctionItem;

    function createOrUpdate(auction) {
      if (auction._id) {
        return auction.$update(onSuccess, onError);
      } else {
        return auction.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(auction) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
