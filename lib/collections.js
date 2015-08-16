/*
  Rooms Collection
  ==================
  Collection of lobbies

  playerIds: (array of strings) list of player ids
  playerSize: (integer)

*/

appRooms = new Mongo.Collection("rooms");

/*
  Messages Collection
  ==================
  Collection of messages organized by lobby

  room: (string)
  name: (string)
  message: (string)

*/

Messages = new Mongo.Collection("messages");
