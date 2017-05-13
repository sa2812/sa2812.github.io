(function() {
  var app = angular.module('sunnyA', []);

  app.controller('PortCtrl', function(){
   this.title = "Portfolio";
   this.items = portf;
  });

  var portf = [
  {
    pic: "img/everyoneslisteningto.png",
    url: "http://everyoneslistening.to/"
  }, 
  {
    pic: "img/justbollywood.png",
    url: "http://www.justbollywood.co.uk/"
  },
  {
    pic: "img/thebhangrashowdown.png",
    url: "http://thebhangrashowdown.co.uk/"
  },
  { 
    pic: "img/cricketscores.png",
    url: "http://www.cricketscor.es/"
  },
  {
    pic: "img/physoc.png",
    url: "http://physoc.co.uk/"
  },
  {
    pic: "img/github.png",
    url: "https://github.com/sa2812"
  }];

})();