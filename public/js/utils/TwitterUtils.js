define(['config', 'twitter', 'moment'], function(config, Twitter, moment){
  var instance = null;
  function TwitterUtils(){
    if(instance !== null){
      throw new Error("Cannot instantiate more than one Twitter class");
    }
    this.initialize();
  }

  TwitterUtils.prototype = {

    initialize: function() {
      //TODO:hide me!
      console.log('Init twitter:' + JSON.stringify(config));
      this.client = new Twitter(config.twitter);
    },

    newPlayer: function(room) {
      var now = moment().format('h:mm:ss');
      this.tweet('New player in ' + room + ' (' + now + ') choose your tank: http://mega-tanks.com/#rooms/' + room + '/tanks');
    },

    tweet: function(msg) {
      console.log(msg);
      this.client.post('statuses/update', {status: msg},  function(error, tweet, response){
        if(error) {
          console.error('=====Tweet failed=====');
          console.error('Tweet msg: ' + msg);
          console.error('Tweet failed: ' + error.message);
        }
      });
    }
  };

  TwitterUtils.getInstance = function(){
    // summary:
    // Gets an instance of the singleton. It is better to use
    if(instance === null){
      instance = new TwitterUtils();
    }
    return instance;
  };
  return TwitterUtils.getInstance();
});
