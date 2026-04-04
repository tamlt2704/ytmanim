from manim import *

class Promises(Scene):
    def construct(self):
        title = Text("Promises Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        pending = RoundedRectangle(corner_radius=0.2, width=2.5, height=1, color=YELLOW).shift(LEFT * 4)
        pending_label = Text("Pending ⏳", font_size=18, color=YELLOW).move_to(pending)
        self.play(FadeIn(pending, pending_label))

        fulfilled = RoundedRectangle(corner_radius=0.2, width=2.5, height=1, color=GREEN).shift(RIGHT * 2 + UP * 1.5)
        fulfilled_label = Text("Fulfilled ✅", font_size=18, color=GREEN).move_to(fulfilled)
        rejected = RoundedRectangle(corner_radius=0.2, width=2.5, height=1, color=RED).shift(RIGHT * 2 + DOWN * 1.5)
        rejected_label = Text("Rejected ❌", font_size=18, color=RED).move_to(rejected)

        a1 = Arrow(pending.get_right(), fulfilled.get_left(), buff=0.1, color=GREEN, stroke_width=3)
        a1_label = Text(".then()", font_size=14, color=GREEN).next_to(a1, UP, buff=0.05)
        a2 = Arrow(pending.get_right(), rejected.get_left(), buff=0.1, color=RED, stroke_width=3)
        a2_label = Text(".catch()", font_size=14, color=RED).next_to(a2, DOWN, buff=0.05)

        self.play(FadeIn(fulfilled, fulfilled_label), GrowArrow(a1), FadeIn(a1_label), run_time=0.6)
        self.play(FadeIn(rejected, rejected_label), GrowArrow(a2), FadeIn(a2_label), run_time=0.6)

        chain = Text(".then().then().then().catch()", font_size=20, color=BLUE).shift(DOWN * 3)
        chain_label = Text("Promise Chaining", font_size=16, color=BLUE).next_to(chain, UP, buff=0.2)
        self.play(Write(chain_label), Write(chain))
        self.wait(1)
        self.play(FadeOut(pending, pending_label, fulfilled, fulfilled_label, rejected, rejected_label,
                          a1, a1_label, a2, a2_label, chain, chain_label))

        # Creating a promise
        create_title = Text("Creating a Promise", font_size=28, color=YELLOW).shift(UP * 2.5)
        self.play(Write(create_title))

        code = VGroup(
            Text("const p = new Promise((resolve, reject) => {", font_size=14, color=YELLOW, font="Monospace"),
            Text("  fetch('/api/data')", font_size=14, font="Monospace"),
            Text("    .then(res => resolve(res))", font_size=14, color=GREEN, font="Monospace"),
            Text("    .catch(err => reject(err))", font_size=14, color=RED, font="Monospace"),
            Text("})", font_size=14, color=YELLOW, font="Monospace"),
        ).arrange(DOWN, aligned_edge=LEFT).shift(LEFT * 1 + DOWN * 0.2)
        self.play(FadeIn(code), run_time=0.6)
        self.wait(1.5)
        self.play(FadeOut(create_title, code))

        # Promise.all vs Promise.race
        combo_title = Text("Promise Combinators", font_size=28, color=TEAL).shift(UP * 2.5)
        self.play(Write(combo_title))

        combinators = [
            ("Promise.all()", "Wait for ALL to resolve", GREEN, "Fails if ANY rejects"),
            ("Promise.race()", "First to settle wins", BLUE, "Fastest promise wins"),
            ("Promise.allSettled()", "Wait for ALL to finish", ORANGE, "Never rejects"),
            ("Promise.any()", "First to RESOLVE wins", YELLOW, "Ignores rejections"),
        ]
        for i, (name, desc, color, note) in enumerate(combinators):
            n = Text(name, font_size=16, color=color, weight=BOLD, font="Monospace").shift(LEFT * 2.5 + UP * (1 - i * 0.8))
            d = Text(desc, font_size=13).shift(RIGHT * 1.5 + UP * (1.1 - i * 0.8))
            nt = Text(note, font_size=11, color=GREY).shift(RIGHT * 1.5 + UP * (0.7 - i * 0.8))
            self.play(FadeIn(n, d, nt), run_time=0.4)

        self.wait(2)
        self.play(FadeOut(*self.mobjects))
