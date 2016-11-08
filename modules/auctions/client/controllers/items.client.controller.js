(function () {
  'use strict';

  angular
    .module('auctions')
    .controller('ItemsController', ItemsController);

  ItemsController.$inject = ['$scope', '$state', '$uibModal', 'auctionResolve', 'AuctionItemsService', 'Notification', 'BidAnnouncerService'];

  function ItemsController ($scope, $state, $uibModal, auctionResolve, AuctionItemsService, Notification, BidAnnouncerService) {
    var vm = this;

    vm.auction = auctionResolve;
    vm.save = save;
    vm.item = vm.auction.newItem();
    vm.items = vm.auction.items();
    vm.openDetail = openDetail;
    vm.changeOrder = changeOrder;

    function save(isValid) {
      // if (!isValid) {
      //   $scope.$broadcast('show-errors-check-validity', 'vm.form.auctionForm');
      //   return false;
      // }

      // Create a new article, or update the current instance
      vm.item.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        vm.items.push(res);
        vm.item = new AuctionItemsService();

        BidAnnouncerService.newItem(res);
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Auction saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Auction save error!' });
      }
    }

    function openDetail (item) {
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: '/modules/auctions/client/views/modal-item.client.view.html',
        size: 'sm',
        controller: 'ItemModalController',
        controllerAs: 'vm',
        resolve: {
          itemResolve: function () {
            return item;
          },
          bidResolve: function () {
            return item.newBid();
          }
        }
      });

      modalInstance.result.then(
        function (status) {
          if (status === 'destroy') {
            var index = vm.items.indexOf(item);
            vm.items.splice(index, 1);
          }
        },
        function () {
          var index = vm.items.indexOf(item);
          item.$get().then(function (item) {
            vm.items[index] = item;
          });
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
