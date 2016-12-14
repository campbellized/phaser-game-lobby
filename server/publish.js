Meteor.publish('users', function() {
  return Meteor.users.find();
});

Meteor.publish('lobbies', function() {
  return appRooms.find({});
});
