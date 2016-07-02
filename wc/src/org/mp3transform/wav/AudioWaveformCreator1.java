package org.mp3transform.wav;

import java.io.File;
import java.io.IOException;
import java.util.Vector;

import javax.sound.sampled.AudioFormat;
import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.UnsupportedAudioFileException;

public class AudioWaveformCreator1 {


	public Vector<Coordinate> createWaveForm(File file, int samplesPerSecond)
			throws UnsupportedAudioFileException, IOException {

		byte[] audioBytes = null;
		AudioInputStream audioInputStream = AudioSystem
				.getAudioInputStream(file);

		long duration = getDuration(audioInputStream);

		AudioFormat format = audioInputStream.getFormat();

		audioBytes = new byte[(int) (audioInputStream.getFrameLength() * format
				.getFrameSize())];

		audioInputStream.read(audioBytes);

		int w = (int) duration/1000 * (samplesPerSecond);
		
		int h = 200;
		int[] audioData = null;

		if (format.getSampleSizeInBits() == 16) {
			int nlengthInSamples = audioBytes.length / 2;
			audioData = new int[nlengthInSamples];
			if (format.isBigEndian()) {
				for (int i = 0; i < nlengthInSamples; i++) {
					/* First byte is MSB (high order) */
					int MSB = (int) audioBytes[2 * i];
					/* Second byte is LSB (low order) */
					int LSB = (int) audioBytes[2 * i + 1];
					audioData[i] = MSB << 8 | (255 & LSB);
				}
			} else {
				for (int i = 0; i < nlengthInSamples; i++) {
					/* First byte is LSB (low order) */
					int LSB = (int) audioBytes[2 * i];
					/* Second byte is MSB (high order) */
					int MSB = (int) audioBytes[2 * i + 1];
					audioData[i] = MSB << 8 | (255 & LSB);
				}
			}
		} else if (format.getSampleSizeInBits() == 8) {
			int nlengthInSamples = audioBytes.length;
			audioData = new int[nlengthInSamples];
			if (format.getEncoding().toString().startsWith("PCM_SIGN")) {
				for (int i = 0; i < audioBytes.length; i++) {
					audioData[i] = audioBytes[i];
				}
			} else {
				for (int i = 0; i < audioBytes.length; i++) {
					audioData[i] = audioBytes[i] - 128;
				}
			}
		}

		int frames_per_pixel = audioBytes.length / format.getFrameSize() / w;
		byte my_byte = 0;
		int numChannels = format.getChannels();
		Vector<Coordinate> coors = new Vector<Coordinate>();

		for (int x = 0; x < w && audioData != null; x++) {
			int idx = (int) (frames_per_pixel * numChannels * x);
			if (format.getSampleSizeInBits() == 8) {
				my_byte = (byte) audioData[idx];
			} else {
				my_byte = (byte) (128 * audioData[idx] / 32768);
			}
			int y_new = (int) (h * (128 - my_byte) / 256);
			coors.add(new Coordinate(x, y_new, -1));

		}
		return coors;
	}

	private static long getDuration(AudioInputStream audioInputStream)
			throws UnsupportedAudioFileException, IOException {
		return (long) ((audioInputStream.getFrameLength() * 1000) / audioInputStream
				.getFormat().getFrameRate());

	}
}
