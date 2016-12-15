// In this demo new users cannot be registered from the client.
Accounts.config({
  forbidClientAccountCreation: true
});

if(Meteor.isClient){
  Accounts.onLogin(function(){
    Meteor.logoutOtherClients();
  });

  //User is logged out when the tab is closed
  window.onbeforeunload = function(){
    Meteor.logout();
  };
}
