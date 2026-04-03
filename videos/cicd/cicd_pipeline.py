from pathlib import Path
from manim import *

MUSIC = str(Path(__file__).resolve().parent.parent.parent / "music.mp3")


class CICDPipeline(Scene):
    def construct(self):
        self.add_sound(MUSIC)
        title = Text("CI/CD Pipeline Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        stages = [
            ("Code", BLUE),
            ("Build", GREEN),
            ("Test", YELLOW),
            ("Deploy", ORANGE),
            ("Monitor", PURPLE),
        ]

        boxes = VGroup()
        arrows = VGroup()
        for i, (name, color) in enumerate(stages):
            box = RoundedRectangle(corner_radius=0.15, width=1.8, height=0.9, color=color, fill_opacity=0.3)
            box.shift(LEFT * 4 + RIGHT * i * 2.2)
            txt = Text(name, font_size=16, color=color).move_to(box)
            group = VGroup(box, txt)
            boxes.add(group)
            self.play(FadeIn(group), run_time=0.4)
            if i > 0:
                arrow = Arrow(boxes[i - 1][0].get_right(), box.get_left(), buff=0.1, color=WHITE, stroke_width=2)
                arrows.add(arrow)
                self.play(GrowArrow(arrow), run_time=0.3)

        ci_brace = Brace(VGroup(boxes[0], boxes[1], boxes[2]), DOWN, color=BLUE)
        ci_label = Text("Continuous Integration", font_size=16, color=BLUE).next_to(ci_brace, DOWN, buff=0.1)
        cd_brace = Brace(VGroup(boxes[3], boxes[4]), DOWN, color=ORANGE)
        cd_label = Text("Continuous Delivery", font_size=16, color=ORANGE).next_to(cd_brace, DOWN, buff=0.1)

        self.play(Create(ci_brace), Write(ci_label), Create(cd_brace), Write(cd_label), run_time=0.6)
        self.wait(2)
