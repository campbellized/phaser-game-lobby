Accounts.onCreateUser(function(options, user) {
  var profile = {};
  profile.alias = "Player " +  _.random(0, 1000);
  // We still want the default hook's 'profile' behavior.
  user.profile = profile;

  return user;
});

Meteor.publish('users', function() {
  return Meteor.users.find();
});

Meteor.methods({
  joinLobby : function(lobbyId, userId){
    appRooms.update({_id: lobbyId}, {$addToSet: {playerIds: userId}});
    appRooms.update({_id: lobbyId}, {$inc: {playerSize: 1}});
    Meteor.users.update({_id: userId}, {$set: {"status.lobbyId": lobbyId}}, function(err){
      if(!err){
        console.log("user updated successfully");
      }else{
        console.log("user update failed");
      }
    });
  },
  leaveLobby : function(userId){
    console.log("leaving lobby");
    var user = Meteor.users.findOne({_id: userId});
    var lobby = appRooms.findOne({_id: user.status.lobbyId});
    if(lobby){
      if(lobby.playerSize == 1){
        console.log("Lobby only has one visitor");
        appRooms.remove({_id: lobby._id});
      }else{
        console.log("Lobby has "+lobby.playerSize+" visitors.");
        appRooms.update({_id: lobby._id}, {$pull: {playerIds: userId}});
        appRooms.update({_id: lobby._id}, {$inc: {playerSize: -1}});
        Messages.insert({room: lobby._id, userAlias: user.profile.alias, userId: userId, message: "[" + user.profile.alias + " has left the room.]"});
      }
    }else{
      //console.log("Lobby not found");
    }
  }
});

UserStatus.events.on("connectionLogin", function(fields) {

});

UserStatus.events.on("connectionLogout", function(fields) {
  Meteor.call('leaveLobby', fields.userId, function (err, res){
    if(err){
      console.log(err);
    }
  });
});
