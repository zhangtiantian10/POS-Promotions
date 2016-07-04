describe("Player", function() {
  var Player = require('../../lib/jasmine_examples/Player');
  var Song = require('../../lib/jasmine_examples/Song');
  var player;
  var song;

  it("should be able to play a Song", function() {
    player = new Player();
    song = new Song();
    player.play(song);
    expect(player.currentlyPlayingSong).toEqual(song);
    expect(player.isPlaying).toEqual(true);
  });

  describe("when song has been paused", function() {
    it("should indicate that the song is currently paused", function() {
      player.play(song);
      player.pause();
      expect(player.isPlaying).not.toEqual(true);
    });

    it("should be possible to resume", function() {
      player.play(song);
      player.pause();
      player.resume();
      expect(player.isPlaying).toBeTruthy();
      expect(player.currentlyPlayingSong).toEqual(song);
    });
  });

  // demonstrates use of spies to intercept and test method calls
  it("tells the current song if the user has made it a favorite", function() {
    spyOn(song, 'persistFavoriteStatus');

    player.play(song);
    player.makeFavorite();

    expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true);
  });

  //demonstrates use of expected exceptions
  describe("#resume", function() {
    it("should throw an exception if song is already playing", function() {
      player.play(song);

      expect(function() {
        player.resume();
      }).toThrowError("song is already playing");
    });
  });
});
