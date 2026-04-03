from pathlib import Path
from manim import *

MUSIC = str(Path(__file__).resolve().parent.parent.parent / "music.mp3")


class PrototypeChain(Scene):
    def construct(self):
        self.add_sound(MUSIC)
        title = Text("Prototype Chain Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        objs = [
            ("myObj", '{ name: "A" }', BLUE),
            ("Person.prototype", "{ greet() }", GREEN),
            ("Object.prototype", "{ toString() }", ORANGE),
            ("null", "", RED),
        ]

        boxes = VGroup()
        arrows = VGroup()
        for i, (name, props, color) in enumerate(objs):
            box = RoundedRectangle(corner_radius=0.15, width=3.5, height=0.9, color=color, fill_opacity=0.2)
            box.shift(UP * (2 - i * 1.3))
            n = Text(name, font_size=16, color=color, weight=BOLD).move_to(box).shift(LEFT * 0.5)
            p = Text(props, font_size=12).move_to(box).shift(RIGHT * 0.7)
            group = VGroup(box, n, p)
            boxes.add(group)
            self.play(FadeIn(group), run_time=0.4)
            if i > 0:
                arrow = Arrow(boxes[i - 1][0].get_bottom(), box.get_top(), buff=0.1, color=WHITE, stroke_width=2)
                proto = Text("__proto__", font_size=10, color=GREY).next_to(arrow, RIGHT, buff=0.05)
                arrows.add(VGroup(arrow, proto))
                self.play(GrowArrow(arrow), FadeIn(proto), run_time=0.3)

        lookup = Text("Property lookup goes UP the chain", font_size=18, color=YELLOW).shift(DOWN * 2.5)
        self.play(Write(lookup))
        self.wait(2)
