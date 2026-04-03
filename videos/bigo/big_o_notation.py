from pathlib import Path
from manim import *
import numpy as np

MUSIC = str(Path(__file__).resolve().parent.parent.parent / "music.mp3")


class BigONotation(Scene):
    def construct(self):
        self.add_sound(MUSIC)

        title = Text("Big O Notation Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        axes = Axes(
            x_range=[0, 10, 2], y_range=[0, 100, 20],
            x_length=6, y_length=4,
            axis_config={"include_numbers": True, "font_size": 20},
        ).shift(DOWN * 0.5)
        x_label = axes.get_x_axis_label("n", font_size=24)
        y_label = axes.get_y_axis_label("ops", font_size=24)
        self.play(Create(axes), Write(x_label), Write(y_label))

        curves = [
            (lambda x: 1, "O(1)", GREEN),
            (lambda x: np.log2(x + 1) * 5, "O(log n)", BLUE),
            (lambda x: x * 5, "O(n)", YELLOW),
            (lambda x: x * np.log2(x + 1) * 2, "O(n log n)", ORANGE),
            (lambda x: x ** 2, "O(n²)", RED),
        ]

        graphs = []
        for func, label_text, color in curves:
            graph = axes.plot(func, x_range=[0.1, 10], color=color)
            label = Text(label_text, font_size=16, color=color).next_to(
                axes.c2p(10, min(func(10), 100)), RIGHT, buff=0.1
            )
            self.play(Create(graph), FadeIn(label), run_time=0.8)
            graphs.append(VGroup(graph, label))

        self.wait(2)
        all_objs = VGroup(axes, x_label, y_label, *graphs)
        self.play(FadeOut(all_objs))
