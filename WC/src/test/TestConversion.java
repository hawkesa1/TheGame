package test;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Vector;

import javax.sound.sampled.UnsupportedAudioFileException;

import org.mp3transform.wav.AudioWaveFormCreator2;
import org.mp3transform.wav.Coordinate;

public class TestConversion {

	private static final String AUDIO_CONVERT_EXECUTABLE = "C:\\Program Files (x86)\\NCH Software\\Switch\\switch.exe";
	private static final String TARGET_FOLDER = "C:\\Users\\Hawkes\\Desktop\\TestConvFolder";
	private static final String COMMAND_STUB_1 = "cmd /c start C:\\Users\\Hawkes\\git\\WC\\scripts\\audioConvert1.bat ";
	private static final String COMMAND_STUB_2 = "cmd /c start C:\\Users\\Hawkes\\git\\WC\\scripts\\audioConvert2.bat ";

	public static void main(String[] args) throws UnsupportedAudioFileException, IOException, InterruptedException {
		String sourceFilePath = "C:\\Users\\Hawkes\\Desktop";
		String sourceAudioFileName = "04 Zombie";
		String sourceAudioFileExtension = "m4a";

		TestConversion testConversion = new TestConversion();
		int i=0;
		while (i <2) {
			System.out.println("Running" + i);
			i++;
			testConversion.generateWaveCoordinatesFromAudioFile(sourceAudioFileName, sourceFilePath,
					sourceAudioFileExtension);
		}
	}

	public Vector<Coordinate> generateWaveCoordinatesFromAudioFile(String audioFileName, String sourceAudioFilePath,
			String sourceAudioFileExtension) throws IOException, InterruptedException, UnsupportedAudioFileException {
		String sourceAudioFilePathAndName = sourceAudioFilePath + "\\" + audioFileName + "." + sourceAudioFileExtension;
		String targetWavFilePath = TARGET_FOLDER + "\\" + audioFileName + ".WAV";
		Vector<Coordinate> waveCoordinates = null;
		runBatchFile(COMMAND_STUB_1, AUDIO_CONVERT_EXECUTABLE, TARGET_FOLDER, sourceAudioFilePathAndName);
		File file = getNewFile(targetWavFilePath);
		waveCoordinates = generateWaveCoordinatesFromWavFile(file);
		System.out.println(waveCoordinates.size());
		deleteFile(file);
		runBatchFile(COMMAND_STUB_2, AUDIO_CONVERT_EXECUTABLE, TARGET_FOLDER, sourceAudioFilePathAndName);
		File file1 = getNewFile(TARGET_FOLDER + "\\" + audioFileName + ".mp3");
		System.out.println(file1.exists());
		deleteFile(file1);
		return waveCoordinates;
	}

	public void runBatchFile(String commandStub, String audioConvertExecutable, String targetFolder,
			String sourceAudioFile) throws IOException {
		String command = commandStub + " \"" + AUDIO_CONVERT_EXECUTABLE + "\" \"" + TARGET_FOLDER + "\" \""
				+ sourceAudioFile + "\"";
		System.out.println(command);
		Runtime.getRuntime().exec(command);
	}

	public void deleteFile(File file) throws IOException, InterruptedException {
		while (!file.renameTo(file)) {
			// Cannot read from file, windows still working on it.
			Thread.sleep(100);
			file.setWritable(true);
			System.out.println("Sleeping1");
		}
		Files.delete(file.toPath());
	}

	public File getNewFile(String filePath) throws InterruptedException {
		File file = new File(filePath);
		while (!file.renameTo(file)) {
			// Cannot read from file, windows still working on it.
			Thread.sleep(100);
			System.out.println("Sleeping");
		}
		return file;
	}

	private Vector<Coordinate> generateWaveCoordinatesFromWavFile(File file)
			throws UnsupportedAudioFileException, IOException {
		AudioWaveFormCreator2 awc = new AudioWaveFormCreator2();
		int samplesPerSecond = 100;
		return awc.createWaveForm(file, samplesPerSecond);
	}
}
