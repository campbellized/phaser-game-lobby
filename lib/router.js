Router.route('/', {
  name: 'home',

  controller: 'appController',

  layoutTemplate: 'fullwidth',

  title: 'Welcome to the Game!',

  yieldRegions: {
    'home': {to: 'main'}
  }
});

Router.route('/lobby', {
  name: 'lobby',

  controller: 'appController',

  layoutTemplate: 'sidebar',

  title: 'Welcome to the lobby!',

  yieldRegions: {
    'content': {to: 'main'},
    'header': {to: 'top'},
    'chat': {to: 'bottom'}
  }
});

//Route to 404 page
Router.route('/(.*)', {
  name: 'pageNotFound',

  controller: 'appController',

  layoutTemplate: 'fullwidth',

  title: 'Welcome to the Game!',

  yieldRegions: {
    'pageNotFound': {to: 'main'}
  }
});

if (Meteor.isClient) {
  appController = RouteController.extend({
    onAfterAction: function() {
      BodyClass.run();
    },
    onStop: function () {
      BodyClass.cleanup();
    }
  });
}
