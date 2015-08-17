Template.header.helpers({
  lobbySize: function(){
    var lobby = appRooms.findOne({_id: Session.get('roomId')});
    if(lobby){
      return (lobby.playerIds.length > 1) ? lobby.playerIds.length+" users" : lobby.playerIds.length+" user";
    }
  },
  usersInLobby: function(){
    var lobby = appRooms.findOne({_id: Session.get('roomId')});
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

Template.messages.helpers({
  messages: function(){
    var messages = Messages.find({room: Session.get('roomId')}).fetch();
    //console.log(messages);
    if(messages){
      return messages;
    }
  }
});

Template.chat.events({
  'keypress #chat-input': function(e, t){
    if(e.which == 13){
      e.preventDefault();
      var chatMessage = $("#chat-input").val();
      check(chatMessage, String);
      Messages.insert({room: Session.get('roomId'), name: Meteor.user().profile.alias, message: chatMessage},
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
