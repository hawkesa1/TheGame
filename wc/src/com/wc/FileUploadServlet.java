package com.wc;

import java.io.BufferedWriter;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.Writer;
import java.util.List;
import java.util.Vector;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sound.sampled.UnsupportedAudioFileException;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.io.FilenameUtils;
import org.farng.mp3.MP3File;
import org.farng.mp3.TagException;
import org.farng.mp3.id3.AbstractID3v2;
import org.farng.mp3.id3.ID3v1;
import org.mp3transform.test.Alex;
import org.mp3transform.wav.Coordinate;

/**
 * Servlet implementation class FileUploadServlet
 */
@WebServlet("/FileUploadServlet")
public class FileUploadServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * Default constructor.
	 */
	public FileUploadServlet() {
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		String currentTime = Long.toString(System.currentTimeMillis());
		String userId=null;
		MP3MetaData mp3MetaData = null;
		try {
			List<FileItem> items = new ServletFileUpload(new DiskFileItemFactory()).parseRequest(request);
			for (FileItem item : items) {
				if (item.isFormField()) {
					String fieldName = item.getFieldName();
					String fieldValue = item.getString();
					if (fieldName.equals("userId")) {
						userId = fieldValue;
					}

				} else {
					mp3MetaData = processUploadedFile(item, currentTime);
					MP3MetaData.writeMP3MetaDataToDisk(mp3MetaData);
					User user = User.readUserFromDisk(userId);
					user.addTrackId(mp3MetaData.getUniqueId());
					user.writeUserToDisk();
				}
			}
		} catch (FileUploadException e) {
			throw new ServletException("Cannot parse multipart request.", e);
		} catch (UnsupportedAudioFileException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		// Set response content type
		response.setContentType("text/html");

		// Actual logic goes here.
		PrintWriter out = response.getWriter();

		// out.println("<h1>" + wavFormFile + "</h1>");

		response.sendRedirect("lyricRecorderUpload.html?trackId=" + mp3MetaData.getUniqueId() + "&trackTitle="
				+ mp3MetaData.getTitle() + "&trackAlbum=" + mp3MetaData.getAlbum() + "&trackArtist="
				+ mp3MetaData.getArtist());

	}

	
	//java -DRESOURCES_FOLDER="H:\Development\productionEnvironment\resources"
	
	private static String  RESOURCES_FOLDER = System.getProperty("RESOURCES_FOLDER");
	
	//private static final String RESOURCES_FOLDER = "C:\\Users\\Hawkes\\git\\WC\\WebContent\\resources";

	private MP3MetaData processUploadedFile(FileItem item, String currentTime)
			throws IOException, UnsupportedAudioFileException {
		String filePath1 = RESOURCES_FOLDER + "\\originalUpload\\" + currentTime + ".mp3";
		String filePath2 = RESOURCES_FOLDER + "\\generatedWav\\" + currentTime + ".wav";
		String filePath3 = RESOURCES_FOLDER + "\\wavForm\\" + currentTime + ".txt";
		
		System.out.println("RESOURCES_FOLDER="+ RESOURCES_FOLDER);
		
		writeUploadedFileToDisk(item, filePath1);
		Alex alex = new Alex();
		Vector<Coordinate> coordinates = alex.convertMP3ToWAV(filePath1, filePath2);
		writeCoordinatesToFile(filePath3, coordinates);
		MP3MetaData mp3MetaData = readMP3MetaData(currentTime);
		return mp3MetaData;
	}

	private MP3MetaData readMP3MetaData(String currentTime) {
		String filePath = RESOURCES_FOLDER + "\\originalUpload\\" + currentTime + ".mp3";
		MP3MetaData mp3MetaData = new MP3MetaData();
		try {
			MP3File mp3file = new MP3File(filePath);
			ID3v1 tagv1 = mp3file.getID3v1Tag();
			AbstractID3v2 tagv2 = mp3file.getID3v2Tag();

			if (tagv1 == null) {
				mp3MetaData.setTitle(tagv2.getSongTitle());
				mp3MetaData.setAlbum(tagv2.getAlbumTitle());
				mp3MetaData.setArtist(tagv2.getLeadArtist());
			} else {
				mp3MetaData.setTitle(tagv1.getTitle());
				mp3MetaData.setAlbum(tagv1.getAlbum());
				mp3MetaData.setArtist(tagv1.getArtist());
			}
			mp3MetaData.setUniqueId(currentTime);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (TagException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return mp3MetaData;
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

	private void writeUploadedFileToDisk(FileItem item, String filePath) throws IOException {

		// Process form file field (input type="file").
		String fieldname = item.getFieldName();
		String filename = FilenameUtils.getName(item.getName());
		System.out.println(filename);
		InputStream inputStream = item.getInputStream();
		OutputStream os = new FileOutputStream(filePath);
		byte[] buffer = new byte[1024];
		int bytesRead;
		// read from is to buffer
		while ((bytesRead = inputStream.read(buffer)) != -1) {
			os.write(buffer, 0, bytesRead);
		}
		inputStream.close();
		// flush OutputStream to write any buffered data to file
		os.flush();
		os.close();
	}

}
