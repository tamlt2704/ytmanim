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
    "git": "#e44c30", "dns": "#1a73e8", "docker": "#0db7ed",
    "https": "#2e7d32", "bigo": "#ff6f00", "jwt": "#6a1b9a",
    "css": "#e91e63", "git_branching": "#f57c00", "rest_graphql": "#7b1fa2",
    "load_balancer": "#00838f", "tcp_udp": "#0277bd", "http_methods": "#1565c0",
    "sql_joins": "#4527a0", "stack_queue": "#283593", "linked_list": "#00695c",
    "binary_search": "#e65100", "hash_table": "#4e342e", "recursion": "#880e4f",
    "oauth": "#1b5e20", "cors": "#b71c1c", "websockets": "#006064",
    "caching": "#f9a825", "cdn": "#0d47a1", "cicd": "#2e7d32",
    "kubernetes": "#326ce5", "microservices": "#5d4037", "sql_nosql": "#311b92",
    "acid": "#bf360c", "cap_theorem": "#1a237e", "race_condition": "#c62828",
    "deadlock": "#4a148c", "mutex": "#e65100", "pub_sub": "#00838f",
    "message_queue": "#33691e", "event_loop": "#f57f17", "callback_hell": "#b71c1c",
    "promises": "#1565c0", "async_await": "#00695c", "closure": "#4a148c",
    "hoisting": "#e65100", "prototype": "#283593", "virtual_dom": "#0097a7",
    "ssr_csr": "#6a1b9a", "cookies_sessions": "#795548", "xss": "#d32f2f",
    "sql_injection": "#b71c1c", "csrf": "#880e4f", "rate_limiting": "#1b5e20",
    "pagination": "#0277bd", "indexing": "#e65100", "sharding": "#4527a0",
    "replication": "#00695c", "proxy_reverse": "#37474f", "osi_model": "#1a237e",
    "tcp_handshake": "#0d47a1", "ip_address": "#006064", "subnetting": "#004d40",
    "encryption": "#1b5e20", "hashing": "#4e342e",
    "design_patterns": "#37474f",
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
