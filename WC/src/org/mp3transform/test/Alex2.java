package org.mp3transform.test;

import java.io.File;
import java.io.IOException;

import javax.sound.sampled.AudioFormat;
import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.LineUnavailableException;
import javax.sound.sampled.SourceDataLine;
import javax.sound.sampled.UnsupportedAudioFileException;

public class Alex2 {
	private int bufferSize = 4096; // Tamanho de buffer padrão 4k
	private volatile boolean paused = false;
	private final Object lock = new Object();
	private SourceDataLine line;
	private int secondsFade = 0;

	public static void main(String[] args) throws UnsupportedAudioFileException, IOException, LineUnavailableException, InterruptedException {
		Alex2 alex = new Alex2();
		alex.play(new File("C:\\Users\\Hawkes\\git\\WC\\WebContent\\resources\\originalUpload\\test.mp3"));
	}

	public void play(File file)
			throws UnsupportedAudioFileException, IOException, LineUnavailableException, InterruptedException {
		AudioInputStream encoded = AudioSystem.getAudioInputStream(file);
		AudioFormat encodedFormat = encoded.getFormat();
		AudioFormat decodedFormat = this.getDecodedFormat(encodedFormat);
		Long duration = null;
		AudioInputStream currentDecoded = AudioSystem.getAudioInputStream(decodedFormat, encoded);
		line = AudioSystem.getSourceDataLine(decodedFormat);
		line.open(decodedFormat);
		line.start();
		boolean fezFadeIn = false;
		boolean fezFadeOut = false;
		byte[] b = new byte[this.bufferSize];
		int i = 0;

	}

	protected AudioFormat getDecodedFormat(AudioFormat format) {
		AudioFormat decodedFormat = new AudioFormat(AudioFormat.Encoding.PCM_SIGNED, // Encoding
																						// to
																						// use
				format.getSampleRate(), // sample rate (same as base format)
				16, // sample size in bits (thx to Javazoom)
				format.getChannels(), // # of Channels
				format.getChannels() * 2, // Frame Size
				format.getSampleRate(), // Frame Rate
				false // Big Endian
		);
		return decodedFormat;
	}

}