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

        for name, color, left_op, right_op in joins:
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

        # SQL syntax for each
        syntax_title = Text("SQL Syntax", font_size=28, color=YELLOW).shift(UP * 2.5)
        self.play(Write(syntax_title))

        syntaxes = [
            ("INNER JOIN", "SELECT * FROM A INNER JOIN B ON A.id = B.a_id", BLUE),
            ("LEFT JOIN", "SELECT * FROM A LEFT JOIN B ON A.id = B.a_id", GREEN),
            ("RIGHT JOIN", "SELECT * FROM A RIGHT JOIN B ON A.id = B.a_id", ORANGE),
            ("FULL JOIN", "SELECT * FROM A FULL OUTER JOIN B ON A.id = B.a_id", RED),
        ]
        for i, (name, sql, color) in enumerate(syntaxes):
            n = Text(name, font_size=16, color=color, weight=BOLD).shift(LEFT * 4 + UP * (1 - i * 0.8))
            s = Text(sql, font_size=11, font="Monospace").shift(RIGHT * 1 + UP * (1 - i * 0.8))
            self.play(FadeIn(n, s), run_time=0.4)
        self.wait(1.5)
        self.play(FadeOut(*self.mobjects))

        # When to use
        when_title = Text("When to Use Each Join", font_size=28, color=TEAL).shift(UP * 2.5)
        self.play(Write(when_title))

        uses = [
            ("INNER", "Only matching rows from both tables", BLUE),
            ("LEFT", "All from left + matching from right", GREEN),
            ("RIGHT", "All from right + matching from left", ORANGE),
            ("FULL", "All rows from both tables", RED),
            ("CROSS", "Every combination (cartesian product)", PURPLE),
        ]
        for i, (join, desc, color) in enumerate(uses):
            j = Text(join, font_size=18, color=color, weight=BOLD).shift(LEFT * 3 + UP * (1 - i * 0.6))
            d = Text(desc, font_size=14).shift(RIGHT * 1.5 + UP * (1 - i * 0.6))
            self.play(FadeIn(j, d), run_time=0.35)

        tip = Text("INNER JOIN is the most common!", font_size=18, color=YELLOW).shift(DOWN * 2.5)
        self.play(Write(tip))
        self.wait(2)
        self.play(FadeOut(*self.mobjects))
