package test;

import java.io.File;
import java.io.IOException;

import org.jaudiotagger.audio.AudioFile;
import org.jaudiotagger.audio.AudioFileIO;
import org.jaudiotagger.audio.exceptions.CannotReadException;
import org.jaudiotagger.audio.exceptions.CannotWriteException;
import org.jaudiotagger.audio.exceptions.InvalidAudioFrameException;
import org.jaudiotagger.audio.exceptions.ReadOnlyFileException;
import org.jaudiotagger.tag.FieldDataInvalidException;
import org.jaudiotagger.tag.Tag;
import org.jaudiotagger.tag.TagException;
import org.jaudiotagger.tag.id3.AbstractID3v2Frame;
import org.jaudiotagger.tag.id3.ID3v11Tag;
import org.jaudiotagger.tag.id3.ID3v1Tag;
import org.jaudiotagger.tag.id3.ID3v22Tag;
import org.jaudiotagger.tag.id3.ID3v23Frame;
import org.jaudiotagger.tag.id3.ID3v23Tag;
import org.jaudiotagger.tag.id3.ID3v24Frame;
import org.jaudiotagger.tag.id3.ID3v24Tag;
import org.jaudiotagger.tag.id3.framebody.FrameBodyTXXX;

public class CustomTagText {

	public static void main(String [] args) throws CannotReadException, IOException, TagException, ReadOnlyFileException, InvalidAudioFrameException {
		CustomTagText customTagText = new CustomTagText();
		String description = "lyricrecorder.com";
		String text = "This is some text in my custom field!!";
		AudioFile f = AudioFileIO.read(new File("C:\\Users\\Alex\\Desktop\\04 Wasting My Young Years.mp3"));
		customTagText.setCustomTag(f, description, text);
	}

	public boolean setCustomTag(AudioFile audioFile, String description, String text) {
		FrameBodyTXXX txxxBody = new FrameBodyTXXX();
		txxxBody.setDescription(description);
		txxxBody.setText(text);

		// Get the tag from the audio file
		// If there is no ID3Tag create an ID3v2.3 tag
		Tag tag = audioFile.getTagOrCreateAndSetDefault();
		// If there is only a ID3v1 tag, copy data into new ID3v2.3 tag
		if (!(tag instanceof ID3v23Tag || tag instanceof ID3v24Tag)) {
			Tag newTagV23 = null;
			if (tag instanceof ID3v1Tag) {
				newTagV23 = new ID3v23Tag((ID3v1Tag) audioFile.getTag()); // Copy
																			// old
																			// tag
																			// data
			}
			if (tag instanceof ID3v22Tag) {
				newTagV23 = new ID3v23Tag((ID3v11Tag) audioFile.getTag()); // Copy
																			// old
																			// tag
																			// data
			}
			audioFile.setTag(newTagV23);
		}

		AbstractID3v2Frame frame = null;
		if (tag instanceof ID3v23Tag) {
			frame = new ID3v23Frame("TXXX");
		} else if (tag instanceof ID3v24Tag) {
			frame = new ID3v24Frame("TXXX");
		}

		frame.setBody(txxxBody);

		try {
			//tag.deleteField(description);
			tag.setField(frame);
		} catch (FieldDataInvalidException e) {
			e.printStackTrace();
			return false;
		}

		try {
			audioFile.commit();
		} catch (CannotWriteException e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}
}
