(function () {
  'use strict';

  angular
    .module('auctions')
    .controller('AuctionsController', AuctionsController);

  AuctionsController.$inject = ['auctionResolve', 'Notification', 'AuctionsService'];

  function AuctionsController(newAuction, Notification, AuctionsService) {
    var vm = this;
    vm.auction = newAuction;
    vm.Auction = {
      save: save,
      all: AuctionsService.query()
    }

    function save () {
      vm.auction.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        vm.Auction.all.push(res);

        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Auction created successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Auction create error!' });
      }
    }
  }

}());
