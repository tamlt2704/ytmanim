from pathlib import Path
from manim import *

MUSIC = str(Path(__file__).resolve().parent.parent.parent / "music.mp3")


class ACIDProperties(Scene):
    def construct(self):
        self.add_sound(MUSIC)
        title = Text("ACID Properties Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        props = [
            ("A", "Atomicity", "All or nothing", RED),
            ("C", "Consistency", "Valid state always", BLUE),
            ("I", "Isolation", "No interference", GREEN),
            ("D", "Durability", "Persisted forever", ORANGE),
        ]

        for i, (letter, name, desc, color) in enumerate(props):
            big = Text(letter, font_size=72, color=color, weight=BOLD).shift(LEFT * 2)
            full = Text(name, font_size=32, color=color).next_to(big, RIGHT, buff=0.3)
            description = Text(desc, font_size=22).shift(DOWN * 1)
            self.play(FadeIn(big), Write(full), run_time=0.5)
            self.play(Write(description), run_time=0.4)
            self.wait(0.8)
            self.play(FadeOut(big, full, description), run_time=0.3)

        all_text = Text("ACID", font_size=64, color=YELLOW, weight=BOLD)
        self.play(Write(all_text))
        self.wait(2)
