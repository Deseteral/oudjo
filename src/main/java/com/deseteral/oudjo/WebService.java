package com.deseteral.oudjo;

import com.google.gson.Gson;

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

        staticFileLocation("/com/deseteral/oudjo/view");

        get("/version", (req, res) -> gson.toJson(OudjoApp.VERSION));

        // Player
        get("/player/play", (req, res) -> {
            OudjoApp.player.play();
            return "";
        });

        get("/player/pause", (req, res) -> {
            OudjoApp.player.pause();
            return "";
        });

        get("/player/stop", (req, res) -> {
            OudjoApp.player.stop();
            return "";
        });

        get("/player/next", (req, res) -> {
            OudjoApp.player.next();
            return "";
        });

        get("/player/previous", (req, res) -> {
            OudjoApp.player.previous();
            return "";
        });

        // Database
        get("/song/:id", (req, res) -> {
            int id = Integer.parseInt(req.params(":id"));
            Song song = OudjoApp.database.getSongById(id);
            return gson.toJson(song);
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
