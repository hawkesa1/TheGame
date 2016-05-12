package com.wc;

import java.io.FileWriter;
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

/**
 * Servlet implementation class FileUploadServlet
 */
@WebServlet("/LyricUploadServlet")
public class LyricUploadServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * Default constructor.
	 */
	public LyricUploadServlet() {
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
		String jSONFormattedLyricData = request.getParameter("JSONFormattedLyricData");
		String songId = request.getParameter("songId");

		writeToFile(jSONFormattedLyricData, songId);
		response.setContentType("text/plain");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(currentTime);
	}

	private void writeToFile(String jSONFormattedLyricData, String songId) {
		String filePath1 = RESOURCES_FOLDER + "\\lyricData\\" + songId + ".json";
		try (FileWriter file = new FileWriter(filePath1)) {
			file.write(prettyPrintJSON(jSONFormattedLyricData));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	private String prettyPrintJSON(String JSONFormattedLyricData) {
		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		JsonParser jp = new JsonParser();
		JsonElement je = jp.parse(JSONFormattedLyricData);
		return gson.toJson(je);
	}

	private static final String RESOURCES_FOLDER = "C:\\Users\\Hawkes\\git\\WC\\WebContent\\resources";

}
