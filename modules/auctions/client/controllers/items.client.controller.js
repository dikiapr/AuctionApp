(function () {
  'use strict';

  angular
    .module('auctions')
    .controller('ItemsController', ItemsController);

  ItemsController.$inject = ['$scope','$window', '$state', '$uibModal', '$timeout', 'auctionResolve', 'AuctionItemsService', 'Notification', 'BidAnnouncerService', 'Upload'];

  function ItemsController ($scope, $window, $state, $uibModal, $timeout, auctionResolve, AuctionItemsService, Notification, BidAnnouncerService, Upload) {
    var vm = this;

    vm.auction = auctionResolve;
    vm.Auction = {
      update: updateAuction,
      destroy: destroyAuction,
      changeCover: changeCoverAuction
    };
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

    function destroyAuction () {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.auction.$remove(function() {
          $state.go('auctions.index');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Auction deleted successfully!' });
        });
      }
    }

    function updateAuction () {
      vm.auction.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        vm.auction = res;
        vm.Auction.edit = false;

        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Auction updated successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Auction updated error!' });
      }
    }

    function changeCoverAuction (image) {
      Upload.upload({
        url: '/api/auctions/' +vm.auction._id+ '/cover',
        data: {
          newCoverImage: image
        }
      }).then(function (response) {
        $timeout(function () {
          onSuccessItem(response.data);
        });
      }, function (response) {
        if (response.status > 0) onErrorItem(response.data);
      }, function (evt) {
        // vm.progress = parseInt(100.0 * evt.loaded / evt.total, 10);
      });
    }


    // Called after the user has successfully uploaded a new picture
    function onSuccessItem(response) {
      // Show success message
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Change profile picture successful!' });

      vm.auction.coverImageURL = response.coverImageURL;

      // vm.progress = 0;
    }

    // Called after the user has failed to uploaded a new picture
    function onErrorItem(response) {

      // Show error message
      Notification.error({ message: response.message, title: '<i class="glyphicon glyphicon-remove"></i> Change profile picture failed!' });
    }

  }
}());
