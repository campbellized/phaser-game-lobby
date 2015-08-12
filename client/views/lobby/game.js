Template.game.onRendered(function(){
  var renderer = PIXI.autoDetectRenderer(600, 450,{backgroundColor : 0x1099bb});
  $("#gameContainer").append(renderer.view);

  // create the root of the scene graph
  var stage = new PIXI.Container();

  // create a texture from an image path
  var texture = PIXI.Texture.fromImage('bunny.png');

  // create a new Sprite using the texture
  var bunny = new PIXI.Sprite(texture);

  // center the sprite's anchor point
  bunny.anchor.x = 0.5;
  bunny.anchor.y = 0.5;

  // move the sprite to the center of the screen
  bunny.position.x = 200;
  bunny.position.y = 150;

  stage.addChild(bunny);

  // start animating
  animate();
  function animate() {
      requestAnimationFrame(animate);

      // just for fun, let's rotate mr rabbit a little
      bunny.rotation += 0.1;

      // render the container
      renderer.render(stage);
  }
});
