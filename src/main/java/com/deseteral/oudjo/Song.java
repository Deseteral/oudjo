package com.deseteral.oudjo;

public class Song {

    private int id;

    private String title;
    private String artist;
    private String album;
    private String year;

    private String path;

    public Song() {
        // allow to set id once
        this.id = -1;
    }

    @Override
    public String toString() {

        return String.format("[%d] %s - %s - %s %s", id, title, artist, album, year);
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {

        if (this.id == -1)
            this.id = id;
        else
            throw new SecurityException("You cannot change song id");
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
