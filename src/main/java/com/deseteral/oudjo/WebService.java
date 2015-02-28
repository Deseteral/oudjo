package com.deseteral.oudjo;

import com.google.gson.Gson;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static spark.Spark.*;
import static spark.SparkBase.stop;

public class WebService {

    private int port;
    private Gson gson;

    private boolean isRunning;

    public WebService(int port) {

        this.isRunning = false;

        this.port = port;
        port(port);

        this.gson = OudjoApp.createGson();
    }

    public void initialize() {

        isRunning = true;

        // Frontend files location
        String viewPath = getClass().getResource("/view").getPath();
        viewPath = viewPath.substring(1, viewPath.length());
        externalStaticFileLocation(viewPath);

        get("/version", (req, res) -> gson.toJson(OudjoApp.VERSION));

        // Player
        get("/player/status", (req, res) ->
                gson.toJson(OudjoApp.player.getStatus()));

        get("/player/play", (req, res) -> {
            if (!OudjoApp.player.isPlaying())
                OudjoApp.player.play();
            else
                OudjoApp.player.pause();

            return gson.toJson(OudjoApp.player.getStatus());
        });

        get("/player/pause", (req, res) -> {
            OudjoApp.player.pause();
            return gson.toJson(OudjoApp.player.getStatus());
        });

        get("/player/stop", (req, res) -> {
            OudjoApp.player.stop();
            return gson.toJson(OudjoApp.player.getStatus());
        });

        get("/player/next", (req, res) -> {
            OudjoApp.player.next();
            return gson.toJson(OudjoApp.player.getStatus());
        });

        get("/player/previous", (req, res) -> {
            OudjoApp.player.previous();
            return gson.toJson(OudjoApp.player.getStatus());
        });

        post("/player/volume/:value", (req, res) -> {
            int vol = Integer.parseInt(req.params(":value"));
            OudjoApp.player.setVolume(vol);

            return gson.toJson(OudjoApp.player.getStatus());
        });

        // Player playlist
        get("/player/playlist", (req, res) -> {
            List<Integer> playlist = OudjoApp.player.getPlaylistSongs()
                    .map(Song::getId)
                    .collect(Collectors.toList());

            return gson.toJson(playlist);
        });

        post("/player/playlist/add/:id", (req, res) -> {

            // Check if id is equal to "all"
            // If it is - add all songs from library to play queue
            // If not - try to parse id, and add specific song
            if (req.params(":id").equals("all")) {
                // Clear queue
                OudjoApp.player.clearPlaylist();

                List<Song> allSongs = OudjoApp.database.getSongsByQuery("*")
                        .collect(Collectors.toList());

                // Add all songs
                for (Song s : allSongs) {
                    OudjoApp.player.addSongToPlaylist(s);
                }
            } else {
                int id = parseSongId(req.params(":id"));
                if (id < 0)
                    return "";

                Song song = OudjoApp.database.getSongById(id);

                OudjoApp.player.addSongToPlaylist(song);
            }

            return "";
        });

        // Database
        get("/song/:id", (req, res) -> {
            int id = parseSongId(req.params(":id"));
            if (id < 0)
                return "";

            Song song = OudjoApp.database.getSongById(id);
            return gson.toJson(song);
        });

        get("/song/:id/art", (req, res) -> {
            byte[] albumArt;
            int id = parseSongId(req.params(":id"));

            if (id < 0) {
                albumArt = getDefaultAlbumArt();
            } else {
                Song song = OudjoApp.database.getSongById(id);
                albumArt = song.getAlbumArt();
            }

            if (albumArt != null && albumArt.length > 0) {
                OutputStream os = null;
                os = res.raw().getOutputStream();
                os.write(albumArt);
            }

            return "";
        });

        // Library
        get("/library/all", (req, res) -> {
            Stream<Song> stream = OudjoApp.database.getSongsByQuery("*");

            List<Song> ids = stream
                    .collect(Collectors.toList());

            return gson.toJson(ids);
        });
    }

    /**
     * Parse song id from web request
     * @param sid web request parameter
     * @return song id or -1 if sid is incorrect
     */
    private int parseSongId(String sid) {

        int id = -1;

        try {
            id = Integer.parseInt(sid);
        } catch (NumberFormatException ex) {
            return -1;
        }

        return id;
    }

    private byte[] getDefaultAlbumArt() {
        String filePath = getClass().getResource("/view/res/oudjo-album-art.png").getPath();
        filePath = filePath.substring(1, filePath.length());

        Path path = Paths.get(filePath);
        try {
            return Files.readAllBytes(path);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return null;
    }

    public void stopWebService() {

        if (isRunning) {
            stop();
            isRunning = false;
        }
    }

    public int getPort() {
        return port;
    }
}
