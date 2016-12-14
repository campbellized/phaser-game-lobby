Meteor.publish('users', function() {
  return Meteor.users.find();
});

Meteor.publish('appRooms', function() {
  return appRooms.find();
});
