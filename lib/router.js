Router.route('/', {
  name: 'home',

  controller: 'appController',

  layoutTemplate: 'fullwidth',

  title: 'Welcome to the Game!',

  yieldRegions: {
    'home': {to: 'main'}
  },
  onBeforeAction: function () {
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
  waitOn: function () {
    return Meteor.subscribe("users");
  },
  yieldRegions: {
    'content': {to: 'main'},
    'header': {to: 'top'},
    'chat': {to: 'bottom'}
  },
  onBeforeAction: function () {
    if(Meteor.user()){
      var availableLobby = appRooms.findOne({playerSize: {$lt: 4}});
      //console.log((availableLobby) ? availableLobby : "No lobby available");
      if(!availableLobby){
        var roomId = new Mongo.ObjectID();
        roomId = roomId._str.substring(0,6);
        if(Meteor.isClient){
          appRooms.insert({_id: roomId});
          console.log("Session id 'roomId':"+roomId);
        }
        this.redirect('/lobby/'+roomId);
      }else{
        console.log("Found lobby "+availableLobby._id);
        this.redirect('/lobby/'+availableLobby._id);
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
  waitOn: function () {
    return Meteor.subscribe("users");
  },
  yieldRegions: {
    'content': {to: 'main'},
    'header': {to: 'top'},
    'chat': {to: 'bottom'}
  },
  onRun: function () {
    var lobbyId = this.params.lobbyId;
    Session.set('lobbyId', lobbyId);
    var thisLobby = appRooms.findOne({_id: lobbyId});
    if(!thisLobby || thisLobby.playerSize >= 4){
      console.log("There was no lobby after all...");
      var lobbyId = new Mongo.ObjectID();
      lobbyId = lobbyId._str.substring(0,6);
      console.log("New room id created. "+lobbyId);
      if(Meteor.isClient){
        appRooms.insert({_id: lobbyId});
        console.log("Session id 'lobbyId':"+lobbyId);
      }
      this.redirect('/lobby/'+lobbyId);
    }else{
      console.log("Joining new lobby "+lobbyId);
      if(Meteor.isClient){
        //appRooms.update({_id: Session.get('lobbyId')}, {$addToSet: {playerIds: Meteor.userId()}});
        //appRooms.update({_id: Session.get('lobbyId')}, {$inc: {playerSize: 1}});
        Meteor.call('joinLobby', lobbyId, Meteor.userId(), function (err, res){
          if(!err){
            console.log("Joined the lobby successfully");
          }else{
            console.log("There was a problem joining the lobby");
            console.log(err);
          }
        });
      }
    }
  },
  onRerun: function () {
    if(!Meteor.user() && !Meteor.loggingIn()) {
      this.redirect('/');
    }
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
