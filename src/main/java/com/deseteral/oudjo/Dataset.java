package com.deseteral.oudjo;

import com.google.gson.annotations.Expose;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

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

    public Stream<Song> getSongStream() {
        return songs.stream();
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
