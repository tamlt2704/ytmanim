from manim import *

class ACIDProperties(Scene):
    def construct(self):
        title = Text("ACID Properties Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        props = [
            ("A", "Atomicity", "All or nothing", RED),
            ("C", "Consistency", "Valid state always", BLUE),
            ("I", "Isolation", "No interference", GREEN),
            ("D", "Durability", "Persisted forever", ORANGE),
        ]

        for letter, name, desc, color in props:
            big = Text(letter, font_size=72, color=color, weight=BOLD).shift(LEFT * 2)
            full = Text(name, font_size=32, color=color).next_to(big, RIGHT, buff=0.3)
            description = Text(desc, font_size=22).shift(DOWN * 1)
            self.play(FadeIn(big), Write(full), run_time=0.5)
            self.play(Write(description), run_time=0.4)
            self.wait(0.8)
            self.play(FadeOut(big, full, description), run_time=0.3)

        all_text = Text("ACID", font_size=64, color=YELLOW, weight=BOLD)
        self.play(Write(all_text))
        self.wait(1)
        self.play(FadeOut(all_text))

        # Atomicity example
        atom_title = Text("Atomicity: Bank Transfer", font_size=28, color=RED).shift(UP * 2.5)
        self.play(Write(atom_title))

        acc_a = RoundedRectangle(corner_radius=0.15, width=2.5, height=1, color=BLUE, fill_opacity=0.2).shift(LEFT * 3)
        acc_a_lbl = Text("Account A\n$1000", font_size=14).move_to(acc_a)
        acc_b = RoundedRectangle(corner_radius=0.15, width=2.5, height=1, color=GREEN, fill_opacity=0.2).shift(RIGHT * 3)
        acc_b_lbl = Text("Account B\n$500", font_size=14).move_to(acc_b)
        self.play(FadeIn(acc_a, acc_a_lbl, acc_b, acc_b_lbl))

        a1 = Arrow(acc_a.get_right(), acc_b.get_left(), buff=0.1, color=YELLOW, stroke_width=3)
        a1_lbl = Text("Transfer $200", font_size=14, color=YELLOW).next_to(a1, UP, buff=0.1)
        self.play(GrowArrow(a1), FadeIn(a1_lbl), run_time=0.5)

        fail = Text("❌ Crash mid-transfer?", font_size=18, color=RED).shift(DOWN * 1.5)
        rollback = Text("→ Both accounts unchanged (rollback)", font_size=16, color=GREEN).shift(DOWN * 2.2)
        self.play(Write(fail), run_time=0.4)
        self.play(Write(rollback), run_time=0.4)
        self.wait(1.5)
        self.play(FadeOut(atom_title, acc_a, acc_a_lbl, acc_b, acc_b_lbl, a1, a1_lbl, fail, rollback))

        # Isolation example
        iso_title = Text("Isolation: Concurrent Transactions", font_size=28, color=GREEN).shift(UP * 2.5)
        self.play(Write(iso_title))

        tx1 = RoundedRectangle(corner_radius=0.15, width=3, height=0.7, color=BLUE, fill_opacity=0.2).shift(LEFT * 2.5 + UP * 1)
        tx1_lbl = Text("Transaction 1: Read balance", font_size=14).move_to(tx1)
        tx2 = RoundedRectangle(corner_radius=0.15, width=3, height=0.7, color=GREEN, fill_opacity=0.2).shift(RIGHT * 2.5 + UP * 1)
        tx2_lbl = Text("Transaction 2: Update balance", font_size=14).move_to(tx2)
        self.play(FadeIn(tx1, tx1_lbl, tx2, tx2_lbl))

        wall = Line(UP * 0.3, DOWN * 1, color=YELLOW, stroke_width=4)
        wall_lbl = Text("Isolated!", font_size=16, color=YELLOW).next_to(wall, DOWN, buff=0.1)
        self.play(Create(wall), FadeIn(wall_lbl), run_time=0.5)

        levels = VGroup(
            Text("Read Uncommitted → Read Committed → Repeatable Read → Serializable", font_size=12, color=GREY),
        ).shift(DOWN * 2)
        self.play(FadeIn(levels), run_time=0.5)
        self.wait(2)
        self.play(FadeOut(iso_title, tx1, tx1_lbl, tx2, tx2_lbl, wall, wall_lbl, levels))
