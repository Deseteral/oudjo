package com.deseteral.oudjo;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.TextField;

public class WindowController {

    @FXML
    private TextField txtDatabasePath;

    public void buttonStartPressed(ActionEvent event) {

        String path = txtDatabasePath.getText();
        OudjoApp.database = new Database(path);
    }
}
