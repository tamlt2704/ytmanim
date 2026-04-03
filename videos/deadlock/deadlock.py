from pathlib import Path
from manim import *

MUSIC = str(Path(__file__).resolve().parent.parent.parent / "music.mp3")


class Deadlock(Scene):
    def construct(self):
        self.add_sound(MUSIC)
        title = Text("Deadlock Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        t1 = RoundedRectangle(corner_radius=0.15, width=2, height=0.8, color=BLUE).shift(LEFT * 3 + UP * 1)
        t1_label = Text("Thread A", font_size=16).move_to(t1)
        t2 = RoundedRectangle(corner_radius=0.15, width=2, height=0.8, color=GREEN).shift(RIGHT * 3 + UP * 1)
        t2_label = Text("Thread B", font_size=16).move_to(t2)
        r1 = RoundedRectangle(corner_radius=0.15, width=2, height=0.8, color=ORANGE).shift(LEFT * 3 + DOWN * 1.5)
        r1_label = Text("Lock 1", font_size=16).move_to(r1)
        r2 = RoundedRectangle(corner_radius=0.15, width=2, height=0.8, color=RED).shift(RIGHT * 3 + DOWN * 1.5)
        r2_label = Text("Lock 2", font_size=16).move_to(r2)

        self.play(FadeIn(t1, t1_label, t2, t2_label, r1, r1_label, r2, r2_label))

        # A holds Lock 1
        a1 = Arrow(t1.get_bottom(), r1.get_top(), buff=0.1, color=BLUE, stroke_width=3)
        a1_label = Text("holds", font_size=12, color=BLUE).next_to(a1, LEFT, buff=0.1)
        self.play(GrowArrow(a1), FadeIn(a1_label), run_time=0.5)

        # B holds Lock 2
        a2 = Arrow(t2.get_bottom(), r2.get_top(), buff=0.1, color=GREEN, stroke_width=3)
        a2_label = Text("holds", font_size=12, color=GREEN).next_to(a2, RIGHT, buff=0.1)
        self.play(GrowArrow(a2), FadeIn(a2_label), run_time=0.5)

        # A wants Lock 2
        a3 = Arrow(t1.get_right(), r2.get_top() + LEFT * 0.5, buff=0.1, color=RED, stroke_width=3)
        a3_label = Text("wants", font_size=12, color=RED).next_to(a3, UP, buff=0.05)
        self.play(GrowArrow(a3), FadeIn(a3_label), run_time=0.5)

        # B wants Lock 1
        a4 = Arrow(t2.get_left(), r1.get_top() + RIGHT * 0.5, buff=0.1, color=RED, stroke_width=3)
        a4_label = Text("wants", font_size=12, color=RED).next_to(a4, UP, buff=0.05)
        self.play(GrowArrow(a4), FadeIn(a4_label), run_time=0.5)

        dead = Text("💀 DEADLOCK!", font_size=36, color=RED).shift(DOWN * 3)
        self.play(Write(dead))
        self.wait(2)
