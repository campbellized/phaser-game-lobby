Template.game.onRendered(function(){

  if(Session.get('roomId') !== undefined){
    var thisRoom = appRooms.findOne({_id: Session.get('roomId')});
    var player, player1, player2, player3, player4;

    if(thisRoom){
      var players = thisRoom.playerIds;
      if(players){
        players.sort();
        var index = _.indexOf(players, Meteor.userId());
        player1 = (players[0]) ? players[0] : null;
        player2 = (players[1]) ? players[1] : null;
        player3 = (players[2]) ? players[2] : null;
        player4 = (players[3]) ? players[3] : null;
        //player = players[index];
        console.log(players);
      }
    }

    var cursors;
    var game = new Phaser.Game(600, 450, Phaser.AUTO, 'gameContainer', { preload: preload, create: create, update: update, render: render });
  }else{
    console.log("No room id");
  }

  function preload() {

      game.load.image('background','/assets/tests/debug-grid-1920x1920.png');
      game.load.image('player','/assets/sprites/phaser-dude.png');

  }

  function create() {

      game.add.tileSprite(0, 0, 1920, 1920, 'background');

      game.world.setBounds(0, 0, 1920, 1920);

      game.physics.startSystem(Phaser.Physics.P2JS);

      player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');

      game.physics.p2.enable(player);

      cursors = game.input.keyboard.createCursorKeys();

      game.camera.follow(player);

  }

  function update() {

      player.body.setZeroVelocity();
      if (cursors.up.isDown)
      {
          player.body.moveUp(300)
      }
      else if (cursors.down.isDown)
      {
          player.body.moveDown(300);
      }

      if (cursors.left.isDown)
      {
          player.body.velocity.x = -300;
      }
      else if (cursors.right.isDown)
      {
          player.body.moveRight(300);
      }

  }

  function render() {

      game.debug.cameraInfo(game.camera, 32, 32);
      game.debug.spriteCoords(player, 32, 500);

  }


});
