(function () {
  'use strict';

  angular
    .module('auctions')
    .controller('AuctionModalController', AuctionModalController);

  AuctionModalController.$inject = ['$uibModalInstance', '$window', 'auctionResolve', 'Notification'];

  function AuctionModalController ($uibModalInstance, $window, auction, Notification) {
    var vm = this;
    vm.auction = auction;
    vm.Auction = {
      destroy: destroy
    };

    function destroy () {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.auction.$remove(function() {
          $uibModalInstance.close({ status: 'destroy', auction: vm.auction });
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Auction deleted successfully!' });
        });
      }
    }

  }
}());
