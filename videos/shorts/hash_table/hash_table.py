from manim import *

class HashTable(Scene):
    def construct(self):
        title = Text("Hash Tables Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        # Buckets
        buckets = VGroup()
        for i in range(6):
            box = Rectangle(width=2, height=0.6, color=BLUE, fill_opacity=0.1)
            box.shift(RIGHT * 2 + UP * (2 - i * 0.8))
            idx = Text(str(i), font_size=14, color=GREY).next_to(box, LEFT, buff=0.2)
            buckets.add(VGroup(box, idx))
        self.play(FadeIn(buckets), run_time=0.5)

        entries = [("name", 2, GREEN), ("age", 0, YELLOW), ("city", 4, ORANGE), ("job", 2, RED)]

        for key, bucket_idx, color in entries:
            key_text = Text(f'"{key}"', font_size=18, color=color).shift(LEFT * 3)
            arrow = Arrow(LEFT * 2, LEFT * 0.5, color=color, stroke_width=2)
            hash_label = Text(f"hash → {bucket_idx}", font_size=14, color=color).next_to(arrow, UP, buff=0.1)
            self.play(FadeIn(key_text), GrowArrow(arrow), FadeIn(hash_label), run_time=0.5)

            val = Text(key, font_size=14, color=color).move_to(buckets[bucket_idx][0]).shift(RIGHT * 0.3)
            self.play(FadeIn(val), run_time=0.3)
            self.play(FadeOut(key_text, arrow, hash_label), run_time=0.3)

        collision = Text("Collision at index 2!", font_size=20, color=RED).shift(DOWN * 2.5)
        self.play(Write(collision))
        self.wait(1)
        self.play(FadeOut(buckets, collision, *self.mobjects))

        # Collision resolution
        col_title = Text("Collision Resolution", font_size=28, color=YELLOW).shift(UP * 2.5)
        self.play(Write(col_title))

        # Chaining
        chain_lbl = Text("1. Chaining (Linked Lists)", font_size=20, color=BLUE).shift(UP * 1.5)
        self.play(Write(chain_lbl))

        chain_bucket = Rectangle(width=1.5, height=0.6, color=BLUE, fill_opacity=0.2).shift(LEFT * 3 + UP * 0.5)
        chain_idx = Text("[2]", font_size=14).next_to(chain_bucket, LEFT, buff=0.1)
        node1 = RoundedRectangle(corner_radius=0.1, width=1.2, height=0.5, color=GREEN, fill_opacity=0.3).shift(LEFT * 0.5 + UP * 0.5)
        n1_lbl = Text("name", font_size=12).move_to(node1)
        node2 = RoundedRectangle(corner_radius=0.1, width=1.2, height=0.5, color=RED, fill_opacity=0.3).shift(RIGHT * 1.5 + UP * 0.5)
        n2_lbl = Text("job", font_size=12).move_to(node2)
        chain_arrow = Arrow(node1.get_right(), node2.get_left(), buff=0.05, color=WHITE, stroke_width=2)
        self.play(FadeIn(chain_bucket, chain_idx, node1, n1_lbl, node2, n2_lbl), GrowArrow(chain_arrow), run_time=0.5)
        self.wait(1)

        # Open addressing
        open_lbl = Text("2. Open Addressing (Linear Probing)", font_size=20, color=GREEN).shift(DOWN * 0.8)
        self.play(Write(open_lbl))

        probe_boxes = VGroup()
        for i in range(5):
            b = Rectangle(width=1, height=0.5, color=GREEN if i != 2 else RED, fill_opacity=0.2)
            b.shift(LEFT * 2 + RIGHT * i * 1.1 + DOWN * 1.8)
            idx = Text(str(i + 1), font_size=10).next_to(b, DOWN, buff=0.05)
            probe_boxes.add(VGroup(b, idx))
        self.play(FadeIn(probe_boxes), run_time=0.3)

        probe_arrow = Arrow(probe_boxes[2][0].get_top() + UP * 0.3, probe_boxes[3][0].get_top() + UP * 0.3,
                           color=YELLOW, stroke_width=2)
        probe_lbl = Text("occupied → next slot", font_size=12, color=YELLOW).next_to(probe_arrow, UP, buff=0.05)
        self.play(GrowArrow(probe_arrow), FadeIn(probe_lbl), run_time=0.4)
        self.wait(1)
        self.play(FadeOut(*self.mobjects))

        # Complexity
        comp_title = Text("Time Complexity", font_size=28, color=TEAL).shift(UP * 2.5)
        self.play(Write(comp_title))

        ops = [
            ("Insert", "O(1)", "O(n)", GREEN, RED),
            ("Lookup", "O(1)", "O(n)", GREEN, RED),
            ("Delete", "O(1)", "O(n)", GREEN, RED),
        ]
        headers = VGroup(
            Text("Operation", font_size=16, weight=BOLD).shift(LEFT * 3),
            Text("Average", font_size=16, color=GREEN, weight=BOLD),
            Text("Worst", font_size=16, color=RED, weight=BOLD).shift(RIGHT * 3),
        ).shift(UP * 1.5)
        self.play(FadeIn(headers), run_time=0.3)

        for i, (op, avg, worst, ac, wc) in enumerate(ops):
            row = VGroup(
                Text(op, font_size=16).shift(LEFT * 3),
                Text(avg, font_size=16, color=ac),
                Text(worst, font_size=16, color=wc).shift(RIGHT * 3),
            ).shift(UP * (0.7 - i * 0.7))
            self.play(FadeIn(row), run_time=0.35)

        note = Text("Worst case: all keys hash to same bucket", font_size=14, color=GREY).shift(DOWN * 2)
        self.play(Write(note))
        self.wait(2)
        self.play(FadeOut(*self.mobjects))
