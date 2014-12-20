package com.deseteral.oudjo;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class Main extends Application {

    @Override
    public void start(Stage primaryStage) throws Exception {

        Parent root = FXMLLoader.load(getClass().getResource("/control_panel_window.fxml"));
        primaryStage.setTitle("oudjo control panel");
        primaryStage.setScene(new Scene(root, 300, 175));
        primaryStage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
