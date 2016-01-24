package org.mp3transform.wav;

public class Coordinate {
	private int x;
	private int y_min;
	private int y_max;

	public Coordinate(int x, int y_min, int y_max) {
		super();
		this.x = x;
		this.y_min = y_min;
		this.y_max = y_max;
	}

	public int getX() {
		return x;
	}

	public void setX(int x) {
		this.x = x;
	}

	public int getY_min() {
		return y_min;
	}

	public void setY_min(int y_min) {
		this.y_min = y_min;
	}

	public int getY_max() {
		return y_max;
	}

	public void setY_max(int y_max) {
		this.y_max = y_max;
	}

	public String toString() {
		return this.x + "," + this.y_min + "," + this.y_max;
	}

}