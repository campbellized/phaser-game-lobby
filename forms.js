/*Shower({
	name:"chatForm",
	method: "chatMessage",
	fields:{
    chatMessage: {
      required: true,
      format: "alphanumeric",
      transforms: ["escapeHTML", "stripTags"],
			requiredMessage: "You can't send nothing."
    }
	}
});

Meteor.methods({
  chatMessage: function(rawData){
		Shower.chatForm.validate(rawData, function(errors, formData){
				if(!errors){
					var roomId = Session.get('roomId');
          var user = Meteor.users.findOne({_id: Meteor.userId()});
					if(Meteor.isServer){
						Messages.insert({room: roomId, name: user.profile.alias, message: formData.chatMessage}, function(err){
	            if(!err){
	              console.log("Message inserted successfully.");
	            }else{
	              console.log("There was a problem inserting your message.");
	            }
	          });
					}
	      }
		});
	}
});
*/
