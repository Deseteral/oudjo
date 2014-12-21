package com.deseteral.oudjo;

import com.google.gson.annotations.Expose;

public class Song {

    @Expose
    private int id;

    @Expose
    private String title;

    @Expose
    private String artist;

    @Expose
    private String album;

    @Expose
    private String year;

    @Expose
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

    public String getPath() {
        return path;
    }

    public void setPath(String path) {

        path = path.replace('\\', '/');
        this.path = path;
    }
}
