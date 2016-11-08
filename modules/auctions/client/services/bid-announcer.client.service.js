(function () {
  'use strict';

  angular
    .module('auctions.services')
    .factory('BidAnnouncerService', BidAnnouncerService);

  BidAnnouncerService.$inject = ['Socket'];

  function BidAnnouncerService(Socket) {
    var service = {
      bidCreated: bidCreated,
      itemClosed: itemClosed,
      newItem: newItem
    };

    return service;

    function bidCreated (bid) {
      var message = {
        text: ('has bid ' + bid.auctionItem.name+' for ' + bid.value + '!!')
      };

      sendMessage(message);
    }

    function newItem (item) {
      var message = {
        text: ('New auction for ' + item.name + '!! Bid start from ' + item.minBid)
      };

      sendMessage(message);
    }

    function itemClosed (item) {
      item.$getLastBid()
      .then(function (bid) {
        var message = {
          text: ('Congrats '+ bid.user.displayName +' has win auction ' + item.name + '!!')
        };
        sendMessage(message);
      })

    }

    // Private
    function sendMessage (message) {
      // Emit a 'chatMessage' message event
      Socket.emit('chatMessage', message);
    }
  }

}());
