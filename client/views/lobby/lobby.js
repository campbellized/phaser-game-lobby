Template.header.helpers({
  lobbySize: function(){
    var lobby = appRooms.findOne({_id: Session.get('lobbyId')});
    if(lobby){
      return (lobby.playerIds.length == 1) ? lobby.playerIds.length + " user" : lobby.playerIds.length + " users";
    }
  },
  usersInLobby: function(){
    var lobby = appRooms.findOne({_id: Session.get('lobbyId')});
    //lobby.playerIds.sort();
    if(lobby){
      var users = [];
      lobby.playerIds.forEach(function(element, index, array) {
        //console.log('a[' + index + '] = ' + element);
        users.push(Meteor.users.findOne({_id: element}));
      });
      //console.log(users);
      //console.log(users[0]);
    }
    return users;
  }
});

Template.header.events({
  'click .player-alias' : function(e){
      e.preventDefault();
      $(e.currentTarget).addClass('hidden');
      $(".alias-edit").removeClass('hidden');
      return false;
  },
  'keypress .alias-edit': function(e){
    if(e.which == 13){
      e.preventDefault();
      var alias = $(e.currentTarget).val();
      check(alias, String);
      if(alias){
        if(alias.length > 16){
          alias = alias.substring(0,16);
        }
      }else{
        alias = "Anonymous";
      }

      Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.alias": alias}},
      function(err){
        if(!err){
          console.log("Alias updated successfully.");
          Meteor.call('updateChat', Meteor.userId(), alias, function (err, res){
            if(!err){
              console.log("Chat record updatged successfully");
            }else{
              console.log("There was an error updating your chat record.");
              console.log(err);
            }
          });
          $(e.currentTarget).addClass('hidden');
          $(".player-alias").removeClass('hidden');
        }else{
          console.log("There was a problem updating your alias.");
        }
      });

      return false;
    }
  }
});

Template.messages.helpers({
  messages: function(){
    var messages = Messages.find({room: Session.get('lobbyId')}).fetch();
    //console.log(messages);
    if(messages){
      return messages;
    }
  }
});

Template.chat.events({
  'keypress #chat-input': function(e){
    if(e.which == 13){
      e.preventDefault();
      var chatMessage = $("#chat-input").val();
      check(chatMessage, String);
      Messages.insert({room: Session.get('lobbyId'), userAlias: Meteor.user().profile.alias, userId: Meteor.userId(), message: chatMessage},
      function(err){
        if(!err){
          console.log("Message inserted successfully.");
          $("#chat-input").val("");
        }else{
          console.log("There was a problem inserting your message.");
        }
      });
      return false;
    }
  }
});
