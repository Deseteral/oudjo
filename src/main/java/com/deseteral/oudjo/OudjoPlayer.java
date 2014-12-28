package com.deseteral.oudjo;

import com.google.gson.annotations.Expose;
import javafx.scene.media.Media;
import javafx.scene.media.MediaPlayer;

import java.util.ArrayList;
import java.util.List;

public class OudjoPlayer {

    private MediaPlayer mediaPlayer;

    private int currentSong;
    private List<Song> playlist;

    private double volume;

    private boolean isPlaying;

    public OudjoPlayer() {

        this.currentSong = 0;
        this.playlist = new ArrayList<>();

        this.volume = 1.0;
        this.isPlaying = false;
    }

    public void play() {

        if (playlist.size() == 0)
            return;

        if (mediaPlayer == null) {

            Song s = playlist.get(currentSong);

            if (s != null) {
                setupPlayer(s.getMedia());
            }
        }

        mediaPlayer.play();
        isPlaying = true;
    }

    public void pause() {

        if (mediaPlayer != null)
            mediaPlayer.pause();

        isPlaying = false;
    }

    public void stop() {

        if (mediaPlayer != null)
            mediaPlayer.stop();

        isPlaying = false;
    }

    public void next() {

        if (playlist.size() == 0)
            return;

        currentSong++;

        if (currentSong > playlist.size()-1)
            currentSong = 0;

        // Force play() to change mediaPlayer
        if (mediaPlayer != null) {
            mediaPlayer.dispose();
            mediaPlayer = null;
        }

        play();
    }

    public void previous() {

        if (playlist.size() == 0)
            return;

        currentSong--;

        if (currentSong < 0)
            currentSong = playlist.size()-1;

        // Force play() to change mediaPlayer
        if (mediaPlayer != null) {
            mediaPlayer.dispose();
            mediaPlayer = null;
        }

        play();
    }

    private void setupPlayer(Media song) {

        mediaPlayer = new MediaPlayer(song);
        mediaPlayer.setVolume(volume);
        mediaPlayer.setOnEndOfMedia(() -> next());
    }

    public OudjoPlayerStatus getStatus() {

        Song curr = null;

        if (playlist.size() == 0)
            curr = new Song(-1, "oudjo", "--", "", "");
        else
            curr = new Song(playlist.get(currentSong));

        return new OudjoPlayerStatus(curr, volume, isPlaying);
    }

    public void setVolume(int vol) {

        volume = vol / 100.0;

        if (mediaPlayer != null)
            mediaPlayer.setVolume(volume);
    }

    public double getVolume() {
        return volume;
    }

    public List<Song> getPlaylist() {
        return playlist;
    }

    public boolean isPlaying() {
        return isPlaying;
    }

    public class OudjoPlayerStatus {

        @Expose
        private Song currentSong;

        @Expose
        private int volume;

        @Expose
        private boolean isPlaying;

        public OudjoPlayerStatus(Song cs, double vol, boolean playing) {
            this.currentSong = cs;
            this.volume = (int) (vol * 100);
            this.isPlaying = playing;
        }

        public Song getCurrentSong() {
            return currentSong;
        }

        public double getVolume() {
            return volume / 100.0;
        }

        public boolean isPlaying() {
            return isPlaying;
        }
    }
}
