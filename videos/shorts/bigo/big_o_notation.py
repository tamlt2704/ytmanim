from manim import *
import numpy as np

class BigONotation(Scene):
    def construct(self):

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

        self.wait(1.5)
        all_objs = VGroup(axes, x_label, y_label, *graphs)
        self.play(FadeOut(all_objs))

        # Real-world examples
        ex_title = Text("Real-World Examples", font_size=36, color=YELLOW)
        self.play(Write(ex_title))
        self.wait(0.5)
        self.play(ex_title.animate.shift(UP * 2.5).scale(0.7))

        examples = [
            ("O(1)", "Hash table lookup", GREEN),
            ("O(log n)", "Binary search", BLUE),
            ("O(n)", "Linear search", YELLOW),
            ("O(n log n)", "Merge sort", ORANGE),
            ("O(n²)", "Bubble sort", RED),
        ]
        ex_group = VGroup()
        for i, (complexity, example, color) in enumerate(examples):
            c = Text(complexity, font_size=20, color=color, weight=BOLD).shift(LEFT * 3 + UP * (1.2 - i * 0.7))
            e = Text(example, font_size=18).shift(RIGHT * 1 + UP * (1.2 - i * 0.7))
            ex_group.add(VGroup(c, e))
            self.play(FadeIn(ex_group[-1]), run_time=0.4)

        self.wait(2)
        self.play(FadeOut(ex_title, ex_group))

        # Comparison with n=1000
        comp_title = Text("When n = 1,000", font_size=32, color=TEAL).shift(UP * 2.5)
        self.play(Write(comp_title))

        comparisons = [
            ("O(1)", "1 op", GREEN),
            ("O(log n)", "10 ops", BLUE),
            ("O(n)", "1,000 ops", YELLOW),
            ("O(n²)", "1,000,000 ops", RED),
        ]
        bars = VGroup()
        for i, (label, ops, color) in enumerate(comparisons):
            widths = [0.3, 0.6, 2.5, 6]
            bar = Rectangle(width=widths[i], height=0.5, color=color, fill_opacity=0.4)
            bar.shift(LEFT * 2 + RIGHT * widths[i] / 2 + UP * (1 - i * 0.8))
            l = Text(label, font_size=16, color=color).next_to(bar, LEFT, buff=0.2)
            o = Text(ops, font_size=14).next_to(bar, RIGHT, buff=0.2)
            bars.add(VGroup(bar, l, o))
            self.play(FadeIn(bars[-1]), run_time=0.5)

        tip = Text("Always aim for the lowest complexity!", font_size=20, color=GREEN).shift(DOWN * 2.5)
        self.play(Write(tip))
        self.wait(2)
        self.play(FadeOut(comp_title, bars, tip))
