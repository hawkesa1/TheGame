package test;

import java.io.File;
import java.io.IOException;

import org.jaudiotagger.audio.AudioFile;
import org.jaudiotagger.audio.AudioFileIO;
import org.jaudiotagger.audio.AudioHeader;
import org.jaudiotagger.audio.exceptions.CannotReadException;
import org.jaudiotagger.audio.exceptions.InvalidAudioFrameException;
import org.jaudiotagger.audio.exceptions.ReadOnlyFileException;
import org.jaudiotagger.audio.mp3.MP3File;
import org.jaudiotagger.tag.FieldKey;
import org.jaudiotagger.tag.Tag;
import org.jaudiotagger.tag.TagException;
import org.jaudiotagger.tag.id3.AbstractID3v2Frame;
import org.jaudiotagger.tag.id3.AbstractID3v2Tag;
import org.jaudiotagger.tag.id3.ID3v24Frames;
import org.jaudiotagger.tag.id3.ID3v24Tag;
import org.jaudiotagger.tag.id3.framebody.AbstractFrameBodyTextInfo;
import org.jaudiotagger.tag.id3.framebody.FrameBodyCOMM;
import org.jaudiotagger.tag.id3.framebody.FrameBodyUSLT;

public class AudioTaggerTest {

	public static void main(String args[])
			throws CannotReadException, Exception, TagException, ReadOnlyFileException, InvalidAudioFrameException {
		AudioTaggerTest audioTaggerTest = new AudioTaggerTest();
		audioTaggerTest.doIt2();
	}

	private void doIt()
			throws CannotReadException, IOException, TagException, ReadOnlyFileException, InvalidAudioFrameException {
		System.out.println("Doing it");
		AudioFile f = AudioFileIO.read(new File("C:\\Users\\Alex\\Desktop\\1468673276781.MP3"));
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
		ID3v24Tag v24tag = f.getID3v2TagAsv24();

		f.hasID3v2Tag();

		AbstractID3v2Frame frame = v2Tag.getFirstField(ID3v24Frames.FRAME_ID_COMMENT);
		// (text.getBody().getId();

		System.out.println(frame.getBody().getClass().getName());
		if (frame.getBody() instanceof AbstractFrameBodyTextInfo) {
			AbstractFrameBodyTextInfo textBody = (AbstractFrameBodyTextInfo) frame.getBody();
			System.out.println("text:" + textBody.getText());
		} else if (frame.getBody() instanceof FrameBodyCOMM) {
			FrameBodyCOMM frameBodyComm = (FrameBodyCOMM) frame.getBody();
			System.out.println("comm" + frameBodyComm.getText());
		} else if (frame.getBody() instanceof FrameBodyUSLT) {
			FrameBodyUSLT frameBodyUSLT =(FrameBodyUSLT) frame.getBody();
			System.out.println("lyric" + frameBodyUSLT.getLyric());
		}

	}
}
