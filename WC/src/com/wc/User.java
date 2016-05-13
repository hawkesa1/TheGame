package com.wc;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Collection;
import java.util.Vector;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class User {

	public static void main(String[] args) throws IOException {
		User user = new User();
		user.setUserId("hawkesa");
		user.writeUserToDisk();
		User user1 = User.readUserFromDisk("hawkesa");
		System.out.println(user1.toJSON());
	}

	private String userId;
	private Collection<String> tracksIds;
	private Collection<MP3MetaData> mp3MetaDatas;

	public Collection<MP3MetaData> getMp3MetaDatas() {
		return mp3MetaDatas;
	}

	public void setMp3MetaDatas(Collection<MP3MetaData> mp3MetaDatas) {
		this.mp3MetaDatas = mp3MetaDatas;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public Collection<String> getTrackIds() {
		return tracksIds;
	}

	public void setTrackIds(Collection<String> tracks) {
		this.tracksIds = tracks;
	}

	public void addMP3MetaData(MP3MetaData mp3MetaData) {
		if (this.mp3MetaDatas == null) {
			mp3MetaDatas = new<MP3MetaData> Vector();
		}
		mp3MetaDatas.add(mp3MetaData);
	}

	public void addTrackId(String trackId) {
		if (this.tracksIds == null) {
			tracksIds = new<String> Vector();
		}
		tracksIds.add(trackId);
	}

	public static User readUserFromDisk(String userId) throws FileNotFoundException {
		Gson gson = new Gson();
		BufferedReader br = new BufferedReader(
				new FileReader("C:\\Users\\Hawkes\\git\\WC\\WebContent\\resources\\user\\" + userId + ".json"));
		User user = gson.fromJson(br, User.class);
		return user;
	}

	public void writeUserToDisk() throws IOException {
		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		String json = gson.toJson(this);
		FileWriter writer = new FileWriter(
				"C:\\Users\\Hawkes\\git\\WC\\WebContent\\resources\\user\\" + this.getUserId() + ".json");
		writer.write(json);
		writer.close();
	}

	public String toJSON() {
		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		return gson.toJson(this);
	}

}
