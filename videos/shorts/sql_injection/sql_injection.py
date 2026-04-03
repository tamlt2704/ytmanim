from manim import *

class SQLInjection(Scene):
    def construct(self):
        title = Text("SQL Injection Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        input_box = RoundedRectangle(corner_radius=0.15, width=5, height=0.8, color=BLUE, fill_opacity=0.1).shift(UP * 2)
        input_label = Text("Username:", font_size=16).next_to(input_box, LEFT, buff=0.2)
        evil_input = Text("' OR 1=1 --", font_size=18, color=RED).move_to(input_box)
        self.play(FadeIn(input_box, input_label), run_time=0.3)
        self.play(Write(evil_input), run_time=0.5)

        arrow = Arrow(UP * 1.2, UP * 0.2, color=RED, stroke_width=3)
        self.play(GrowArrow(arrow), run_time=0.3)

        query_box = RoundedRectangle(corner_radius=0.15, width=8, height=0.8, color=RED, fill_opacity=0.1).shift(DOWN * 0.3)
        query = Text("SELECT * FROM users WHERE name='' OR 1=1 --'", font_size=14, color=RED).move_to(query_box)
        self.play(FadeIn(query_box), Write(query), run_time=0.6)

        result = Text("Returns ALL users! 💀", font_size=24, color=RED).shift(DOWN * 1.5)
        self.play(Write(result))
        self.wait(1)

        fix = Text("Fix: Use parameterized queries!", font_size=20, color=GREEN).shift(DOWN * 2.5)
        safe = Text("db.query('SELECT * FROM users WHERE name=?', [input])", font_size=14, color=GREEN).shift(DOWN * 3.2)
        self.play(Write(fix), run_time=0.4)
        self.play(Write(safe), run_time=0.4)
        self.wait(2)
