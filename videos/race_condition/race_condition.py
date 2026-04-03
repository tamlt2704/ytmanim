from pathlib import Path
from manim import *

MUSIC = str(Path(__file__).resolve().parent.parent.parent / "music.mp3")


class RaceCondition(Scene):
    def construct(self):
        self.add_sound(MUSIC)
        title = Text("Race Condition Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        var = RoundedRectangle(corner_radius=0.15, width=2, height=1, color=YELLOW).shift(UP * 0)
        var_label = Text("count = 0", font_size=18, color=YELLOW).move_to(var)
        t1 = RoundedRectangle(corner_radius=0.15, width=2, height=0.8, color=BLUE).shift(LEFT * 3 + UP * 2)
        t1_label = Text("Thread 1", font_size=16).move_to(t1)
        t2 = RoundedRectangle(corner_radius=0.15, width=2, height=0.8, color=GREEN).shift(RIGHT * 3 + UP * 2)
        t2_label = Text("Thread 2", font_size=16).move_to(t2)
        self.play(FadeIn(var, var_label, t1, t1_label, t2, t2_label))

        steps = [
            ("Read: 0", t1, BLUE, LEFT * 3),
            ("Read: 0", t2, GREEN, RIGHT * 3),
            ("Write: 1", t1, BLUE, LEFT * 3),
            ("Write: 1", t2, GREEN, RIGHT * 3),
        ]

        for text, thread, color, pos in steps:
            arrow = Arrow(thread.get_bottom(), var.get_top(), buff=0.1, color=color, stroke_width=2)
            label = Text(text, font_size=14, color=color).shift(pos + DOWN * 0.5)
            self.play(GrowArrow(arrow), FadeIn(label), run_time=0.5)
            self.wait(0.3)
            self.play(FadeOut(arrow), run_time=0.2)

        wrong = Text("count = 1 (expected 2!)", font_size=24, color=RED).shift(DOWN * 2)
        self.play(Write(wrong))
        self.wait(2)
