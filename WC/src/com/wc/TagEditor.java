package com.wc;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import org.jaudiotagger.audio.AudioFile;
import org.jaudiotagger.audio.AudioFileIO;
import org.jaudiotagger.audio.exceptions.CannotReadException;
import org.jaudiotagger.audio.exceptions.CannotWriteException;
import org.jaudiotagger.audio.exceptions.InvalidAudioFrameException;
import org.jaudiotagger.audio.exceptions.ReadOnlyFileException;
import org.jaudiotagger.audio.mp3.MP3File;
import org.jaudiotagger.tag.FieldDataInvalidException;
import org.jaudiotagger.tag.FieldKey;
import org.jaudiotagger.tag.Tag;
import org.jaudiotagger.tag.TagException;
import org.jaudiotagger.tag.TagField;
import org.jaudiotagger.tag.id3.AbstractID3v2Frame;
import org.jaudiotagger.tag.id3.AbstractID3v2Tag;
import org.jaudiotagger.tag.id3.ID3v23Frame;
import org.jaudiotagger.tag.id3.ID3v23Tag;
import org.jaudiotagger.tag.id3.ID3v24Frame;
import org.jaudiotagger.tag.id3.ID3v24Tag;
import org.jaudiotagger.tag.id3.framebody.FrameBodyTXXX;

public class TagEditor {

	public void setCustomTag(File file, String description, String text)
			throws CannotWriteException, CannotReadException, IOException, TagException, ReadOnlyFileException, InvalidAudioFrameException {
		
		MP3File mp3File = (MP3File) AudioFileIO.read(file);
		
		FrameBodyTXXX txxxBody = new FrameBodyTXXX();
		txxxBody.setDescription(description);
		txxxBody.setText(text);

		Tag tag = mp3File.getTagOrCreateAndSetDefault();
		AbstractID3v2Frame frame = null;
		if (tag instanceof ID3v23Tag) {
			frame = new ID3v23Frame("TXXX");
		} else if (tag instanceof ID3v24Tag) {
			frame = new ID3v24Frame("TXXX");
		} else {

		}
		frame.setBody(txxxBody);
		tag.setField(frame);
		mp3File.commit();
	}

	public HashMap<String, String> readAllTags(File file)
			throws CannotReadException, IOException, TagException, ReadOnlyFileException, InvalidAudioFrameException {
		AudioFile audioFile = AudioFileIO.read(file);
		Tag tag = audioFile.getTag();
		HashMap<String, String> hashMap = new HashMap<String, String>();
		for (FieldKey fieldKey : FieldKey.values()) {
			hashMap.put(fieldKey.toString(), tag.getFirst(fieldKey));
		}
		if (audioFile instanceof MP3File) {
			try {
				hashMap.put("LYRICRECORDER.COM", readCustomTag((MP3File) audioFile));
			} catch (Exception e) {
				hashMap.put("LYRICRECORDER.COM", "");
			}
		}
		return hashMap;
	}

	public String readCustomTag(MP3File mp3File)
			throws CannotReadException, IOException, TagException, ReadOnlyFileException, InvalidAudioFrameException {
		String text = "";
		AbstractID3v2Tag tag = mp3File.getID3v2Tag();
		AbstractID3v2Frame frame = tag.getFirstField("TXXX");
		FrameBodyTXXX frameBodyTXXX;
		if (frame != null) {
			frameBodyTXXX = (FrameBodyTXXX) frame.getBody();
			text = frameBodyTXXX.getFirstTextValue();
		}
		return text;
	}
}
