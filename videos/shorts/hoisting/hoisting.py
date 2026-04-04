from manim import *

class Hoisting(Scene):
    def construct(self):
        title = Text("JavaScript Hoisting", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        before_label = Text("What you write:", font_size=22, color=BLUE).shift(LEFT * 3 + UP * 2.5)
        self.play(Write(before_label))
        code_before = ['console.log(x)  // ???', 'var x = 5']
        before_group = VGroup()
        for i, line in enumerate(code_before):
            txt = Text(line, font_size=18).shift(LEFT * 3 + UP * (1.5 - i * 0.6))
            before_group.add(txt)
            self.play(FadeIn(txt), run_time=0.3)

        after_label = Text("What JS sees:", font_size=22, color=GREEN).shift(RIGHT * 3 + UP * 2.5)
        self.play(Write(after_label))
        code_after = ['var x           // hoisted!', 'console.log(x)  // undefined', 'x = 5']
        after_group = VGroup()
        for i, line in enumerate(code_after):
            color = YELLOW if i == 0 else WHITE
            txt = Text(line, font_size=18, color=color).shift(RIGHT * 3 + UP * (1.5 - i * 0.6))
            after_group.add(txt)
            self.play(FadeIn(txt), run_time=0.3)

        tip = Text("let/const are NOT hoisted the same way!", font_size=18, color=RED).shift(DOWN * 2)
        self.play(Write(tip))
        self.wait(1.5)
        self.play(FadeOut(before_label, before_group, after_label, after_group, tip))

        # var vs let vs const
        comp_title = Text("var vs let vs const", font_size=28, color=YELLOW).shift(UP * 2.8)
        self.play(Write(comp_title))

        headers = VGroup(
            Text("", font_size=14).shift(LEFT * 3.5),
            Text("var", font_size=16, color=RED, weight=BOLD).shift(LEFT * 0.5),
            Text("let", font_size=16, color=BLUE, weight=BOLD).shift(RIGHT * 1.5),
            Text("const", font_size=16, color=GREEN, weight=BOLD).shift(RIGHT * 3.5),
        ).shift(UP * 2)
        self.play(FadeIn(headers), run_time=0.3)

        rows = [
            ("Hoisted?", "Yes (undefined)", "Yes (TDZ)", "Yes (TDZ)"),
            ("Scope", "Function", "Block", "Block"),
            ("Reassign?", "Yes", "Yes", "No"),
            ("Redeclare?", "Yes", "No", "No"),
        ]
        for i, (label, v, l, c) in enumerate(rows):
            row = VGroup(
                Text(label, font_size=13, weight=BOLD).shift(LEFT * 3.5),
                Text(v, font_size=13, color=RED).shift(LEFT * 0.5),
                Text(l, font_size=13, color=BLUE).shift(RIGHT * 1.5),
                Text(c, font_size=13, color=GREEN).shift(RIGHT * 3.5),
            ).shift(UP * (1.2 - i * 0.6))
            self.play(FadeIn(row), run_time=0.35)

        self.wait(1.5)
        self.play(FadeOut(*self.mobjects))

        # Temporal Dead Zone
        tdz_title = Text("Temporal Dead Zone (TDZ)", font_size=28, color=PURPLE).shift(UP * 2.5)
        self.play(Write(tdz_title))

        tdz_code = VGroup(
            Text("// TDZ starts", font_size=14, color=RED, font="Monospace"),
            Text("console.log(x)  // ReferenceError!", font_size=14, color=RED, font="Monospace"),
            Text("// TDZ ends", font_size=14, color=RED, font="Monospace"),
            Text("let x = 5       // now accessible", font_size=14, color=GREEN, font="Monospace"),
            Text("console.log(x)  // 5", font_size=14, color=GREEN, font="Monospace"),
        ).arrange(DOWN, aligned_edge=LEFT).shift(LEFT * 1)
        self.play(FadeIn(tdz_code), run_time=0.6)

        tdz_zone = SurroundingRectangle(VGroup(tdz_code[0], tdz_code[1], tdz_code[2]), color=RED, buff=0.1)
        tdz_lbl = Text("Temporal Dead Zone", font_size=14, color=RED).next_to(tdz_zone, RIGHT, buff=0.2)
        self.play(Create(tdz_zone), FadeIn(tdz_lbl), run_time=0.5)

        best = Text("Best practice: always use const, then let. Avoid var.", font_size=16, color=GREEN).shift(DOWN * 2.5)
        self.play(Write(best))
        self.wait(2)
        self.play(FadeOut(*self.mobjects))
