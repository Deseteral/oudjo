package com.deseteral.oudjo;

public class Song {

    private String title;
    private String artist;
    private String album;
    private String year;

    private String path;

    @Override
    public String toString() {

        return String.format("%s - %s - %s %s", title, artist, album, year);
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getArtist() {
        return artist;
    }

    public void setArtist(String artist) {
        this.artist = artist;
    }

    public String getAlbum() {
        return album;
    }

    public void setAlbum(String album) {
        this.album = album;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }
}
