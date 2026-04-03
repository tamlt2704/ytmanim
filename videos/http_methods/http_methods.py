from pathlib import Path
from manim import *

MUSIC = str(Path(__file__).resolve().parent.parent.parent / "music.mp3")


class HTTPMethods(Scene):
    def construct(self):
        self.add_sound(MUSIC)
        title = Text("HTTP Methods Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        methods = [
            ("GET", "Read data", GREEN),
            ("POST", "Create data", BLUE),
            ("PUT", "Replace data", YELLOW),
            ("PATCH", "Update partial", ORANGE),
            ("DELETE", "Remove data", RED),
        ]

        boxes = VGroup()
        for i, (method, desc, color) in enumerate(methods):
            box = RoundedRectangle(corner_radius=0.15, width=5, height=0.7, color=color, fill_opacity=0.2)
            box.shift(UP * (2 - i * 0.9))
            m = Text(method, font_size=22, color=color, weight=BOLD).move_to(box).shift(LEFT * 1.2)
            d = Text(desc, font_size=16).move_to(box).shift(RIGHT * 1)
            group = VGroup(box, m, d)
            boxes.add(group)
            self.play(FadeIn(group), run_time=0.5)

        self.wait(2)
