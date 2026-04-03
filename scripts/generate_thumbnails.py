import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONFIG = json.loads((ROOT / "config.json").read_text())
THUMB_DIR = ROOT / "media" / "thumbnails"
THUMB_SCENE = ROOT / "scripts" / "_thumb_scene.py"

SCENE_TEMPLATE = '''from manim import *

class Thumbnail(Scene):
    def construct(self):
        self.camera.background_color = "{bg}"
        title = Text("{title}", font_size=52, weight=BOLD, color=WHITE)
        title.set_width(12)
        self.add(title)
'''

COLORS = {
    "git": "#e44c30",
    "dns": "#1a73e8",
    "docker": "#0db7ed",
    "https": "#2e7d32",
    "bigo": "#ff6f00",
    "jwt": "#6a1b9a",
    "css": "#e91e63",
    "git_branching": "#f57c00",
    "rest_graphql": "#7b1fa2",
    "load_balancer": "#00838f",
}


def generate(topic):
    entry = CONFIG["topics"][topic]
    title = entry["title"]
    bg = COLORS.get(topic, "#1a1a2e")

    THUMB_SCENE.write_text(SCENE_TEMPLATE.format(title=title, bg=bg))

    THUMB_DIR.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [sys.executable, "-m", "manim", "render", "-s", "-qh",
         "--media_dir", str(THUMB_DIR),
         str(THUMB_SCENE), "Thumbnail"],
        check=True,
    )

    # Move rendered image to named thumbnail
    images_dir = THUMB_DIR / "videos" / "_thumb_scene" / "1080p60"
    for img in images_dir.glob("*.png"):
        img.rename(THUMB_DIR / f"{topic}.png")
        break

    THUMB_SCENE.unlink(missing_ok=True)
    print(f"✅ {topic}.png")


def main():
    topics = sys.argv[1:] if len(sys.argv) > 1 else CONFIG["render"]
    for topic in topics:
        if topic not in CONFIG["topics"]:
            print(f"Unknown topic: {topic}")
            sys.exit(1)
        generate(topic)


if __name__ == "__main__":
    main()
