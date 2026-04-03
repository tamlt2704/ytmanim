from pathlib import Path
from manim import *

MUSIC = str(Path(__file__).resolve().parent.parent.parent / "music.mp3")


class Sharding(Scene):
    def construct(self):
        self.add_sound(MUSIC)
        title = Text("Database Sharding Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        # Single DB
        single = RoundedRectangle(corner_radius=0.2, width=3, height=2, color=RED, fill_opacity=0.2).shift(UP * 1.5)
        single_label = Text("Single DB\n(all data)", font_size=16, color=RED).move_to(single)
        self.play(FadeIn(single, single_label))
        self.wait(0.5)

        arrow = Arrow(UP * 0.2, DOWN * 0.5, color=YELLOW, stroke_width=3)
        shard_text = Text("Shard by user_id", font_size=18, color=YELLOW).next_to(arrow, RIGHT, buff=0.2)
        self.play(GrowArrow(arrow), Write(shard_text), run_time=0.5)

        # Shards
        shards = VGroup()
        shard_data = [("Shard 1", "Users A-H", BLUE), ("Shard 2", "Users I-P", GREEN), ("Shard 3", "Users Q-Z", ORANGE)]
        for i, (name, data, color) in enumerate(shard_data):
            box = RoundedRectangle(corner_radius=0.15, width=2.5, height=1.2, color=color, fill_opacity=0.2)
            box.shift(LEFT * 3.5 + RIGHT * i * 3.5 + DOWN * 2)
            n = Text(name, font_size=14, color=color, weight=BOLD).move_to(box).shift(UP * 0.2)
            d = Text(data, font_size=12).move_to(box).shift(DOWN * 0.2)
            shards.add(VGroup(box, n, d))

        self.play(FadeOut(single, single_label), FadeIn(shards), run_time=0.6)

        result = Text("Horizontal scaling ✓", font_size=22, color=GREEN).shift(DOWN * 3.3)
        self.play(Write(result))
        self.wait(2)
