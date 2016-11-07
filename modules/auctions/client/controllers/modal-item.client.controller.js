(function () {
  'use strict';

  angular
    .module('auctions')
    .controller('ItemModalController', ItemModalController);

  ItemModalController.$inject = ['$uibModalInstance', '$window', 'itemResolve', 'bidResolve', 'Authentication', 'Notification', 'BidAnnouncerService'];

  function ItemModalController ($uibModalInstance, $window, item, bid, Authentication, Notification, BidAnnouncerService) {
    var vm = this;
    vm.item = item;
    vm.authentication = Authentication;
    vm.Item = {
      destroy: destroy,
      close: close
    };
    vm.Bid = {
      save: save
    };
    vm.bid = bid;
    vm.bids = vm.item.bids();
    vm.bidAdd = 100;

    vm.isOwner = (vm.authentication.user.displayName === vm.item.user.displayName);

    function destroy () {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.item.$remove(function() {
          $uibModalInstance.close('destroy');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Auction deleted successfully!' });
        });
      }
    }

    function save(isValid) {
      // if (!isValid) {
      //   $scope.$broadcast('show-errors-check-validity', 'vm.form.auctionForm');
      //   return false;
      // }
      var minValue = vm.bids[0] ? vm.bids[0].value : vm.item.minBid;
      vm.bid.value = minValue + vm.bidAdd;

      // Create a new article, or update the current instance
      vm.bid.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        vm.bid = item.newBid();
        vm.bids.unshift(res);

        res.auctionItem = vm.item;
        BidAnnouncerService.bidCreated(res);
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Bid saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Bid save error!' });
      }
    }

    function close() {
      vm.item.$close()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        vm.item.status = res.status;
        BidAnnouncerService.auctionClosed(res);
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Bid close successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Bid close error!' });
      }
    }

  }
}());
