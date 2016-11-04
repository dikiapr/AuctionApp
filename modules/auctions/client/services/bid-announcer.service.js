(function () {
  'use strict';

  angular
    .module('auctions.services')
    .factory('BidAnnouncerService', BidAnnouncerService);

  BidAnnouncerService.$inject = ['Socket'];

  function BidAnnouncerService(Socket) {
    var service = {
      bidCreated: bidCreated,
      auctionClosed: auctionClosed,
      newAuction: newAuction
    };

    return service;

    function bidCreated (bid) {
      var message = {
        text: ('has bid ' + bid.auction.name+' for ' + bid.value + '!!')
      };

      sendMessage(message);
    }

    function newAuction (auction) {
      var message = {
        text: ('New auction for ' + auction.name + '!! Bid start from ' + auction.minBid)
      };

      sendMessage(message);
    }

    function auctionClosed (auction) {
      auction.$getLastBid()
      .then(function (bid) {
        var message = {
          text: ('Congrats '+ bid.user.displayName +' has win auction ' + auction.name + '!!')
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
