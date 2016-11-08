(function () {
  'use strict';

  angular
    .module('auctions.services')
    .factory('AuctionsService', AuctionsService);

  AuctionsService.$inject = ['$resource', '$log', 'AuctionItemsService'];

  function AuctionsService ($resource, $log, AuctionItemsService) {
    var Auction = $resource('/api/auctions/:auctionId', {
      auctionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Auction.prototype, {
      createOrUpdate: function () {
        var auction = this;
        return createOrUpdate(auction);
      },
      items: function () {
        var auction = this;
        return AuctionItemsService.query({ auction: { _id: auction._id } });
      },
      newItem: function () {
        var auction = this;
        return new AuctionItemsService({ auction: auction });
      }
    });

    return Auction;

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
