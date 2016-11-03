(function () {
  'use strict';

  angular
    .module('auctions.services')
    .factory('BidsService', BidsService);

  BidsService.$inject = ['$resource', '$log'];

  function BidsService($resource, $log) {
    var Bid = $resource('/api/bids/:bidId', {
      bidId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Bid.prototype, {
      createOrUpdate: function () {
        var bid = this;
        return createOrUpdate(bid);
      }
    });

    return Bid;

    function createOrUpdate(bid) {
      if (bid._id) {
        return bid.$update(onSuccess, onError);
      } else {
        return bid.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(bid) {
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
