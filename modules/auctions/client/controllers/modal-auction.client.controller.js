(function () {
  'use strict';

  angular
    .module('auctions')
    .controller('AuctionModalController', AuctionModalController);

  AuctionModalController.$inject = ['$uibModalInstance', '$window', 'auctionResolve', 'bidResolve', 'Authentication', 'Notification'];

  function AuctionModalController ($uibModalInstance, $window, auction, bid, Authentication, Notification) {
    var vm = this;
    vm.auction = auction;
    vm.authentication = Authentication;
    vm.Auction = {
      destroy: destroy
    };
    vm.Bid = {
      save: save
    };
    vm.bid = bid;
    vm.bids = auction.bids();
    vm.bidAdd = 100;

    vm.isOwner = (vm.authentication.user.displayName === vm.auction.user.displayName);

    function destroy () {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.auction.$remove(function() {
          $uibModalInstance.close({ status: 'destroy', auction: vm.auction });
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Auction deleted successfully!' });
        });
      }
    }

    function save(isValid) {
      // if (!isValid) {
      //   $scope.$broadcast('show-errors-check-validity', 'vm.form.auctionForm');
      //   return false;
      // }
      var minValue = vm.bids[0] ? vm.bids[0].value : auction.minBid;
      vm.bid.value = minValue + vm.bidAdd;

      // Create a new article, or update the current instance
      vm.bid.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        vm.bids.unshift(res);
        console.log('success');
        vm.bid = auction.newBid();

        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Bid saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Bid save error!' });
      }
    }

  }
}());
