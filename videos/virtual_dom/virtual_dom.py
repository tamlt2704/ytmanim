from pathlib import Path
from manim import *

MUSIC = str(Path(__file__).resolve().parent.parent.parent / "music.mp3")


class VirtualDOM(Scene):
    def construct(self):
        self.add_sound(MUSIC)
        title = Text("Virtual DOM Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        real_label = Text("Real DOM", font_size=22, color=RED).shift(LEFT * 3 + UP * 2.5)
        vdom_label = Text("Virtual DOM", font_size=22, color=GREEN).shift(RIGHT * 3 + UP * 2.5)
        self.play(Write(real_label), Write(vdom_label))

        def make_tree(offset, color):
            root = Dot(offset + UP * 1.5, color=color, radius=0.15)
            c1 = Dot(offset + LEFT * 1 + UP * 0.5, color=color, radius=0.15)
            c2 = Dot(offset + RIGHT * 1 + UP * 0.5, color=color, radius=0.15)
            c3 = Dot(offset + LEFT * 1.5 + DOWN * 0.5, color=color, radius=0.15)
            c4 = Dot(offset + LEFT * 0.5 + DOWN * 0.5, color=color, radius=0.15)
            lines = VGroup(
                Line(root.get_center(), c1.get_center(), color=color),
                Line(root.get_center(), c2.get_center(), color=color),
                Line(c1.get_center(), c3.get_center(), color=color),
                Line(c1.get_center(), c4.get_center(), color=color),
            )
            return VGroup(root, c1, c2, c3, c4, lines)

        real = make_tree(LEFT * 3, RED)
        vdom = make_tree(RIGHT * 3, GREEN)
        self.play(FadeIn(real), FadeIn(vdom), run_time=0.6)

        # Highlight diff
        diff_dot = Dot(RIGHT * 2 + UP * 0.5, color=YELLOW, radius=0.2)
        diff_label = Text("Changed!", font_size=14, color=YELLOW).next_to(diff_dot, DOWN, buff=0.1)
        self.play(FadeIn(diff_dot, diff_label), run_time=0.4)

        arrow = Arrow(RIGHT * 1.5 + DOWN * 0.5, LEFT * 2 + DOWN * 0.5, color=YELLOW, stroke_width=3)
        patch = Text("Patch only diff", font_size=16, color=YELLOW).next_to(arrow, DOWN, buff=0.1)
        self.play(GrowArrow(arrow), Write(patch), run_time=0.5)

        fast = Text("Minimal DOM updates = Fast!", font_size=22, color=GREEN).shift(DOWN * 2.5)
        self.play(Write(fast))
        self.wait(2)
