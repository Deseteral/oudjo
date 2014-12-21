package com.deseteral.oudjo;

import com.mpatric.mp3agic.ID3v2;
import com.mpatric.mp3agic.InvalidDataException;
import com.mpatric.mp3agic.Mp3File;
import com.mpatric.mp3agic.UnsupportedTagException;

import java.io.File;
import java.io.IOException;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.ArrayList;
import java.util.List;

public class Database {

    private List<Song> songs;
    private String path;

    private int lastEntryId;

    private DatabaseStatus status;

    enum DatabaseStatus {
        NOT_READY,
        READY,
        SCANNING_IN_PROGRESS
    }

    public Database(String path) {

        this.songs = new ArrayList<>();
        this.path = path;
        this.lastEntryId = 0;
        this.status = DatabaseStatus.NOT_READY;

        File f = new File(getPathToDatabaseFile());

        if (f.exists()) {
            // load database from file
        } else {
            // start scanning
            scan();
        }
    }

    public void scan() {

        status = DatabaseStatus.SCANNING_IN_PROGRESS;

        // destroy the old database
        clear();

        File directory = new File(getPath());
        try {
            Files.walkFileTree(directory.toPath(), new OudjoFileVisitor(songs));
        } catch (IOException e) {
            e.printStackTrace();
        }

        status = DatabaseStatus.READY;
    }

    public void clear() {
        lastEntryId = 0;
        songs.clear();
    }

    public int getSongCount() {
        return songs.size();
    }

    public String getPath() {
        return path;
    }

    public String getPathToDatabaseFile() {
        return String.format("%s/oudjo.json", path);
    }

    public DatabaseStatus getStatus() {
        return status;
    }

    public void setStatus(DatabaseStatus status) {
        this.status = status;
    }

    class OudjoFileVisitor extends SimpleFileVisitor<Path> {

        private List<Song> songs;

        public OudjoFileVisitor(List<Song> songs) {
            this.songs = songs;
        }

        @Override
        public FileVisitResult visitFile(Path file, BasicFileAttributes attrs)
                throws IOException {

            if (file.toString().toLowerCase().endsWith(".mp3")) {

                Mp3File tagFile = null;
                try {
                    tagFile = new Mp3File(file.toString());
                } catch (UnsupportedTagException e) {
                    e.printStackTrace();
                } catch (InvalidDataException e) {
                    e.printStackTrace();
                }

                ID3v2 tag = tagFile.getId3v2Tag();

                Song song = new Song();

                song.setId(lastEntryId);
                lastEntryId++;

                song.setTitle(tag.getTitle());
                song.setArtist(tag.getArtist());
                song.setAlbum(tag.getAlbum());
                song.setYear(tag.getYear());

                songs.add(song);
            }

            return FileVisitResult.CONTINUE;
        }
    }
}
