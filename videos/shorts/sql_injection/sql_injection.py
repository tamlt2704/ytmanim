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
        self.play(FadeOut(input_box, input_label, evil_input, arrow, query_box, query, result))

        # More attack examples
        ex_title = Text("Common SQL Injection Attacks", font_size=28, color=YELLOW).shift(UP * 2.5)
        self.play(Write(ex_title))

        attacks = [
            ("' OR 1=1 --", "Bypass authentication", RED),
            ("'; DROP TABLE users; --", "Delete entire table", RED),
            ("' UNION SELECT * FROM passwords --", "Steal data", RED),
            ("' AND 1=0 UNION SELECT credit_card FROM payments --", "Extract sensitive data", RED),
        ]
        for i, (payload, desc, color) in enumerate(attacks):
            p = Text(payload, font_size=13, color=color, font="Monospace").shift(LEFT * 1 + UP * (1 - i * 0.8))
            d = Text(f"→ {desc}", font_size=12, color=GREY).next_to(p, DOWN, buff=0.05, aligned_edge=LEFT)
            self.play(FadeIn(p, d), run_time=0.4)
        self.wait(1.5)
        self.play(FadeOut(*self.mobjects))

        # Fix
        fix_title = Text("Prevention", font_size=28, color=GREEN).shift(UP * 2.5)
        self.play(Write(fix_title))

        fix1 = Text("✅ Parameterized Queries (Best!)", font_size=18, color=GREEN).shift(UP * 1.5)
        self.play(Write(fix1))
        safe = Text("db.query('SELECT * FROM users WHERE name=?', [input])", font_size=14, color=GREEN, font="Monospace").shift(UP * 0.8)
        self.play(Write(safe), run_time=0.4)

        fixes = [
            ("✅ ORM (Sequelize, SQLAlchemy)", "Auto-parameterizes"),
            ("✅ Input validation", "Whitelist allowed characters"),
            ("✅ Least privilege", "DB user with minimal permissions"),
            ("✅ WAF", "Web Application Firewall"),
        ]
        for i, (fix, desc) in enumerate(fixes):
            f = Text(fix, font_size=16, color=GREEN).shift(LEFT * 1.5 + UP * (-0.2 - i * 0.6))
            d = Text(desc, font_size=12, color=GREY).shift(RIGHT * 3 + UP * (-0.2 - i * 0.6))
            self.play(FadeIn(f, d), run_time=0.35)

        self.wait(2)
        self.play(FadeOut(*self.mobjects))
