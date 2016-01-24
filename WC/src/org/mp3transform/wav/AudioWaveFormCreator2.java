package org.mp3transform.wav;

import java.io.File;
import java.io.IOException;
import java.util.Vector;

import javax.sound.sampled.AudioFormat;
import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.UnsupportedAudioFileException;

public class AudioWaveFormCreator2 {

	public Vector<Coordinate> createWaveForm(File file, int samplesPerSecond)
			throws UnsupportedAudioFileException, IOException {
		byte[] audioBytes = null;
		AudioInputStream audioInputStream = AudioSystem
				.getAudioInputStream(file);
		int duration = getDuration(audioInputStream);
		AudioFormat format = audioInputStream.getFormat();
		audioBytes = new byte[(int) (audioInputStream.getFrameLength() * format
				.getFrameSize())];
		audioInputStream.read(audioBytes);

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

		byte my_byte = 0;
		Vector<Coordinate> coors = new Vector<Coordinate>();

		int y_max = 0;
		int y_min = 100;
		int frooms = audioData.length / (duration / (1000 / samplesPerSecond));

		System.out.println(frooms);
		Coordinate coor = null;
		for (int x = 0; x < audioData.length; x++) {
			if (format.getSampleSizeInBits() == 8) {
				my_byte = (byte) audioData[x];
			} else {
				my_byte = (byte) (128 * audioData[x] / 32768);
			}
			int y_new = (int) (h * (128 - my_byte) / 256);
			if (y_new > y_max) {
				y_max = y_new;
			}
			if (y_new < y_min) {
				y_min = y_new;
			}
			if (x % frooms == 0) {
				coor = new Coordinate(x / (audioData.length / duration),
						-(100 - y_min), (y_max - 100));
				coors.add(coor);
				System.out.println(coor.toString());
				y_max = 100;
				y_min = 100;
			}
		}
		System.out.println(coors.size());

		return coors;
	}

	private static int getDuration(AudioInputStream audioInputStream)
			throws UnsupportedAudioFileException, IOException {
		return (int) ((audioInputStream.getFrameLength() * 1000) / audioInputStream
				.getFormat().getFrameRate());

	}
}
