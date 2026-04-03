from manim import *

class SQLJoins(Scene):
    def construct(self):
        title = Text("SQL Joins Visualized", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        joins = [
            ("INNER JOIN", BLUE, 0.3, 0.3),
            ("LEFT JOIN", GREEN, 0.3, 0.0),
            ("RIGHT JOIN", ORANGE, 0.0, 0.3),
            ("FULL JOIN", RED, 0.3, 0.3),
        ]

        for i, (name, color, left_op, right_op) in enumerate(joins):
            left = Circle(radius=1, color=BLUE, fill_opacity=0.2).shift(LEFT * 0.5)
            right = Circle(radius=1, color=GREEN, fill_opacity=0.2).shift(RIGHT * 0.5)
            inter = Intersection(left, right, color=color, fill_opacity=0.5)

            group = VGroup(left, right, inter)
            if name == "LEFT JOIN":
                left.set_fill(color, opacity=left_op)
            elif name == "RIGHT JOIN":
                right.set_fill(color, opacity=right_op)
            elif name == "FULL JOIN":
                left.set_fill(color, opacity=0.3)
                right.set_fill(color, opacity=0.3)

            label = Text(name, font_size=28, color=color).shift(DOWN * 1.8)
            a_label = Text("A", font_size=20).move_to(left).shift(LEFT * 0.5)
            b_label = Text("B", font_size=20).move_to(right).shift(RIGHT * 0.5)

            self.play(FadeIn(group, a_label, b_label), Write(label), run_time=0.8)
            self.wait(1)
            self.play(FadeOut(group, a_label, b_label, label), run_time=0.4)

        self.wait(1)
