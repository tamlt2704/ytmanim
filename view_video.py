"""Render a manim scene and open the resulting video."""
import subprocess
import sys
import os
import glob

SCENE_FILE = "videos/shorts/async_await/async_await.py"
SCENE_NAME = "AsyncAwait"

def render():
    cmd = [sys.executable, "-m", "manim", "render", "-ql", SCENE_FILE, SCENE_NAME]
    print(f"Running: {' '.join(cmd)}")
    subprocess.run(cmd, check=True)

def find_video():
    patterns = [
        f"media/videos/**/{SCENE_NAME}.mp4",
        f"media/videos/**/*.mp4",
    ]
    for pat in patterns:
        files = glob.glob(pat, recursive=True)
        if files:
            return max(files, key=os.path.getmtime)
    return None

def play(path):
    if sys.platform == "darwin":
        subprocess.run(["open", path])
    elif sys.platform == "win32":
        os.startfile(path)
    else:
        subprocess.run(["xdg-open", path])

if __name__ == "__main__":
    render()
    video = find_video()
    if video:
        print(f"Playing: {video}")
        play(video)
    else:
        print("No video file found after rendering.")
        sys.exit(1)
