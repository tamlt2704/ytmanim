from manim import *

class CAPTheorem(Scene):
    def construct(self):
        title = Text("CAP Theorem Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        triangle = Triangle(color=WHITE).scale(2.5)
        self.play(Create(triangle))

        c = Text("Consistency", font_size=22, color=RED).next_to(triangle, UP, buff=0.2)
        a = Text("Availability", font_size=22, color=GREEN).next_to(triangle, DOWN + LEFT, buff=0.3)
        p = Text("Partition\nTolerance", font_size=18, color=BLUE).next_to(triangle, DOWN + RIGHT, buff=0.3)
        self.play(Write(c), Write(a), Write(p))
        self.wait(0.5)

        pick2 = Text("Pick 2 out of 3!", font_size=28, color=YELLOW).shift(DOWN * 2.8)
        self.play(Write(pick2))
        self.wait(1)

        examples = [
            ("CP: MongoDB, Redis", RED),
            ("AP: Cassandra, DynamoDB", GREEN),
            ("CA: Traditional RDBMS", BLUE),
        ]
        for i, (txt, color) in enumerate(examples):
            ex = Text(txt, font_size=16, color=color).shift(RIGHT * 3.5 + UP * (1 - i * 0.6))
            self.play(FadeIn(ex), run_time=0.4)

        self.wait(2)
