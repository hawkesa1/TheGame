package test;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.nio.file.Files;
import java.util.Vector;

import javax.sound.sampled.UnsupportedAudioFileException;

import org.apache.commons.io.FileExistsException;
import org.apache.commons.io.FileUtils;
import org.mp3transform.wav.AudioWaveFormCreator2;
import org.mp3transform.wav.Coordinate;

public class TestConversion {

	private static final String RESOURCES_FOLDER = "C:\\Users\\Hawkes\\git\\WC\\WebContent\\resources";
	private static final String AUDIO_CONVERT_EXECUTABLE = "C:\\Program Files (x86)\\NCH Software\\Switch\\switch.exe";
	
	private static final String COMMAND_STUB_1 = "cmd /c start "+RESOURCES_FOLDER+"\\scripts\\audioConvert1.bat ";
	private static final String COMMAND_STUB_2 = "cmd /c start "+RESOURCES_FOLDER+"\\scripts\\audioConvert2.bat ";
	private static final String SWITCH_PROCESS_ROOT = RESOURCES_FOLDER + "\\switchProcessing";
	private static final String SWITCH_PROCESS_QUEUE = SWITCH_PROCESS_ROOT + "\\1-queued";
	private static final String SWITCH_PROCESS_WAV = SWITCH_PROCESS_ROOT + "\\2-wav";
	private static final String SWITCH_PROCESS_MP3 = SWITCH_PROCESS_ROOT + "\\3-mp3";
	private static final String ORIGINAL_UPLOAD =  RESOURCES_FOLDER + "\\originalUpload\\";
	private static final String CONVERTED_MP3 =  RESOURCES_FOLDER + "\\convertedMp3\\";
	private static final String WAV_COORDINATES =  RESOURCES_FOLDER + "\\wavForm\\";

	public static void main(String[] args) throws UnsupportedAudioFileException, IOException, InterruptedException {
		String sourceAudioFileName = "1466528157471";
		String sourceAudioFileExtension = "mp3";
		TestConversion testConversion = new TestConversion();
		int i = 0;
		while (i < 1) {
			System.out.println("Running" + i);
			i++;
			testConversion.processFile(sourceAudioFileName, sourceAudioFileExtension);
		}
	}

	public Vector<Coordinate> processFile(String audioFileName, String sourceAudioFileExtension)
			throws IOException, InterruptedException, UnsupportedAudioFileException {

		String targetWavFilePath = SWITCH_PROCESS_WAV + "\\" + audioFileName + ".WAV";
		Vector<Coordinate> waveCoordinates = null;

		File originalUpload = new File(ORIGINAL_UPLOAD + "\\" + audioFileName + "." + sourceAudioFileExtension);
		File queuedOriginalFormat = new File(
				SWITCH_PROCESS_QUEUE + "\\" + audioFileName + "." + sourceAudioFileExtension);
		File convertedMp3 = new File(CONVERTED_MP3 + "\\" + audioFileName + "." + "MP3");
		// copy file from the originial upload folder to the queue folder
		FileUtils.copyFile(originalUpload, queuedOriginalFormat);

		// Convert any audio format to a WAV file
		convertAudioFileToWav(queuedOriginalFormat.getAbsolutePath());
		// Wait until the WAV file is ready
		File genertaedWavFile = getNewFile(targetWavFilePath);
		// Delete the queued original format file;
		deleteFile(queuedOriginalFormat);
		// Generate the WaveForm
		waveCoordinates = generateWaveCoordinatesFromWavFile(genertaedWavFile);
		writeCoordinatesToFile(WAV_COORDINATES + "\\" + audioFileName + ".TXT", waveCoordinates);

		System.out.println(waveCoordinates.size());
		// Convert the Wav file to an MP3
		convertWAVFileToMP3(targetWavFilePath);
		// Wait until the mp3 is ready
		File generatedMp3 = getNewFile(SWITCH_PROCESS_MP3 + "\\" + audioFileName + ".MP3");
		System.out.println(generatedMp3.exists());
		// Delete the Wav File
		deleteFile(genertaedWavFile);

		try {
			FileUtils.moveFile(generatedMp3, convertedMp3);
		} catch (FileExistsException e) {
			deleteFile(generatedMp3);
		}
		return waveCoordinates;
	}

	private void convertAudioFileToWav(String sourceAudioFilePathAndName) throws IOException {
		runBatchFile(COMMAND_STUB_1, AUDIO_CONVERT_EXECUTABLE, SWITCH_PROCESS_WAV, sourceAudioFilePathAndName);
	}

	private void convertWAVFileToMP3(String sourceAudioFilePathAndName) throws IOException {
		runBatchFile(COMMAND_STUB_2, AUDIO_CONVERT_EXECUTABLE, SWITCH_PROCESS_MP3, sourceAudioFilePathAndName);
	}

	private void runBatchFile(String commandStub, String audioConvertExecutable, String targetFolder,
			String sourceAudioFile) throws IOException {
		String command = commandStub + " \"" + AUDIO_CONVERT_EXECUTABLE + "\" \"" + targetFolder + "\" \""
				+ sourceAudioFile + "\"";
		System.out.println(command);
		Runtime.getRuntime().exec(command);
	}

	private void deleteFile(File file) throws IOException, InterruptedException {
		while (!file.renameTo(file)) {
			// Cannot read from file, windows still working on it.
			Thread.sleep(100);
			System.out.println("Sleeping while deleting");
		}
		Files.delete(file.toPath());
	}

	private File getNewFile(String filePath) throws InterruptedException {
		long startTime = System.currentTimeMillis();
		long elapsedTime = -1;
		File file = new File(filePath);
		while (!file.renameTo(file)) {
			// Cannot read from file, windows still working on it.
			Thread.sleep(100);
			elapsedTime = (System.currentTimeMillis() - startTime) / 1000;
			System.out.println("Waiting for file: " + file.getPath() + ". Elapsed Time=" + elapsedTime + " sec");
		}
		return file;
	}

	private Vector<Coordinate> generateWaveCoordinatesFromWavFile(File file)
			throws UnsupportedAudioFileException, IOException {
		AudioWaveFormCreator2 awc = new AudioWaveFormCreator2();
		int samplesPerSecond = 100;
		return awc.createWaveForm(file, samplesPerSecond);
	}

	private void writeCoordinatesToFile(String filePath, Vector<Coordinate> coordinates) throws IOException {
		Writer writer = null;

		try {
			writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(filePath), "utf-8"));

			for (Coordinate coordinate : coordinates) {
				writer.write(
						coordinate.getX() + "," + coordinate.getY_min() + "," + coordinate.getY_max() + newLineChar);
			}
		} catch (IOException ex) {
			throw ex;
		} finally {
			try {
				writer.close();
			} catch (Exception ex) {
			}
		}
	}

	static final String newLineChar = System.getProperty("line.separator");
}
