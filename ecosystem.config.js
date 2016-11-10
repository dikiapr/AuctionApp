module.exports = {
  apps : [
    {
      name      : "auction_app",
      script    : "/usr/local/bin/npm",
      cwd       : "/home/vagrant/apps/current",
      args      : "run start:prod"
    },
  ],

  deploy : {
    production : {
      user : "vagrant",
      host : "192.168.33.10",
      ref  : "origin/master",
      repo : "git@github.com:Radiet/AuctionApp.git",
      path : "/home/vagrant/apps"
    },
  }
}
