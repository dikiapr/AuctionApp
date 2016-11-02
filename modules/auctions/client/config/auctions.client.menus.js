(function () {
  'use strict';

  angular
    .module('auctions')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Auctions',
      state: 'auctions.index'
    });
  }
}());
