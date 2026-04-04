from manim import *

class MicroservicesVsMonolith(Scene):
    def construct(self):
        title = Text("Microservices vs Monolith", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        # Monolith
        mono_title = Text("Monolith", font_size=24, color=RED).shift(LEFT * 3 + UP * 2.5)
        mono = RoundedRectangle(corner_radius=0.2, width=3.5, height=3, color=RED, fill_opacity=0.15).shift(LEFT * 3)
        layers = ["UI", "Business Logic", "Data Access", "Database"]
        for i, layer in enumerate(layers):
            txt = Text(layer, font_size=14, color=RED).move_to(mono).shift(UP * (0.9 - i * 0.6))
            mono.add(txt)
        self.play(Write(mono_title), FadeIn(mono), run_time=0.6)

        # Microservices
        micro_title = Text("Microservices", font_size=24, color=GREEN).shift(RIGHT * 3 + UP * 2.5)
        self.play(Write(micro_title))
        services = ["Auth", "Users", "Orders", "Payment", "Email", "Search"]
        svc_boxes = VGroup()
        positions = [
            RIGHT * 1.5 + UP * 1, RIGHT * 3.5 + UP * 1,
            RIGHT * 1.5 + DOWN * 0.2, RIGHT * 3.5 + DOWN * 0.2,
            RIGHT * 1.5 + DOWN * 1.4, RIGHT * 3.5 + DOWN * 1.4,
        ]
        for name, pos in zip(services, positions):
            box = RoundedRectangle(corner_radius=0.1, width=1.5, height=0.7, color=GREEN, fill_opacity=0.2)
            box.move_to(pos)
            txt = Text(name, font_size=12, color=GREEN).move_to(box)
            svc_boxes.add(VGroup(box, txt))
            self.play(FadeIn(svc_boxes[-1]), run_time=0.3)

        self.wait(1)
        mono_note = Text("Single deploy", font_size=16, color=RED).shift(LEFT * 3 + DOWN * 2.5)
        micro_note = Text("Independent deploy", font_size=16, color=GREEN).shift(RIGHT * 3 + DOWN * 2.5)
        self.play(Write(mono_note), Write(micro_note))
        self.wait(1)
        self.play(FadeOut(mono_title, mono, micro_title, svc_boxes, mono_note, micro_note))

        # Comparison
        comp_title = Text("Comparison", font_size=28, color=YELLOW).shift(UP * 2.8)
        self.play(Write(comp_title))

        headers = VGroup(
            Text("", font_size=14).shift(LEFT * 3.5),
            Text("Monolith", font_size=16, color=RED, weight=BOLD),
            Text("Microservices", font_size=16, color=GREEN, weight=BOLD).shift(RIGHT * 3.5),
        ).shift(UP * 2)
        self.play(FadeIn(headers), run_time=0.3)

        rows = [
            ("Complexity", "Simple", "Complex"),
            ("Scaling", "Scale everything", "Scale per service"),
            ("Deploy", "All or nothing", "Independent"),
            ("Tech stack", "Single", "Polyglot"),
            ("Failure", "Whole app down", "Partial failure"),
        ]
        for i, (label, m, ms) in enumerate(rows):
            row = VGroup(
                Text(label, font_size=13, weight=BOLD).shift(LEFT * 3.5),
                Text(m, font_size=13, color=RED),
                Text(ms, font_size=13, color=GREEN).shift(RIGHT * 3.5),
            ).shift(UP * (1.2 - i * 0.6))
            self.play(FadeIn(row), run_time=0.35)

        self.wait(1.5)
        self.play(FadeOut(*self.mobjects))

        # When to use
        when_title = Text("When to Choose", font_size=28, color=TEAL).shift(UP * 2.5)
        self.play(Write(when_title))

        mono_when = VGroup(
            Text("Monolith when:", font_size=18, color=RED, weight=BOLD),
            Text("• Small team", font_size=16),
            Text("• Early stage startup", font_size=16),
            Text("• Simple domain", font_size=16),
        ).arrange(DOWN, aligned_edge=LEFT).shift(LEFT * 3 + DOWN * 0.2)

        micro_when = VGroup(
            Text("Microservices when:", font_size=18, color=GREEN, weight=BOLD),
            Text("• Large team", font_size=16),
            Text("• Need independent scaling", font_size=16),
            Text("• Complex domain", font_size=16),
        ).arrange(DOWN, aligned_edge=LEFT).shift(RIGHT * 3 + DOWN * 0.2)

        self.play(FadeIn(mono_when), run_time=0.5)
        self.play(FadeIn(micro_when), run_time=0.5)
        self.wait(2)
        self.play(FadeOut(*self.mobjects))
