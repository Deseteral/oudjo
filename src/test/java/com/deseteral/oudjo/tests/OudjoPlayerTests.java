package com.deseteral.oudjo.tests;

import com.deseteral.oudjo.Database;
import com.deseteral.oudjo.OudjoPlayer;
import com.deseteral.oudjo.Song;
import org.junit.Test;

import java.util.List;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;

public class OudjoPlayerTests {

    private String path;
    private Database database;

    public OudjoPlayerTests() {

        String fileName = "/oudjo.json";
        path = getClass().getResource(fileName).getPath();

        path = path.substring(1, path.length());
        path = path.substring(0, path.length() - fileName.length());

        database = new Database(path);
    }

    @Test
    public void testAddSongToPlayqueue() throws Exception {

        OudjoPlayer player = new OudjoPlayer();

        Song s1 = database.getSongById(2);
        Song s2 = database.getSongById(32);
        Song s3 = database.getSongById(16);
        Song s4 = database.getSongById(38);

        player.addSongToQueue(s1);
        player.addSongToQueue(s2);
        player.addSongToQueue(s3);
        player.addSongToQueue(s4);

        List<Song> pls = player.getQueueSongs()
                .collect(Collectors.toList());

        assertEquals(pls.get(0).toString(), "[2] Pompeii - Bastille - Bad Blood (The Extended Cut) - 2013");
        assertEquals(pls.get(1).toString(), "[32] Ride - Lana Del Rey - Born To Die - The Paradise Edition - 2012");
        assertEquals(pls.get(2).toString(), "[16] Strobe - Deadmau5 - For Lack Of A Better Name - 2009");
        assertEquals(pls.get(3).toString(), "[38] Still Alive - Lisa Miskovsky - Mirror's Edge OST - 2008");
    }

    @Test
    public void testRemoveSongFromPlayqueue() throws Exception {

        OudjoPlayer player = new OudjoPlayer();

        Song s1 = database.getSongById(2);
        Song s2 = database.getSongById(16);
        Song s3 = database.getSongById(32);
        Song s4 = database.getSongById(38);

        player.addSongToQueue(s1);
        player.addSongToQueue(s2);
        player.addSongToQueue(s3);
        player.addSongToQueue(s4);

        player.removeSongFormQueue(1);

        List<Song> pls = player.getQueueSongs()
                .collect(Collectors.toList());

        assertEquals(pls.get(0).toString(), "[2] Pompeii - Bastille - Bad Blood (The Extended Cut) - 2013");
        assertEquals(pls.get(1).toString(), "[32] Ride - Lana Del Rey - Born To Die - The Paradise Edition - 2012");
        assertEquals(pls.get(2).toString(), "[38] Still Alive - Lisa Miskovsky - Mirror's Edge OST - 2008");

        player.removeSongFormQueue(2);

        pls = player.getQueueSongs()
                .collect(Collectors.toList());

        assertEquals(pls.get(0).toString(), "[2] Pompeii - Bastille - Bad Blood (The Extended Cut) - 2013");
        assertEquals(pls.get(1).toString(), "[32] Ride - Lana Del Rey - Born To Die - The Paradise Edition - 2012");
    }
}
