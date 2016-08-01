package com.wc;

import java.io.File;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;

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
import org.jaudiotagger.audio.exceptions.CannotReadException;
import org.jaudiotagger.audio.exceptions.InvalidAudioFrameException;
import org.jaudiotagger.audio.exceptions.ReadOnlyFileException;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import test.TestConversion;

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
		String userId = null;
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
					try {
						mp3MetaData = processUploadedFile(item, currentTime);
					} catch (InterruptedException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					MP3MetaData.writeMP3MetaDataToDisk(mp3MetaData);

					
					
					
					if (userId == null) {
						// got to fix thsi bit!
						userId = "hawkesa";
					}
					// User user = User.readUserFromDisk(userId);
					// user.addTrackId(mp3MetaData.getUniqueId());
					// user.writeUserToDisk();
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

		// response.sendRedirect("lyricRecorderUpload.html?trackId=" +
		// mp3MetaData.getUniqueId() + "&trackTitle="
		// + mp3MetaData.getTitle() + "&trackAlbum=" + mp3MetaData.getAlbum() +
		// "&trackArtist="
		// + mp3MetaData.getArtist());

		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(mp3MetaData.toJSON());
	}
	
	


	// java -DRESOURCES_FOLDER="H:\Development\productionEnvironment\resources"
	// private static final String RESOURCES_FOLDER =
	// "C:\\Users\\Hawkes\\git\\WC\\WebContent\\resources";
	private static String RESOURCES_FOLDER = System.getProperty("RESOURCES_FOLDER");

	private MP3MetaData processUploadedFile(FileItem item, String currentTime)
			throws IOException, UnsupportedAudioFileException, InterruptedException {
		String ext = FilenameUtils.getExtension(item.getName());
		String filePath1 = RESOURCES_FOLDER + "\\originalUpload\\" + currentTime + "." + ext;
		System.out.println("RESOURCES_FOLDER=" + RESOURCES_FOLDER);
		writeUploadedFileToDisk(item, filePath1);
		TestConversion testConversion = new TestConversion();
		testConversion.processFile(currentTime, ext, RESOURCES_FOLDER);
		MP3MetaData mp3MetaData = null;
		mp3MetaData = readMP3MetaData(currentTime, ext);
		return mp3MetaData;
	}

	private MP3MetaData readMP3MetaData(String currentTime, String ext) throws IOException {
		String filePath = RESOURCES_FOLDER + "\\originalUpload\\" + currentTime + "." + ext;
		TagEditor tagEditor = new TagEditor();
		File file = new File(filePath);
		HashMap<String, String> allTags = null;
		try {
			allTags = tagEditor.readAllTags(file);
		} catch (CannotReadException e) {
			e.printStackTrace();
		} catch (org.jaudiotagger.tag.TagException e) {
			e.printStackTrace();
		} catch (ReadOnlyFileException e) {
			e.printStackTrace();
		} catch (InvalidAudioFrameException e) {
			e.printStackTrace();
		}
		return convert(allTags, currentTime);
	}
	
	private  MP3MetaData convert(HashMap<String, String> allTags, String currentTime)
	{
		MP3MetaData mp3MetaData=new MP3MetaData();
		mp3MetaData.setAlbum(allTags.get("ALBUM"));
		mp3MetaData.setArtist(allTags.get("ARTIST"));
		mp3MetaData.setTitle(allTags.get("TITLE"));
		mp3MetaData.setUnsynchronisedLyrics(allTags.get("LYRICS"));
		mp3MetaData.setLyricRecorderSynchronisedLyrics(allTags.get("LYRICRECORDER.COM"));
		mp3MetaData.setAllTags(allTags);
		mp3MetaData.setUniqueId(currentTime);
		return mp3MetaData;
	}
	
	
	

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
