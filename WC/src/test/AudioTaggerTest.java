package test;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Iterator;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.jaudiotagger.audio.AudioFile;
import org.jaudiotagger.audio.AudioFileIO;
import org.jaudiotagger.audio.AudioHeader;
import org.jaudiotagger.audio.exceptions.CannotReadException;
import org.jaudiotagger.audio.exceptions.CannotWriteException;
import org.jaudiotagger.audio.exceptions.InvalidAudioFrameException;
import org.jaudiotagger.audio.exceptions.ReadOnlyFileException;
import org.jaudiotagger.audio.mp3.MP3File;
import org.jaudiotagger.tag.FieldKey;
import org.jaudiotagger.tag.Tag;
import org.jaudiotagger.tag.TagException;
import org.jaudiotagger.tag.TagField;
import org.jaudiotagger.tag.id3.AbstractID3v2Frame;
import org.jaudiotagger.tag.id3.AbstractID3v2Tag;
import org.jaudiotagger.tag.id3.ID3v24Frames;
import org.jaudiotagger.tag.id3.ID3v24Tag;
import org.jaudiotagger.tag.id3.framebody.AbstractFrameBodyTextInfo;
import org.jaudiotagger.tag.id3.framebody.FrameBodyCOMM;
import org.jaudiotagger.tag.id3.framebody.FrameBodySYLT;
import org.jaudiotagger.tag.id3.framebody.FrameBodyUSLT;

import com.drew.metadata.Metadata;
import com.drew.metadata.MetadataException;

public class AudioTaggerTest {

	public static void main(final String[] args)
			throws CannotReadException, Exception, TagException, ReadOnlyFileException, InvalidAudioFrameException {
		AudioTaggerTest audioTaggerTest = new AudioTaggerTest();
		audioTaggerTest.doIt2();
	}

	private void doIt()
			throws CannotReadException, IOException, TagException, ReadOnlyFileException, InvalidAudioFrameException {
		System.out.println("Doing it");
		AudioFile f = AudioFileIO.read(new File("C:\\Users\\Hawkes\\Desktop\\04 Wasting My Young Years"));
		Tag tag = f.getTag();

		AudioHeader a = f.getAudioHeader();

		f.getAudioHeader().getTrackLength();
		f.getAudioHeader().getSampleRateAsNumber();

		System.out.println(tag.getFirst(FieldKey.ARTIST));
		System.out.println(tag.getFirst(FieldKey.ALBUM));
		System.out.println(tag.getFirst(FieldKey.TITLE));
		System.out.println(tag.getFirst(FieldKey.COMMENT));
		System.out.println(tag.getFirst(FieldKey.YEAR));
		System.out.println(tag.getFirst(FieldKey.TRACK));
		System.out.println(tag.getFirst(FieldKey.DISC_NO));
		System.out.println(tag.getFirst(FieldKey.COMPOSER));
		System.out.println(tag.getFirst(FieldKey.ARTIST_SORT));

		// f.
		// f.hasID3v2Tag();

	}

	private void doIt2()
			throws CannotReadException, IOException, TagException, ReadOnlyFileException, InvalidAudioFrameException {

		MP3File f = (MP3File) AudioFileIO.read(new File("C:\\Users\\Alex\\Desktop\\04 Wasting My Young Years.mp3"));
		Tag tag = f.getTag();
		// ID3v1Tag v1Tag = (ID3v1Tag)tag;
		AbstractID3v2Tag v2Tag = f.getID3v2Tag();
		// ID3v24Tag v24tag = f.getID3v2TagAsv24();

		System.out.println("Has a idv32 tag: " + f.hasID3v2Tag());

		AbstractID3v2Frame frame = v2Tag.getFirstField(ID3v24Frames.FRAME_ID_ARTIST);

		Iterator<TagField> fields = v2Tag.getFields();

		TagField tf = null;
		while (fields.hasNext()) {
			tf = fields.next();
			// System.out.println(tf.getClass().getName());
			System.out.println(tf.getId()+ " " + tf.toString());
			System.out.println("");
		}

		// (text.getBody().getId();

		if (frame == null) {
			System.out.println("Frame is null");
		} else if (frame.getBody() instanceof AbstractFrameBodyTextInfo) {
			AbstractFrameBodyTextInfo textBody = (AbstractFrameBodyTextInfo) frame.getBody();
			System.out.println("text:" + textBody.getText());
		} else if (frame.getBody() instanceof FrameBodyCOMM) {
			FrameBodyCOMM frameBodyComm = (FrameBodyCOMM) frame.getBody();
			System.out.println("comm" + frameBodyComm.getText());
		} else if (frame.getBody() instanceof FrameBodyUSLT) {
			FrameBodyUSLT frameBodyUSLT = (FrameBodyUSLT) frame.getBody();
			System.out.println("uslyric" + frameBodyUSLT.getLyric());
		} else if (frame.getBody() instanceof FrameBodySYLT) {
			FrameBodySYLT frameBodySYLT = (FrameBodySYLT) frame.getBody();
			System.out.println("sylyric " + frameBodySYLT.getTextEncoding());
		} else {
			System.out.println("Nope");
		}

	}

	public void getMetadata()
			throws CannotReadException, IOException, TagException, ReadOnlyFileException, MetadataException {

		AudioFile audioFile;

		try {
			audioFile = AudioFileIO.read(new File("C:\\Users\\Alex\\Desktop\\1468673276781.MP3"));
		} catch (InvalidAudioFrameException ina) {
			return;
		} catch (FileNotFoundException fnf) {

			// configurator.getControlEngine().fireEvent(Events.LOAD_FILE, new
			// ValueEvent<String>(file.getAbsolutePath()));
			return;
		}
		if (audioFile instanceof MP3File) {
			MP3File audioMP3 = (MP3File) audioFile;
			// if (!audioMP3.hasID3v2Tag()) {
			// AbstractID3v2Tag id3v2tag = new ID3v24Tag();
			// audioMP3.setID3v2TagOnly(id3v2tag);
			// try {
			// audioFile.commit();
			// } catch (CannotWriteException cwe) {
			// System.out.println("An error occurs when I tried to update to ID3
			// v2");
			// cwe.printStackTrace();
			// }
			// }
			Tag tag = audioFile.getTag();
			AudioHeader header = audioFile.getAudioHeader();
			System.out.println("tag: " + ToStringBuilder.reflectionToString(tag));
			System.out.println("header: " + ToStringBuilder.reflectionToString(header));

		}

	}
}
