package org.mp3transform.test;

import java.io.File;
import java.io.IOException;
import java.util.Vector;

import javax.sound.sampled.UnsupportedAudioFileException;

import org.mp3transform.wav.AudioWaveFormCreator2;
import org.mp3transform.wav.AudioWaveformCreator1;
import org.mp3transform.wav.Coordinate;
import org.mp3transform.wav.WavConverter;

public class Alex {

	public Vector<Coordinate> convertMP3ToWAV(String filePath1, String filePath2)
			throws UnsupportedAudioFileException, IOException {
		WavConverter.convert(filePath1, filePath2);
		File file = new File(filePath2);
		AudioWaveFormCreator2 awc = new AudioWaveFormCreator2();
		int samplesPerSecond = 100;
		return awc.createWaveForm(file, samplesPerSecond);
	}

}
