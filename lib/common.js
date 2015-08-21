Meteor.methods({
  updateChat : function(id, alias){
    Messages.update({userId: id}, {$set: {userAlias: alias}}, {multi: true});
  }
});
