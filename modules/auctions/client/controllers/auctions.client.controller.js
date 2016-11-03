(function () {
  'use strict';

  angular
    .module('auctions')
    .controller('AuctionsController', AuctionsController);

  AuctionsController.$inject = ['$scope', '$state', '$uibModal', 'auctionResolve', 'AuctionsService', 'Notification'];

  function AuctionsController ($scope, $state, $uibModal, auction, AuctionsService, Notification) {
    var vm = this;

    vm.save = save;
    vm.auction = auction;
    vm.auctionItems = AuctionsService.query();
    vm.openDetail = openDetail;
    vm.changeOrder = changeOrder;

    function save(isValid) {
      // if (!isValid) {
      //   $scope.$broadcast('show-errors-check-validity', 'vm.form.auctionForm');
      //   return false;
      // }

      // Create a new article, or update the current instance
      vm.auction.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        vm.auctionItems.push(res);
        vm.auction = new AuctionsService();

        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Auction saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Auction save error!' });
      }
    }

    function openDetail (auction) {
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: '/modules/auctions/client/views/modal-auction.client.view.html',
        size: 'sm',
        controller: 'AuctionModalController',
        controllerAs: 'vm',
        resolve: {
          auctionResolve: function () {
            return auction;
          },
          bidResolve: function () {
            return auction.newBid();
          }
        }
      });

      modalInstance.result.then(
        function (status) {
          if (status === 'destroy') {
            var index = vm.auctionItems.indexOf(auction);
            vm.auctionItems.splice(index, 1);
          }
        },
        function () {
            var index = vm.auctionItems.indexOf(auction);
            auction.$get().then(function (auction) {
              vm.auctionItems[index] = auction;
            })
        }
      );
    }

    function changeOrder (order) {
      if (vm.order === order) return toggleOrder();
      vm.order = order;
    }

    function toggleOrder () {
      if (vm.order[0] === '-') return vm.order.substring(1);
      vm.order = '-'.concat(vm.order);
    }

  }
}());
