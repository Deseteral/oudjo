package com.deseteral.oudjo;

import com.google.gson.Gson;
import com.google.gson.annotations.Expose;
import com.mpatric.mp3agic.ID3v2;
import com.mpatric.mp3agic.InvalidDataException;
import com.mpatric.mp3agic.Mp3File;
import com.mpatric.mp3agic.UnsupportedTagException;

import java.io.*;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class Database {

    @Expose
    private Dataset dataset;

    private String path;
    private DatabaseStatus status;

    enum DatabaseStatus {
        NOT_READY,
        READY,
        SCANNING_IN_PROGRESS
    }

    public Database(String path) {

        this.dataset = new Dataset();
        this.path = path;
        this.status = DatabaseStatus.NOT_READY;

        File f = new File(getPathToDatabaseFile());

        if (f.exists()) {
            // load database from file
            loadFromFile();
        } else {
            // start scanning
            scan();
        }
    }

    public void scan() {

        status = DatabaseStatus.SCANNING_IN_PROGRESS;

        // Destroy the old database
        clear();

        File directory = new File(getPath());
        try {
            Files.walkFileTree(directory.toPath(), new OudjoFileVisitor(dataset.getSongs()));
        } catch (IOException e) {
            e.printStackTrace();
        }

        writeToFile();

        status = DatabaseStatus.READY;
    }

    public void writeToFile() {

        // Creating JSON
        Gson gson = OudjoApp.createGson();

        // Creating file writer
        BufferedWriter writer = null;
        try {
            writer = new BufferedWriter(new FileWriter(new File(getPathToDatabaseFile())));
        } catch (IOException e) {
            System.err.println("Couldn't create writer for the database");
            e.printStackTrace();
        }

        // Writing to file
        try {
            writer.write(gson.toJson(dataset));
        } catch (IOException e) {
            System.err.println("Couldn't write the database to the file");
            e.printStackTrace();
        }

        try {
            writer.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void loadFromFile() {

        status = DatabaseStatus.NOT_READY;

        // Create file reader
        BufferedReader reader = null;
        try {
            reader = new BufferedReader(new FileReader(new File(getPathToDatabaseFile())));
        } catch (FileNotFoundException e) {
            System.err.println("Couldn't create reader for the database");
            e.printStackTrace();
        }

        // Read from file
        String json = reader.lines()
                .collect(Collectors.joining("\n"));

        Gson gson = OudjoApp.createGson();
        dataset = gson.fromJson(json, Dataset.class);

        try {
            reader.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

        status = DatabaseStatus.READY;
    }

    public Song getSongById(int id) {

        return dataset.getSongStream()
                .filter(s -> s.getId() == id)
                .collect(Collectors.toList())
                .get(0);
    }

    public Stream<Song> getSongsByQuery(String query) {

        if (query.equals("*")) {
            return dataset.getSongStream();
        }

        return null;
    }

    public void clear() {
        dataset.resetLastEntryId();
        dataset.getSongs().clear();
    }

    public void addSong(Song s) {
        dataset.getSongs().add(s);
    }

    public int getSongCount() {
        return dataset.getSongs().size();
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

    public Dataset getDataset() {
        return dataset;
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

                song.setId(dataset.getLastEntryId());
                dataset.incrementLastEntryId();

                song.setTitle(tag.getTitle());
                song.setArtist(tag.getArtist());
                song.setAlbum(tag.getAlbum());
                song.setYear(tag.getYear());

                String relativePath = file.toString().substring(path.length(), file.toString().length());
                song.setPath(relativePath);

                songs.add(song);
            }

            return FileVisitResult.CONTINUE;
        }
    }
}
