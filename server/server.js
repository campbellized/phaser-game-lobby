Accounts.onCreateUser(function(options, user) {
  var profile = {};
  profile.alias = "Player " +  _.random(0, 1000);
  // We still want the default hook's 'profile' behavior.
  user.profile = profile;

  return user;
});

Meteor.publish('users', function() {
  return Meteor.users.find({}, {fields: {profile: 1}});
});
