package com.deseteral.oudjo;

import com.google.gson.Gson;

import static spark.Spark.*;
import static spark.SparkBase.stop;

public class WebService {

    private int port;
    private Gson gson;

    public WebService(int port) {

        this.port = port;
        port(port);

        this.gson = OudjoApp.createGson();
    }

    public void initialize() {

        get("/version", (req, res) -> gson.toJson(OudjoApp.VERSION));
    }

    public void stopWebService() {
        stop();
    }

    public int getPort() {
        return port;
    }
}
