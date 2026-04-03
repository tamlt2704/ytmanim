from pathlib import Path
from manim import *

MUSIC = str(Path(__file__).resolve().parent.parent.parent / "music.mp3")


class EventLoop(Scene):
    def construct(self):
        self.add_sound(MUSIC)
        title = Text("Event Loop Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        stack = RoundedRectangle(corner_radius=0.15, width=2.5, height=3, color=BLUE, fill_opacity=0.1).shift(LEFT * 4)
        stack_label = Text("Call Stack", font_size=16, color=BLUE).next_to(stack, UP, buff=0.1)
        queue = RoundedRectangle(corner_radius=0.15, width=2.5, height=1.5, color=GREEN, fill_opacity=0.1).shift(RIGHT * 4 + DOWN * 1)
        queue_label = Text("Callback Queue", font_size=14, color=GREEN).next_to(queue, UP, buff=0.1)
        apis = RoundedRectangle(corner_radius=0.15, width=2.5, height=1.5, color=ORANGE, fill_opacity=0.1).shift(RIGHT * 4 + UP * 1.5)
        apis_label = Text("Web APIs", font_size=14, color=ORANGE).next_to(apis, UP, buff=0.1)
        loop = Circle(radius=0.5, color=YELLOW).shift(ORIGIN)
        loop_label = Text("Event\nLoop", font_size=12, color=YELLOW).move_to(loop)

        self.play(FadeIn(stack, stack_label, queue, queue_label, apis, apis_label, loop, loop_label))

        # Animate flow
        a1 = Arrow(stack.get_right(), apis.get_left(), buff=0.1, color=ORANGE, stroke_width=2)
        l1 = Text("setTimeout", font_size=12, color=ORANGE).next_to(a1, UP, buff=0.05)
        self.play(GrowArrow(a1), FadeIn(l1), run_time=0.5)

        a2 = Arrow(apis.get_bottom(), queue.get_top(), buff=0.1, color=GREEN, stroke_width=2)
        l2 = Text("callback", font_size=12, color=GREEN).next_to(a2, RIGHT, buff=0.05)
        self.play(GrowArrow(a2), FadeIn(l2), run_time=0.5)

        # Event loop picks up
        self.play(Rotate(loop, angle=2 * PI), run_time=0.8)
        a3 = Arrow(queue.get_left(), stack.get_right(), buff=0.1, color=YELLOW, stroke_width=2).shift(DOWN * 0.5)
        l3 = Text("push to stack", font_size=12, color=YELLOW).next_to(a3, DOWN, buff=0.05)
        self.play(GrowArrow(a3), FadeIn(l3), run_time=0.5)

        self.wait(2)
