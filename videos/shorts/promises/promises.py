from manim import *

class Promises(Scene):
    def construct(self):
        title = Text("Promises Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        states = [
            ("Pending", YELLOW, "⏳"),
            ("Fulfilled", GREEN, "✅"),
            ("Rejected", RED, "❌"),
        ]

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

        # Chaining
        chain = Text(".then().then().then().catch()", font_size=20, color=BLUE).shift(DOWN * 3)
        chain_label = Text("Promise Chaining", font_size=16, color=BLUE).next_to(chain, UP, buff=0.2)
        self.play(Write(chain_label), Write(chain))
        self.wait(2)
