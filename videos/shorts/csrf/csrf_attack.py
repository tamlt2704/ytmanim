from manim import *

class CSRFAttack(Scene):
    def construct(self):
        title = Text("CSRF Attack Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        victim = RoundedRectangle(corner_radius=0.15, width=2, height=0.8, color=BLUE).shift(LEFT * 4)
        vic_label = Text("Victim", font_size=16).move_to(victim)
        evil = RoundedRectangle(corner_radius=0.15, width=2, height=0.8, color=RED).shift(ORIGIN + UP * 1.5)
        evil_label = Text("Evil Site", font_size=16, color=RED).move_to(evil)
        bank = RoundedRectangle(corner_radius=0.15, width=2, height=0.8, color=GREEN).shift(RIGHT * 4)
        bank_label = Text("Bank", font_size=16).move_to(bank)
        self.play(FadeIn(victim, vic_label, evil, evil_label, bank, bank_label))

        # Victim logged into bank
        a1 = Arrow(victim.get_right(), bank.get_left(), buff=0.1, color=GREEN, stroke_width=2).shift(DOWN * 0.3)
        l1 = Text("Logged in (cookie)", font_size=12, color=GREEN).next_to(a1, DOWN, buff=0.05)
        self.play(GrowArrow(a1), FadeIn(l1), run_time=0.5)

        # Visits evil site
        a2 = Arrow(victim.get_top(), evil.get_left(), buff=0.1, color=RED, stroke_width=2)
        l2 = Text("Visits", font_size=12, color=RED).next_to(a2, LEFT, buff=0.05)
        self.play(GrowArrow(a2), FadeIn(l2), run_time=0.5)

        # Evil site sends request
        a3 = Arrow(evil.get_right(), bank.get_top(), buff=0.1, color=RED, stroke_width=3)
        l3 = Text("POST /transfer (with victim's cookie!)", font_size=12, color=RED).next_to(a3, UP, buff=0.05)
        self.play(GrowArrow(a3), FadeIn(l3), run_time=0.5)

        fix = Text("Fix: CSRF tokens, SameSite cookies", font_size=18, color=GREEN).shift(DOWN * 2.5)
        self.play(Write(fix))
        self.wait(2)
