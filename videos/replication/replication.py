from pathlib import Path
from manim import *

MUSIC = str(Path(__file__).resolve().parent.parent.parent / "music.mp3")


class Replication(Scene):
    def construct(self):
        self.add_sound(MUSIC)
        title = Text("Database Replication Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        primary = RoundedRectangle(corner_radius=0.2, width=2.5, height=1.2, color=BLUE).shift(LEFT * 3 + UP * 1)
        primary_label = Text("Primary\n(Write)", font_size=14, color=BLUE).move_to(primary)
        self.play(FadeIn(primary, primary_label))

        replicas = VGroup()
        for i in range(3):
            r = RoundedRectangle(corner_radius=0.15, width=2, height=0.9, color=GREEN, fill_opacity=0.2)
            r.shift(RIGHT * 3 + UP * (1.5 - i * 1.2))
            label = Text(f"Replica {i+1}\n(Read)", font_size=12, color=GREEN).move_to(r)
            replicas.add(VGroup(r, label))
            arrow = Arrow(primary.get_right(), r.get_left(), buff=0.1, color=YELLOW, stroke_width=2)
            sync = Text("sync", font_size=10, color=YELLOW).next_to(arrow, UP, buff=0.02)
            self.play(FadeIn(r, label), GrowArrow(arrow), FadeIn(sync), run_time=0.4)

        write = Text("Writes → Primary", font_size=18, color=BLUE).shift(DOWN * 2)
        read = Text("Reads → Replicas (distributed)", font_size=18, color=GREEN).shift(DOWN * 2.6)
        self.play(Write(write), run_time=0.4)
        self.play(Write(read), run_time=0.4)
        self.wait(2)
