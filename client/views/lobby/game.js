Template.game.onRendered(function(){
  this.autorun(function(){
    var lobbyId = Session.get('lobbyId');
    if(lobbyId !== undefined && !game){
      console.log("lobby id... start game");
      runGame(lobbyId);
    }
  })
});
Template.game.onDestroyed(function(){
  //Phaser.Game.destroy();
  game = null;
});

var player;
var cursors;
var game;

function runGame(lobbyId){
  /*var thisRoom = appRooms.findOne({_id: lobbyId});
  var player1, player2, player3, player4;

  if(thisRoom){
    console.log("I'm running the game and I have a lobby.");
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
  }else{
    console.log("tryna start game, but theres no lobby found");
  }*/
  game = new Phaser.Game(600, 450, Phaser.AUTO, 'gameContainer', { preload: preload, create: create, update: update, render: render });
}

function preload() {

    game.load.image('background','/debug-grid-1920x1920.png');
    game.load.image('player','/bunny.png');

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
