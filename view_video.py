"""Render Motion Canvas animation, add background music, and open the video."""
import subprocess
import sys
import os
import glob

MOTIONCANVAS_DIR = os.path.join("motioncanvas", "my-animation")
MUSIC_FILE = "music.mp3"
OUTPUT_DIR = os.path.join("output", "videos")


def render():
    print("Rendering Motion Canvas animation...")
    subprocess.run(["npx", "motion-canvas", "render"], cwd=MOTIONCANVAS_DIR, check=True, shell=True)


def find_rendered_video():
    for f in glob.glob(os.path.join(MOTIONCANVAS_DIR, "output", "**", "*.mp4"), recursive=True):
        return f
    return None


def add_music(video_path, output_path):
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    duration = subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "csv=p=0", video_path
    ], text=True).strip()
    print(f"Animation duration: {duration}s")
    subprocess.run([
        "ffmpeg", "-y", "-i", video_path,
        "-stream_loop", "-1", "-i", MUSIC_FILE,
        "-t", duration,
        "-map", "0:v", "-map", "1:a",
        "-c:v", "copy", "-c:a", "aac", "-shortest",
        output_path
    ], check=True)


def play(path):
    if sys.platform == "darwin":
        subprocess.run(["open", path])
    elif sys.platform == "win32":
        os.startfile(path)
    else:
        subprocess.run(["xdg-open", path])


if __name__ == "__main__":
    render()
    video = find_rendered_video()
    if not video:
        print("No video found after rendering.")
        sys.exit(1)
    output = os.path.join(OUTPUT_DIR, "final.mp4")
    add_music(video, output)
    print(f"Playing: {output}")
    play(output)
