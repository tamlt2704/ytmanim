from manim import *

class XSSAttack(Scene):
    def construct(self):
        title = Text("XSS Attack Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        attacker = RoundedRectangle(corner_radius=0.15, width=2, height=0.8, color=RED).shift(LEFT * 5 + UP * 1.5)
        att_label = Text("Attacker", font_size=16, color=RED).move_to(attacker)
        website = RoundedRectangle(corner_radius=0.15, width=2.5, height=1, color=BLUE).shift(ORIGIN)
        web_label = Text("Website", font_size=16).move_to(website)
        victim = RoundedRectangle(corner_radius=0.15, width=2, height=0.8, color=GREEN).shift(RIGHT * 5 + UP * 1.5)
        vic_label = Text("Victim", font_size=16, color=GREEN).move_to(victim)
        self.play(FadeIn(attacker, att_label, website, web_label, victim, vic_label))

        # Inject script
        a1 = Arrow(attacker.get_right(), website.get_left(), buff=0.1, color=RED, stroke_width=2)
        inject = Text("<script>steal()</script>", font_size=12, color=RED).next_to(a1, UP, buff=0.05)
        self.play(GrowArrow(a1), FadeIn(inject), run_time=0.5)

        # Victim visits
        a2 = Arrow(victim.get_left(), website.get_right(), buff=0.1, color=GREEN, stroke_width=2)
        visit = Text("visits page", font_size=12, color=GREEN).next_to(a2, UP, buff=0.05)
        self.play(GrowArrow(a2), FadeIn(visit), run_time=0.5)

        # Script executes
        a3 = Arrow(website.get_right(), victim.get_bottom(), buff=0.1, color=RED, stroke_width=3)
        exec_label = Text("Script runs in victim's browser!", font_size=14, color=RED).shift(DOWN * 1.5)
        self.play(GrowArrow(a3), Write(exec_label), run_time=0.5)

        fix = Text("Fix: Sanitize inputs, use CSP", font_size=18, color=GREEN).shift(DOWN * 2.5)
        self.play(Write(fix))
        self.wait(2)
