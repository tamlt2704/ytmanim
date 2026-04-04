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

        a1 = Arrow(attacker.get_right(), website.get_left(), buff=0.1, color=RED, stroke_width=2)
        inject = Text("<script>steal()</script>", font_size=12, color=RED).next_to(a1, UP, buff=0.05)
        self.play(GrowArrow(a1), FadeIn(inject), run_time=0.5)

        a2 = Arrow(victim.get_left(), website.get_right(), buff=0.1, color=GREEN, stroke_width=2)
        visit = Text("visits page", font_size=12, color=GREEN).next_to(a2, UP, buff=0.05)
        self.play(GrowArrow(a2), FadeIn(visit), run_time=0.5)

        a3 = Arrow(website.get_right(), victim.get_bottom(), buff=0.1, color=RED, stroke_width=3)
        exec_label = Text("Script runs in victim's browser!", font_size=14, color=RED).shift(DOWN * 1.5)
        self.play(GrowArrow(a3), Write(exec_label), run_time=0.5)
        self.wait(1)
        self.play(FadeOut(attacker, att_label, website, web_label, victim, vic_label,
                          a1, inject, a2, visit, a3, exec_label))

        # Types of XSS
        types_title = Text("Types of XSS", font_size=28, color=YELLOW).shift(UP * 2.5)
        self.play(Write(types_title))

        xss_types = [
            ("Stored XSS", "Script saved in database", "Comment with <script> tag", RED),
            ("Reflected XSS", "Script in URL parameter", "Malicious link sent to victim", ORANGE),
            ("DOM-based XSS", "Script manipulates DOM", "Client-side JS vulnerability", YELLOW),
        ]
        for i, (name, desc, example, color) in enumerate(xss_types):
            n = Text(name, font_size=18, color=color, weight=BOLD).shift(LEFT * 1 + UP * (1 - i * 1.2))
            d = Text(desc, font_size=14).shift(LEFT * 1 + UP * (0.5 - i * 1.2))
            e = Text(f"e.g. {example}", font_size=12, color=GREY).shift(LEFT * 1 + UP * (0.1 - i * 1.2))
            self.play(FadeIn(n, d, e), run_time=0.5)
        self.wait(1.5)
        self.play(FadeOut(*self.mobjects))

        # What attackers can steal
        steal_title = Text("What Can XSS Steal?", font_size=28, color=RED).shift(UP * 2.5)
        self.play(Write(steal_title))

        stolen = [
            ("Cookies & session tokens", "Hijack user sessions"),
            ("Keystrokes", "Capture passwords"),
            ("Personal data", "Read page content"),
            ("Redirect users", "Phishing attacks"),
        ]
        for i, (item, impact) in enumerate(stolen):
            it = Text(f"💀 {item}", font_size=16, color=RED).shift(LEFT * 1.5 + UP * (1 - i * 0.7))
            im = Text(f"→ {impact}", font_size=14, color=GREY).next_to(it, DOWN, buff=0.05, aligned_edge=LEFT)
            self.play(FadeIn(it, im), run_time=0.35)
        self.wait(1)
        self.play(FadeOut(*self.mobjects))

        # Prevention
        fix_title = Text("Prevention", font_size=28, color=GREEN).shift(UP * 2.5)
        self.play(Write(fix_title))

        fixes = [
            ("Sanitize inputs", "Escape HTML special characters"),
            ("Content Security Policy", "CSP header blocks inline scripts"),
            ("HttpOnly cookies", "JS can't access session cookies"),
            ("Use frameworks", "React/Vue auto-escape by default"),
        ]
        for i, (fix, desc) in enumerate(fixes):
            f = Text(f"✅ {fix}", font_size=16, color=GREEN).shift(LEFT * 1.5 + UP * (1 - i * 0.7))
            d = Text(desc, font_size=13, color=GREY).next_to(f, DOWN, buff=0.05, aligned_edge=LEFT)
            self.play(FadeIn(f, d), run_time=0.35)

        self.wait(2)
        self.play(FadeOut(*self.mobjects))
