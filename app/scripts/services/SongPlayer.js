

(function() {
    function SongPlayer($rootScope, Fixtures) {
        var SongPlayer = {};
        // @desc sets album data from Fixtures
        var currentAlbum = Fixtures.getAlbum();
        // /**
        // * @desc Buzz object audio file
        // * @type {Object}
        // */
        var currentBuzzObject = null;
        // /**
        // * @function setSong
        // * @desc Stops currently playing song and loads new audio file as currentBuzzObject
        // * @param {Object} song
        // */
        var setSong = function(song) {
            if (currentBuzzObject) {
                stopSong();
        };

        currentBuzzObject = new buzz.sound(song.audioUrl, {
            formats: ['mp3'],
            preload: true
        });
      //  timeupdate is a HTML5 audio event used with Buzz's bind() method
        currentBuzzObject.bind('timeupdate', function() {
            $rootScope.$apply(function() {
                SongPlayer.currentTime = currentBuzzObject.getTime();
            });
        });

            SongPlayer.currentSong = song;

      };

        var playSong = function() {
            currentBuzzObject.play();
            SongPlayer.currentSong.playing = true;
        };
        // * @function private, getSongIndex
        // * @desc gets the index of the current song from the fixtures object
        // * @param {Object} song
        var getSongIndex = function(song) {
            return currentAlbum.songs.indexOf(song);
        };

        var stopSong = function() {
          currentBuzzObject.stop();
          SongPlayer.currentSong.playing = null;
        };

        SongPlayer.currentSong = null;

        SongPlayer.volume = null;
        //  @desc Current playback time (in seconds) of currently playing song
        //  @type {Number}

        SongPlayer.currentTime = null;

        // * @function play
        // * @desc Play current or new song
        // * @param {Object} song
        SongPlayer.play = function(song) {
            // if another song is selected the if statement will check to for status
            song = song || SongPlayer.currentSong;
            if (SongPlayer.currentSong !== song) {

                setSong(song);

                playSong();

                } else if (SongPlayer.currentSong === song) {
                    if (currentBuzzObject.isPaused()) {
                        currentBuzzObject.play();
                    }
                }
        };
        // * @function pause
        // * @desc Pause current song
        // * @param {Object} song
        SongPlayer.pause = function(song) {
          song = song || SongPlayer.currentSong;
            currentBuzzObject.pause();
            song.playing = false;
        };
        // * @function previous
        // * @desc playes the previous song
        // * @param none
        SongPlayer.previous = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex--;

            if (currentSongIndex < 0) {
                stopSong();
            } else {
              var song = currentAlbum.songs[currentSongIndex];
              setSong(song);
              playSong(song);
            }
        };
        // * @function next
        // * @desc playes the next song
        // * @param none
        SongPlayer.next = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex++;

            if (currentSongIndex < 0) {
                stopSong();
            } else {
              var song = currentAlbum.songs[currentSongIndex];
              setSong(song);
              playSong(song);
            }
        };

        // @function setCurrentTime
        // @desc Set current time (in seconds) of currently playing song
        // @param {Number} time

        SongPlayer.setCurrentTime = function(time) {
             if (currentBuzzObject) {
                 currentBuzzObject.setTime(time);
             }
        };

        SongPlayer.setVolume = function(volume) {
          if (currentBuzzObject) {
              currentBuzzObject.setVolume(volume);
          }

        };

        return SongPlayer;
    }

     angular
         .module('blocJams')
         .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
 })();
