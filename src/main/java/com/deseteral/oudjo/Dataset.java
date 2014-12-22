package com.deseteral.oudjo;

import com.google.gson.annotations.Expose;

import java.util.ArrayList;
import java.util.List;

public class Dataset {

    @Expose
    private List<Song> songs;

    @Expose
    private int lastEntryId;

    public Dataset() {

        this.songs = new ArrayList<>();
        this.lastEntryId = 0;
    }

    public List<Song> getSongs() {
        return songs;
    }

    public void setSongs(List<Song> songs) {
        this.songs = songs;
    }

    public int getLastEntryId() {
        return lastEntryId;
    }

    public void resetLastEntryId() {
        lastEntryId = 0;
    }

    public void incrementLastEntryId() {
        lastEntryId++;
    }
}
