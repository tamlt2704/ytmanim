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

        stolen = Text("💰 Money transferred without consent!", font_size=18, color=RED).shift(DOWN * 2)
        self.play(Write(stolen))
        self.wait(1.5)
        self.play(FadeOut(victim, vic_label, evil, evil_label, bank, bank_label,
                          a1, l1, a2, l2, a3, l3, stolen))

        # How it works step by step
        how_title = Text("How CSRF Works", font_size=28, color=YELLOW).shift(UP * 2.5)
        self.play(Write(how_title))

        steps = [
            "1. Victim logs into bank.com",
            "2. Browser stores session cookie",
            "3. Victim visits evil.com",
            "4. Evil page has hidden form:",
            '   <form action="bank.com/transfer">',
            "5. Form auto-submits with victim's cookie",
            "6. Bank processes the request!",
        ]
        step_group = VGroup()
        for i, step in enumerate(steps):
            color = RED if i >= 3 else WHITE
            txt = Text(step, font_size=14, color=color).shift(UP * (1.5 - i * 0.5) + LEFT * 0.5)
            step_group.add(txt)
            self.play(FadeIn(txt), run_time=0.3)
        self.wait(1.5)
        self.play(FadeOut(how_title, step_group))

        # Prevention
        fix_title = Text("Prevention Methods", font_size=28, color=GREEN).shift(UP * 2.5)
        self.play(Write(fix_title))

        fixes = [
            ("CSRF Tokens", "Unique token per form submission", GREEN),
            ("SameSite Cookies", "Cookie not sent cross-origin", BLUE),
            ("Double Submit", "Token in cookie + header", ORANGE),
            ("Check Referer", "Verify request origin", YELLOW),
        ]
        for i, (method, desc, color) in enumerate(fixes):
            m = Text(f"✅ {method}", font_size=18, color=color).shift(LEFT * 2 + UP * (1 - i * 0.8))
            d = Text(desc, font_size=14, color=GREY).shift(RIGHT * 2.5 + UP * (1 - i * 0.8))
            self.play(FadeIn(m, d), run_time=0.4)

        self.wait(2)
        self.play(FadeOut(*self.mobjects))
