package com.deseteral.oudjo.tests;

import com.deseteral.oudjo.Database;
import com.deseteral.oudjo.Song;
import org.junit.Test;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.junit.Assert.assertEquals;

public class DatabaseQueryTests {

    private String path;

    public DatabaseQueryTests() {

        String fileName = "/oudjo.json";
        path = getClass().getResource(fileName).getPath();

        path = path.substring(1, path.length());
        path = path.substring(0, path.length() - fileName.length());
    }

    @Test
    public void testGetSongById() throws Exception {

        Database database = new Database(path);

        Song s1 = database.getSongById(2);
        Song s2 = database.getSongById(16);
        Song s3 = database.getSongById(32);
        Song s4 = database.getSongById(38);

        assertEquals(s1.toString(), "[2] Pompeii - Bastille - Bad Blood (The Extended Cut) - 2013");
        assertEquals(s2.toString(), "[16] Strobe - Deadmau5 - For Lack Of A Better Name - 2009");
        assertEquals(s3.toString(), "[32] Ride - Lana Del Rey - Born To Die - The Paradise Edition - 2012");
        assertEquals(s4.toString(), "[38] Still Alive - Lisa Miskovsky - Mirror's Edge OST - 2008");
    }

    @Test
    public void testGetAllSongsFromLibrary() throws Exception {

        Database database = new Database(path);

        String query = "*";
        Stream<Song> songsStream = database.getSongsByQuery(query);
        List<Song> songs = songsStream.collect(Collectors.toList());

        assertEquals(songs.size(), 55);
    }
}
