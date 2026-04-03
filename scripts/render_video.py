import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VIDEO_DIR = ROOT / "videos"
MUSIC = ROOT / "music.mp3"
CONFIG = json.loads((ROOT / "config.json").read_text())


def find_output(topic):
    entry = CONFIG["topics"][topic]
    scene = entry["scene"]
    media = ROOT / "media" / "videos"
    for mp4 in media.rglob(f"{scene}.mp4"):
        return mp4
    return None


def add_music(video_path):
    output = video_path.with_suffix(".final.mp4")
    subprocess.run(
        [
            "ffmpeg", "-y",
            "-i", str(video_path),
            "-i", str(MUSIC),
            "-map", "0:v",
            "-map", "1:a",
            "-c:v", "copy",
            "-shortest",
            "-af", "afade=t=out:st=-2:d=2",
            str(output),
        ],
        check=True,
        capture_output=True,
    )
    output.replace(video_path)


def render(topic):
    if topic not in CONFIG["topics"]:
        print(f"Unknown topic: {topic}. Available: {', '.join(CONFIG['topics'])}")
        sys.exit(1)
    entry = CONFIG["topics"][topic]
    subprocess.run(
        [sys.executable, "-m", "manim", "render", "-qm", str(VIDEO_DIR / entry["file"]), entry["scene"]],
        check=True,
    )
    mp4 = find_output(topic)
    if mp4 and MUSIC.exists():
        add_music(mp4)
        print(f"🎵 Added music to {mp4.name}")


def main():
    topics = sys.argv[1:] if len(sys.argv) > 1 else CONFIG["render"]
    for topic in topics:
        render(topic)


if __name__ == "__main__":
    main()
