import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONFIG = json.loads((ROOT / "config.json").read_text())


def export(topic):
    entry = CONFIG["topics"][topic]
    print("=" * 60)
    print(f"TOPIC: {topic}")
    print("=" * 60)
    print(f"\n📌 TITLE:\n{entry['title']}\n")
    print(f"📝 DESCRIPTION:\n{entry['description']}\n")
    print(f"🏷️  TAGS:\n{', '.join(entry['tags'])}\n")


def main():
    topics = sys.argv[1:] if len(sys.argv) > 1 else CONFIG["render"]
    for topic in topics:
        if topic not in CONFIG["topics"]:
            print(f"Unknown topic: {topic}")
            sys.exit(1)
        export(topic)


if __name__ == "__main__":
    main()
