package com.wc;

import java.io.File;
import java.io.IOException;

import org.jaudiotagger.audio.AudioFile;
import org.jaudiotagger.audio.AudioFileIO;
import org.jaudiotagger.audio.exceptions.CannotReadException;
import org.jaudiotagger.audio.exceptions.CannotWriteException;
import org.jaudiotagger.audio.exceptions.InvalidAudioFrameException;
import org.jaudiotagger.audio.exceptions.ReadOnlyFileException;
import org.jaudiotagger.audio.mp3.MP3File;
import org.jaudiotagger.tag.TagException;

public class TagEditorTest {
	public static void main(String[] args)
			throws CannotReadException, IOException, TagException, ReadOnlyFileException, InvalidAudioFrameException, CannotWriteException {
		TagEditorTest tagEditorTest = new TagEditorTest();
		tagEditorTest.test();
	}

	public void test()
			throws CannotReadException, IOException, TagException, ReadOnlyFileException, InvalidAudioFrameException, CannotWriteException {
		String description = "lyricrecorder.com";
		String text = "<test>{'test123'}</test>";
		AudioFile f = AudioFileIO.read(new File("C:\\Users\\Alex\\Desktop\\04 Wasting My Young Years.mp3"));
		TagEditor tagEditor = new TagEditor();
		tagEditor.setCustomTag(f, description, text);

		MP3File f1 = (MP3File) AudioFileIO.read(new File("C:\\Users\\Alex\\Desktop\\04 Wasting My Young Years.mp3"));
		tagEditor.readCustomTag(f1);
	}
}
