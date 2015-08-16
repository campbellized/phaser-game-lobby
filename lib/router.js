Router.route('/', {
  name: 'home',

  controller: 'appController',

  layoutTemplate: 'fullwidth',

  title: 'Welcome to the Game!',

  yieldRegions: {
    'home': {to: 'main'}
  }
});

Router.route('/lobby', {
  name: 'lobby',

  controller: 'appController',

  layoutTemplate: 'sidebar',

  title: 'Welcome to the lobby!',
  waitOn: function () {
    // return one handle, a function, or an array
    return Meteor.subscribe("users");
  },
  yieldRegions: {
    'content': {to: 'main'},
    'header': {to: 'top'},
    'chat': {to: 'bottom'}
  },
  onBeforeAction: function () {
    if(Meteor.user()){
      var availableLobby = appRooms.findOne({playerSize: {$lt: 5}});
      console.log((availableLobby) ? availableLobby : "No lobby available");
      if(!availableLobby){
        createNewLobby();
        this.redirect('/lobby/'+roomId);
      }else{
        this.redirect('/lobby/'+availableLobby._id);
      }
    }
      this.next();
    }
});

Router.route('/lobby/:roomId', {
  name: 'lobbyWithID',

  controller: 'appController',

  layoutTemplate: 'sidebar',

  title: 'Welcome to the lobby!',
  waitOn: function () {
    // return one handle, a function, or an array
    return Meteor.subscribe("users");
  },
  yieldRegions: {
    'content': {to: 'main'},
    'header': {to: 'top'},
    'chat': {to: 'bottom'}
  },
  onBeforeAction: function () {
    Session.set('roomId', this.params.roomId);
    var thisLobby = appRooms.findOne({_id: this.params.roomId});
    if(!thisLobby || thisLobby.playerSize > 4){
      createNewLobby();
    }else{
      if(Meteor.isClient){
        appRooms.update({_id: Session.get('roomId')}, {$addToSet: {playerIds: Meteor.userId()}});
      }
    }
    console.log("RoomId is "+Session.get('roomId'));
    this.next();
  }
});


//Route to 404 page
Router.route('/(.*)', {
  name: 'pageNotFound',

  controller: 'appController',

  layoutTemplate: 'fullwidth',

  title: 'Welcome to the Game!',

  yieldRegions: {
    'pageNotFound': {to: 'main'}
  }
});

if (Meteor.isClient) {
  appController = RouteController.extend({
    onAfterAction: function() {
      BodyClass.run();
    },
    onStop: function () {
      BodyClass.cleanup();
    }
  });
}

function createNewLobby(){
  var roomId = new Mongo.ObjectID();
  roomId = roomId._str.substring(0,6);
  if(Meteor.isClient){
    appRooms.insert({_id: roomId, playerSize: 1}, {$addToSet: {playerIds: Meteor.userId()}});
  }
  Session.set('roomId', roomId);
  return false;
}
