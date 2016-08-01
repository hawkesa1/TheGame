package com.wc;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;

import org.jaudiotagger.audio.AudioFileIO;
import org.jaudiotagger.audio.exceptions.CannotReadException;
import org.jaudiotagger.audio.exceptions.CannotWriteException;
import org.jaudiotagger.audio.exceptions.InvalidAudioFrameException;
import org.jaudiotagger.audio.exceptions.ReadOnlyFileException;
import org.jaudiotagger.audio.mp3.MP3File;
import org.jaudiotagger.tag.TagException;

public class TagEditorTest {
	public static void main(String[] args) throws CannotReadException, IOException, TagException, ReadOnlyFileException,
			InvalidAudioFrameException, CannotWriteException {
		TagEditorTest tagEditorTest = new TagEditorTest();
		tagEditorTest.test();
	}

	public void test() throws CannotReadException, IOException, TagException, ReadOnlyFileException,
			InvalidAudioFrameException, CannotWriteException {

		String testMp3File = "C:\\Users\\Hawkes\\Desktop\\04 Zombie.mp3";
		String testMp3File1 = "C:\\Users\\Hawkes\\git\\WC\\WebContent\\resources\\convertedMp3\\1468673276781.MP3";
		String testM4aFile = "C:\\Users\\Hawkes\\Desktop\\04 Zombie.m4a";
		String testWavFile = "C:\\Users\\Hawkes\\Desktop\\04 Zombie.wav";
		//writeTag(testMp3File);
		readAllTags(testMp3File1);

	}

	private void writeTag(String testFile) throws CannotReadException, IOException, TagException, ReadOnlyFileException,
			InvalidAudioFrameException, CannotWriteException {
		TagEditor tagEditor = new TagEditor();
		String description = "LYRICRECORDER.COM";
		String text = "<test>{'test123'}</test>";
		
		tagEditor.setCustomTag(new File(testFile), description, text);
	}

	private void readTag(String testFile)
			throws CannotReadException, IOException, TagException, ReadOnlyFileException, InvalidAudioFrameException {
		TagEditor tagEditor = new TagEditor();
		MP3File f1 = (MP3File) AudioFileIO.read(new File(testFile));
		System.out.println(tagEditor.readCustomTag(f1));
	}

	private void readAllTags(String testFile)
			throws CannotReadException, IOException, TagException, ReadOnlyFileException, InvalidAudioFrameException {
		TagEditor tagEditor = new TagEditor();
		File file = new File(testFile);
		HashMap<String, String> allTags = tagEditor.readAllTags(file);
		for (String key : allTags.keySet()) {
			System.out.println(key+":"+allTags.get(key));
		}
	}

}
