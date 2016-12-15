// When a user is created, add custom attributes to their profile object.
Accounts.onCreateUser(function(options, user) {
  var profile = {};
  profile.alias = "Player " +  _.random(0, 1000);
  // We still want the default hook's 'profile' behavior.
  user.profile = profile;

  return user;
});

Meteor.methods({
  /**
   * Adds a new user to a lobby.
   * @param  {string} lobbyId The _id of a document in the appRooms collection
   * @param  {string} userId  The _id of a document in the User collection
   * @return {undefined}
   */
  joinLobby: function(lobbyId, userId){
    console.log("Joining lobby "+lobbyId);
    var thisLobby = appRooms.findOne({_id: lobbyId});
    if(thisLobby === undefined){
      appRooms.insert({_id: lobbyId});
    }

    appRooms.update({$and: [
                              {_id: lobbyId},
                              { playerIds: { $ne: userId} }
                            ]
                    },
                    {$inc: {playerSize: 1}});

    appRooms.update({$and: [
                      {_id: lobbyId},
                      { playerIds: { $ne: userId} }
                    ]
                  },
                  {$addToSet: {playerIds: userId}});

    Meteor.users.update({_id: userId}, {$set: {"status.lobbyId": lobbyId}}, function(err){
      if(!err){
        console.log("user updated successfully");
      }else{
        console.log("user update failed");
      }
    });
  },

  /**
   * A user will leave the lobby they are currently in.
   * @param  {string} userId  The _id of a document in the User collection
   * @return {undefined}
   */
  leaveLobby: function(userId){
    console.log("leaving lobby");
    var user = Meteor.users.findOne({_id: userId});
    var lobby = appRooms.findOne({_id: user.status.lobbyId});

    /**
     * If the last player is leaving, remove the lobby and it's messages.
     * Otherwise, update the lobby's document in the database.
     */

    if(lobby && lobby.playerSize){
      if(lobby.playerSize == 1){
        console.log("Lobby only has one visitor");
        appRooms.remove({_id: lobby._id});
        Messages.remove({room: lobby._id});
      }else{
        console.log("Lobby has "+lobby.playerSize+" visitors.");
        appRooms.update({_id: lobby._id}, {$pull: {playerIds: userId}});
        appRooms.update({_id: lobby._id}, {$inc: {playerSize: -1}});
        Messages.insert({room: lobby._id,
                        userAlias: user.profile.alias,
                        userId: userId,
                        message: "[" + user.profile.alias + " has left the room.]"
        });
      }
    }else{
      console.log("Lobby not found");
    }
  },
  /**
   * Update the chat history in the Message collection with a user's new alias.
   * @param  {string} userId  The _id of a document in the User collection
   * @param  {string} alias The new alias that the user
   * @return {undefined}
   */
  updateChat: function(id, alias){
      Messages.update({userId: id},
                      {$set: {userAlias: alias}},
                      {multi: true});
  }
});

// Events that will be run when a user logs in
UserStatus.events.on("connectionLogin", function(fields) {

});

// Events that will be run when a user logs out
UserStatus.events.on("connectionLogout", function(fields) {
  Meteor.call('leaveLobby', fields.userId, function (err){
    if(err){
      console.log(err);
    }
  });
});
