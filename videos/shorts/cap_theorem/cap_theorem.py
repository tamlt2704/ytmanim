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
        self.wait(1.5)
        self.play(FadeOut(triangle, c, a, p, pick2))

        # Explain each property
        props = [
            ("Consistency", "Every read gets the latest write", RED,
             "All nodes see the same data at the same time"),
            ("Availability", "Every request gets a response", GREEN,
             "System always responds, even if data is stale"),
            ("Partition Tolerance", "System works despite network splits", BLUE,
             "Nodes can't communicate but system continues"),
        ]

        for name, desc, color, detail in props:
            header = Text(name, font_size=32, color=color, weight=BOLD).shift(UP * 1.5)
            d = Text(desc, font_size=20).shift(UP * 0.3)
            det = Text(detail, font_size=16, color=GREY).shift(DOWN * 0.5)
            self.play(Write(header), run_time=0.4)
            self.play(FadeIn(d), run_time=0.3)
            self.play(FadeIn(det), run_time=0.3)
            self.wait(1)
            self.play(FadeOut(header, d, det), run_time=0.3)

        # Examples with detail
        ex_title = Text("Real-World Tradeoffs", font_size=28, color=YELLOW).shift(UP * 2.5)
        self.play(Write(ex_title))

        examples = [
            ("CP", "MongoDB, Redis, HBase", RED, "Consistent but may reject requests"),
            ("AP", "Cassandra, DynamoDB, CouchDB", GREEN, "Always available, eventually consistent"),
            ("CA", "Traditional RDBMS (single node)", BLUE, "No partition tolerance"),
        ]
        for i, (combo, dbs, color, note) in enumerate(examples):
            combo_txt = Text(combo, font_size=22, color=color, weight=BOLD).shift(LEFT * 4 + UP * (1 - i * 1.2))
            db_txt = Text(dbs, font_size=16).shift(LEFT * 0.5 + UP * (1 - i * 1.2))
            note_txt = Text(note, font_size=12, color=GREY).shift(LEFT * 0.5 + UP * (0.6 - i * 1.2))
            self.play(FadeIn(combo_txt, db_txt, note_txt), run_time=0.5)

        self.wait(2)
        self.play(FadeOut(*self.mobjects))
