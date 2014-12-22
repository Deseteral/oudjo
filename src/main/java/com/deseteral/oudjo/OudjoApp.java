package com.deseteral.oudjo;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class OudjoApp extends Application {

    public static final String VERSION = "1.0.0";

    static Database database;
    static OudjoPlayer player;
    static WebService webService;

    @Override
    public void start(Stage primaryStage) throws Exception {

        Parent root = FXMLLoader.load(getClass().getResource("/control_panel_window.fxml"));
        primaryStage.setTitle("oudjo control panel");
        primaryStage.setScene(new Scene(root, 300, 175));
        primaryStage.show();

        // Stop the web service when window closes
        primaryStage.setOnCloseRequest(event -> {
            if (webService != null)
                webService.stopWebService();
        });
    }

    public static void initializeApp(String path) {

        OudjoApp.database = new Database(path);

        player = new OudjoPlayer();

        OudjoApp.webService = new WebService(4567);
        OudjoApp.webService.initialize();
    }

    public static void main(String[] args) {
        launch(args);
    }

    public static Gson createGson() {
        return new GsonBuilder()
                .excludeFieldsWithoutExposeAnnotation()
                .setPrettyPrinting()
                .create();
    }
}
