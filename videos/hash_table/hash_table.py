from pathlib import Path
from manim import *

MUSIC = str(Path(__file__).resolve().parent.parent.parent / "music.mp3")


class HashTable(Scene):
    def construct(self):
        self.add_sound(MUSIC)
        title = Text("Hash Tables Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        # Buckets
        buckets = VGroup()
        for i in range(6):
            box = Rectangle(width=2, height=0.6, color=BLUE, fill_opacity=0.1)
            box.shift(RIGHT * 2 + UP * (2 - i * 0.8))
            idx = Text(str(i), font_size=14, color=GREY).next_to(box, LEFT, buff=0.2)
            buckets.add(VGroup(box, idx))
        self.play(FadeIn(buckets), run_time=0.5)

        entries = [("name", 2, GREEN), ("age", 0, YELLOW), ("city", 4, ORANGE), ("job", 2, RED)]

        for key, bucket_idx, color in entries:
            key_text = Text(f'"{key}"', font_size=18, color=color).shift(LEFT * 3)
            arrow = Arrow(LEFT * 2, LEFT * 0.5, color=color, stroke_width=2)
            hash_label = Text(f"hash → {bucket_idx}", font_size=14, color=color).next_to(arrow, UP, buff=0.1)
            self.play(FadeIn(key_text), GrowArrow(arrow), FadeIn(hash_label), run_time=0.5)

            val = Text(key, font_size=14, color=color).move_to(buckets[bucket_idx][0]).shift(RIGHT * 0.3)
            self.play(FadeIn(val), run_time=0.3)
            self.play(FadeOut(key_text, arrow, hash_label), run_time=0.3)

        collision = Text("Collision at index 2!", font_size=20, color=RED).shift(DOWN * 2.5)
        self.play(Write(collision))
        self.wait(2)
