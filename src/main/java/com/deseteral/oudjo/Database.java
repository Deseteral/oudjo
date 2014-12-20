package com.deseteral.oudjo;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

public class Database {

    private List<Song> songs;
    private String path;

    public Database(String path) {

        this.songs = new ArrayList<>();
        this.path = path;

        File f = new File(getPathToDatabaseFile());

        if (f.exists()) {
            // load this file
        } else {
            // start scanning
        }
    }

    public String getPath() {
        return path;
    }

    public String getPathToDatabaseFile() {
        return String.format("%s/oudjo.json", path);
    }
}
