Router.route('/', {
  name: 'home',
  controller: 'appController',
  layoutTemplate: 'fullwidth',
  title: 'Welcome to the Game!',
  yieldRegions: {
    'home': {to: 'main'}
  },

  onBeforeAction: function (){
    // If the user is logged in, send them to a lobby
    if(Meteor.user()){
      this.redirect('/lobby');
    }
    this.next();
  }
});

Router.route('/lobby', {
  name: 'lobby',
  controller: 'appController',
  layoutTemplate: 'sidebar',
  title: 'Welcome to the lobby!',
  yieldRegions: {
    'content': {to: 'main'},
    'header': {to: 'top'},
    'chat': {to: 'bottom'}
  },

  waitOn: function (){
    return [
      Meteor.subscribe("users"),
      Meteor.subscribe("lobbies")
    ]
  },

  /**
   * Find a lobby that is not full. If one does not exist or then create a new lobby.
   */
  onBeforeAction: function (){
    if(Meteor.user()){
      var availableLobby = appRooms.findOne({playerSize: {$lt: 4}});
      if(availableLobby){
        console.log("Found lobby "+availableLobby._id);
        this.redirect('/lobby/'+availableLobby._id);
      }else{
        roomId = generateRoomId();
        this.redirect('/lobby/'+roomId);
      }
    }
    this.next();
  }
});

Router.route('/lobby/:lobbyId', {
  name: 'lobbyWithID',
  controller: 'appController',
  layoutTemplate: 'sidebar',
  title: 'Welcome to the lobby!',
  yieldRegions: {
    'content': {to: 'main'},
    'header': {to: 'top'},
    'chat': {to: 'bottom'}
  },

  waitOn: function (){
    return [
      Meteor.subscribe("users"),
      Meteor.subscribe("lobbies")
    ]
  },

  /**
   * Attempt to join the lobby specified in route params. If it does not exist or
   * is full, then create a new lobby.
   */

  // onBeforeAction: function (){
  //   this.next();
  // },

  onRun: function (){
    var lobbyId = this.params.lobbyId;
    Session.set('lobbyId', lobbyId);
    var thisLobby = appRooms.findOne({_id: lobbyId});
    console.log("This lobby is:", thisLobby);
    if(thisLobby && thisLobby.playerSize >= 4){
      console.log("Lobby " + lobbyId + " wasn't available.");
      roomId = generateRoomId();
      console.log("New room id created. "+lobbyId);
      this.redirect('/lobby/'+lobbyId);
    }else{
      console.log("Joining new lobby "+lobbyId);
      if(Meteor.isClient){
        Meteor.call('joinLobby', lobbyId, Meteor.userId(), function (err, res){
          if(!err){
            console.log("Joined the lobby successfully");
          }else{
            console.log("There was a problem joining the lobby", err);
          }
        });
      }
    }
    this.next();
  },

  onRerun: function (){
    if(!Meteor.user() && !Meteor.loggingIn()){
      this.redirect('/');
    }
    this.next();
  }
});


// Route to 404 page
Router.route('/(.*)', {
  name: 'pageNotFound',
  controller: 'appController',
  layoutTemplate: 'fullwidth',
  title: 'Welcome to the Game!',
  yieldRegions: {
    'pageNotFound': {to: 'main'}
  }
});

function generateRoomId(){
  var roomId = new Mongo.ObjectID();
  return roomId._str.substring(0,6);
}

// Used by the body-class package
if(Meteor.isClient){
  appController = RouteController.extend({
    onAfterAction: function(){
      BodyClass.run();
    },
    onStop: function (){
      BodyClass.cleanup();
    }
  });
}
