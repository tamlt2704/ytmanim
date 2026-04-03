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

        # Diagonal accent stripe
        stripe = Rectangle(width=20, height=2.5, fill_opacity=0.15, color=WHITE, stroke_width=0)
        stripe.rotate(15 * DEGREES)
        stripe.shift(DOWN * 0.5)
        self.add(stripe)

        # Corner accent circles
        c1 = Circle(radius=1.8, fill_opacity=0.08, color=WHITE, stroke_width=0).shift(UL * 3.5)
        c2 = Circle(radius=2.5, fill_opacity=0.06, color=WHITE, stroke_width=0).shift(DR * 3.5)
        self.add(c1, c2)

        # Bottom bar
        bar = Rectangle(width=15, height=0.15, fill_opacity=0.6, color="{accent}", stroke_width=0)
        bar.shift(DOWN * 2.2)
        self.add(bar)

        # Main title - big bold
        title = Text("{title_clean}", font_size=58, weight=BOLD, color=WHITE)
        title.set_max_width(12)
        title.shift(UP * 0.5)
        self.add(title)

        # Emoji / icon big in corner
        emoji = Text("{emoji}", font_size=80)
        emoji.shift(RIGHT * 5.5 + DOWN * 1.2)
        emoji.set_opacity(0.7)
        self.add(emoji)

        # Subtle top tag
        tag = Text("EXPLAINED", font_size=22, color="{accent}", weight=BOLD)
        tag.shift(UP * 2.2)
        self.add(tag)
'''

# (background, accent, emoji)
STYLES = {
    "git": ("#1a1a2e", "#e44c30", "🤯"),
    "dns": ("#0a1628", "#1a73e8", "🌐"),
    "docker": ("#0a1929", "#0db7ed", "🐳"),
    "https": ("#0a1f0a", "#4caf50", "🔒"),
    "bigo": ("#1a1000", "#ff6f00", "📈"),
    "jwt": ("#1a0a2e", "#ce93d8", "🔑"),
    "css": ("#1a0a1e", "#e91e63", "🎨"),
    "git_branching": ("#1a1200", "#f57c00", "🌳"),
    "rest_graphql": ("#1a0a2e", "#b39ddb", "⚡"),
    "load_balancer": ("#0a1a1e", "#00bcd4", "⚖️"),
    "tcp_udp": ("#0a1528", "#29b6f6", "🔄"),
    "http_methods": ("#0a1230", "#42a5f5", "📡"),
    "sql_joins": ("#1a0a30", "#b39ddb", "🔗"),
    "stack_queue": ("#0a0a28", "#5c6bc0", "📚"),
    "linked_list": ("#0a1a18", "#26a69a", "🔗"),
    "binary_search": ("#1a1000", "#ff9800", "🔍"),
    "hash_table": ("#1a1210", "#8d6e63", "🗂️"),
    "recursion": ("#1a0a18", "#ec407a", "🔄"),
    "oauth": ("#0a1a0a", "#66bb6a", "🔐"),
    "cors": ("#1a0a0a", "#ef5350", "🚫"),
    "websockets": ("#0a1618", "#00bcd4", "⚡"),
    "caching": ("#1a1800", "#fdd835", "💨"),
    "cdn": ("#0a1030", "#1e88e5", "🌍"),
    "cicd": ("#0a1a0a", "#66bb6a", "🚀"),
    "kubernetes": ("#0a1230", "#326ce5", "☸️"),
    "microservices": ("#1a1210", "#a1887f", "🏗️"),
    "sql_nosql": ("#10082e", "#7c4dff", "🗄️"),
    "acid": ("#1a0a00", "#ff7043", "🧪"),
    "cap_theorem": ("#080a28", "#5c6bc0", "🔺"),
    "race_condition": ("#1a0808", "#ef5350", "🏎️"),
    "deadlock": ("#140a20", "#ab47bc", "💀"),
    "mutex": ("#1a1000", "#ff9800", "🔒"),
    "pub_sub": ("#0a1618", "#00bcd4", "📨"),
    "message_queue": ("#0a1a08", "#7cb342", "📬"),
    "event_loop": ("#1a1600", "#fdd835", "♻️"),
    "callback_hell": ("#1a0808", "#ef5350", "😱"),
    "promises": ("#0a1230", "#42a5f5", "✅"),
    "async_await": ("#0a1a18", "#26a69a", "⚡"),
    "closure": ("#140a20", "#ab47bc", "🧠"),
    "hoisting": ("#1a1000", "#ff9800", "🏗️"),
    "prototype": ("#0a0a28", "#5c6bc0", "🔗"),
    "virtual_dom": ("#0a1618", "#00acc1", "⚛️"),
    "ssr_csr": ("#1a0a2e", "#ab47bc", "🖥️"),
    "cookies_sessions": ("#1a1210", "#a1887f", "🍪"),
    "xss": ("#1a0808", "#e53935", "💉"),
    "sql_injection": ("#1a0808", "#e53935", "💀"),
    "csrf": ("#1a0a18", "#ec407a", "🎭"),
    "rate_limiting": ("#0a1a0a", "#66bb6a", "🛡️"),
    "pagination": ("#0a1528", "#29b6f6", "📄"),
    "indexing": ("#1a1000", "#ff9800", "🚀"),
    "sharding": ("#1a0a30", "#7c4dff", "🔀"),
    "replication": ("#0a1a18", "#26a69a", "📋"),
    "proxy_reverse": ("#101418", "#78909c", "🔄"),
    "osi_model": ("#080a28", "#5c6bc0", "📶"),
    "tcp_handshake": ("#0a1030", "#1e88e5", "🤝"),
    "ip_address": ("#0a1618", "#00acc1", "🌐"),
    "subnetting": ("#0a1410", "#009688", "🧮"),
    "encryption": ("#0a1a0a", "#66bb6a", "🔐"),
    "hashing": ("#1a1210", "#8d6e63", "🔢"),
    "design_patterns": ("#101418", "#78909c", "🏛️"),
}


def generate(topic):
    entry = CONFIG["topics"][topic]
    title = entry["title"]
    # Strip emoji from title for clean text, keep emoji separate
    title_clean = title.encode("ascii", "ignore").decode().strip().rstrip("—-").strip()
    bg, accent, emoji = STYLES.get(topic, ("#1a1a2e", "#ffffff", "💡"))

    THUMB_SCENE.write_text(SCENE_TEMPLATE.format(
        title_clean=title_clean, bg=bg, accent=accent, emoji=emoji,
    ))

    THUMB_DIR.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [sys.executable, "-m", "manim", "render", "-s", "-qh",
         "--media_dir", str(THUMB_DIR),
         str(THUMB_SCENE), "Thumbnail"],
        check=True,
    )

    # Find rendered image and move to named thumbnail
    for img in THUMB_DIR.rglob("Thumbnail*.png"):
        img.rename(THUMB_DIR / f"{topic}.png")
        break

    # Cleanup temp files
    THUMB_SCENE.unlink(missing_ok=True)
    import shutil
    for d in ["images", "videos", "Tex"]:
        p = THUMB_DIR / d
        if p.exists():
            shutil.rmtree(p)
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
