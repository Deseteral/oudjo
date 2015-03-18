package com.deseteral.oudjo;

import com.google.gson.annotations.Expose;
import javafx.scene.media.Media;
import javafx.scene.media.MediaPlayer;
import javafx.util.Duration;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Stream;

public class OudjoPlayer {

    private MediaPlayer mediaPlayer;

    private int currentSong;
    private List<Song> queue;

    private double volume;

    private boolean isPlaying;

    public OudjoPlayer() {

        this.currentSong = 0;
        this.queue = new ArrayList<>();

        this.volume = 1.0;
        this.isPlaying = false;
    }

    public synchronized void play() {

        if (queue.size() == 0)
            return;

        if (mediaPlayer == null) {

            Song s = queue.get(currentSong);

            if (s != null) {
                setupPlayer(s.getMedia());
            }
        }

        mediaPlayer.play();
        isPlaying = true;
    }

    public synchronized void pause() {

        if (mediaPlayer != null)
            mediaPlayer.pause();

        isPlaying = false;
    }

    public synchronized void stop() {

        if (mediaPlayer != null)
            mediaPlayer.stop();

        isPlaying = false;
    }

    public synchronized void next() {

        if (queue.size() == 0)
            return;

        currentSong++;

        if (currentSong > queue.size()-1)
            currentSong = 0;

        // Force play() to change mediaPlayer
        if (mediaPlayer != null) {
            mediaPlayer.dispose();
            mediaPlayer = null;
        }

        play();
    }

    public synchronized void previous() {

        if (queue.size() == 0)
            return;

        currentSong--;

        if (currentSong < 0)
            currentSong = queue.size()-1;

        // Force play() to change mediaPlayer
        if (mediaPlayer != null) {
            mediaPlayer.dispose();
            mediaPlayer = null;
        }

        play();
    }

    private synchronized void setupPlayer(Media song) {

        mediaPlayer = new MediaPlayer(song);
        mediaPlayer.setVolume(volume);
        mediaPlayer.setOnEndOfMedia(() -> next());
    }

    public synchronized OudjoPlayerStatus getStatus() {

        Song curr = null;

        if (queue.size() == 0)
            curr = new Song(-1, "oudjo", "--", "", "");
        else
            curr = new Song(queue.get(currentSong));

        return new OudjoPlayerStatus(curr, volume, isPlaying, getProgress());
    }

    public synchronized void setVolume(int vol) {

        volume = vol / 100.0;

        if (mediaPlayer != null)
            mediaPlayer.setVolume(volume);
    }

    public void addSongToQueue(Song s) {
        queue.add(s);
    }

    public Stream<Song> getQueueSongs() {
        return queue.stream();
    }

    public void clearQueue() {
        queue.clear();
    }

    public double getVolume() {
        return volume;
    }

    public boolean isPlaying() {
        return isPlaying;
    }

    public double getProgress() {

        if (mediaPlayer != null &&
                mediaPlayer.getCurrentTime() != null &&
                mediaPlayer.getTotalDuration() != null) {

            Duration currentTime = mediaPlayer.getCurrentTime();
            Duration totalDuration = mediaPlayer.getTotalDuration();

            return currentTime.toMillis() / totalDuration.toMillis();
        }

        return 0.0;
    }

    public void shuffle() {
        int currentSongId = queue.get(currentSong).getId();
        Collections.shuffle(queue);

        for (int i = 0; i < queue.size(); i++) {
            if (queue.get(i).getId() == currentSongId) {
                currentSong = i;
                return;
            }
        }
    }

    public class OudjoPlayerStatus {

        @Expose
        private Song currentSong;

        @Expose
        private int volume;

        @Expose
        private boolean isPlaying;

        @Expose
        private int progress;

        public OudjoPlayerStatus(Song cs, double vol, boolean playing, double progress) {
            this.currentSong = cs;
            this.volume = (int) (vol * 100);
            this.isPlaying = playing;
            this.progress = (int) (progress * 100);
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

        public int getProgress() {
            return progress;
        }
    }
}
