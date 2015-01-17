package com.deseteral.oudjo;

import com.google.gson.Gson;

import java.io.OutputStream;

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

        // Database
        get("/song/:id", (req, res) -> {
            int id = Integer.parseInt(req.params(":id"));
            Song song = OudjoApp.database.getSongById(id);
            return gson.toJson(song);
        });

        get("/song/:id/art", (req, res) -> {

            int id = Integer.parseInt(req.params(":id"));
            Song song = OudjoApp.database.getSongById(id);
            byte[] albumArt = song.getAlbumArt();

            if (albumArt != null && albumArt.length > 0) {
                OutputStream os = null;
                os = res.raw().getOutputStream();
                os.write(albumArt);
            }

            return null;
        });
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
