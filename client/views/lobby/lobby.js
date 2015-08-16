Template.messages.helpers({
  messages: function(){
      return Messages.find({room: Session.get('roomId')});
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
