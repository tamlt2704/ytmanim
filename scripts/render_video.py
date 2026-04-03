import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VIDEO_DIR = ROOT / "videos"
CONFIG = json.loads((ROOT / "config.json").read_text())

def render(topic):
    if topic not in CONFIG["topics"]:
        print(f"Unknown topic: {topic}. Available: {', '.join(CONFIG['topics'])}")
        sys.exit(1)
    entry = CONFIG["topics"][topic]
    subprocess.run(
        [sys.executable, "-m", "manim", "render", "-qm", str(VIDEO_DIR / entry["file"]), entry["scene"]],
        check=True,
    )

def main():
    topics = sys.argv[1:] if len(sys.argv) > 1 else CONFIG["render"]
    for topic in topics:
        render(topic)

if __name__ == "__main__":
    main()
