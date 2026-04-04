from manim import *

class BinarySearch(Scene):
    def construct(self):
        title = Text("Binary Search Visualized", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
        target = 23
        target_label = Text(f"Find: {target}", font_size=24, color=YELLOW).shift(UP * 2.5)
        self.play(Write(target_label))

        boxes = VGroup()
        for i, val in enumerate(arr):
            box = Square(side_length=0.7, color=BLUE, fill_opacity=0.2)
            box.shift(LEFT * 4.5 + RIGHT * i * 1)
            txt = Text(str(val), font_size=14).move_to(box)
            boxes.add(VGroup(box, txt))
        self.play(FadeIn(boxes), run_time=0.5)

        step_count = 0
        lo, hi = 0, len(arr) - 1
        while lo <= hi:
            mid = (lo + hi) // 2
            step_count += 1
            bracket_lo = Brace(boxes[lo][0], DOWN, color=GREEN)
            bracket_hi = Brace(boxes[hi][0], DOWN, color=GREEN)
            mid_arrow = Arrow(UP * 0.8, DOWN * 0.1, color=RED, stroke_width=3).next_to(boxes[mid][0], UP, buff=0.1)
            mid_label = Text("mid", font_size=14, color=RED).next_to(mid_arrow, UP, buff=0.05)
            step_lbl = Text(f"Step {step_count}", font_size=14, color=YELLOW).shift(DOWN * 2.5)

            self.play(FadeIn(bracket_lo, bracket_hi, mid_arrow, mid_label, step_lbl), run_time=0.5)
            self.wait(0.5)

            if arr[mid] == target:
                boxes[mid][0].set_fill(GREEN, opacity=0.5)
                found = Text("Found!", font_size=28, color=GREEN).shift(DOWN * 2.5)
                self.play(FadeOut(step_lbl), FadeIn(found), run_time=0.4)
                self.wait(1)
                self.play(FadeOut(bracket_lo, bracket_hi, mid_arrow, mid_label, found))
                break
            elif arr[mid] < target:
                for i in range(lo, mid + 1):
                    boxes[i][0].set_fill(GREY, opacity=0.3)
                lo = mid + 1
            else:
                for i in range(mid, hi + 1):
                    boxes[i][0].set_fill(GREY, opacity=0.3)
                hi = mid - 1

            self.play(FadeOut(bracket_lo, bracket_hi, mid_arrow, mid_label, step_lbl), run_time=0.3)

        self.play(FadeOut(target_label, boxes))

        # Complexity comparison
        comp_title = Text("Binary Search vs Linear Search", font_size=28, color=YELLOW).shift(UP * 2.5)
        self.play(Write(comp_title))

        linear_bar = Rectangle(width=5, height=0.6, color=RED, fill_opacity=0.4).shift(UP * 1 + LEFT * 0.5)
        linear_lbl = Text("Linear: O(n) — check every element", font_size=14, color=RED).next_to(linear_bar, DOWN, buff=0.1)
        binary_bar = Rectangle(width=1.5, height=0.6, color=GREEN, fill_opacity=0.4).shift(DOWN * 0.5 + LEFT * 2.25)
        binary_lbl = Text("Binary: O(log n) — halve each step", font_size=14, color=GREEN).next_to(binary_bar, DOWN, buff=0.1)

        self.play(FadeIn(linear_bar, linear_lbl), run_time=0.5)
        self.play(FadeIn(binary_bar, binary_lbl), run_time=0.5)
        self.wait(1.5)
        self.play(FadeOut(comp_title, linear_bar, linear_lbl, binary_bar, binary_lbl))

        # Scale example
        scale_title = Text("At Scale", font_size=28, color=TEAL).shift(UP * 2.5)
        self.play(Write(scale_title))

        scale_data = [
            ("1,000 items", "10 steps", "1,000 steps"),
            ("1,000,000 items", "20 steps", "1,000,000 steps"),
            ("1 billion items", "30 steps", "1 billion steps"),
        ]
        headers = VGroup(
            Text("Data Size", font_size=16, weight=BOLD).shift(LEFT * 3.5),
            Text("Binary", font_size=16, color=GREEN, weight=BOLD),
            Text("Linear", font_size=16, color=RED, weight=BOLD).shift(RIGHT * 3.5),
        ).shift(UP * 1.5)
        self.play(FadeIn(headers), run_time=0.3)

        for i, (size, binary, linear) in enumerate(scale_data):
            row = VGroup(
                Text(size, font_size=14).shift(LEFT * 3.5),
                Text(binary, font_size=14, color=GREEN),
                Text(linear, font_size=14, color=RED).shift(RIGHT * 3.5),
            ).shift(UP * (0.7 - i * 0.7))
            self.play(FadeIn(row), run_time=0.4)

        req = Text("Requirement: array must be sorted!", font_size=18, color=YELLOW).shift(DOWN * 2.5)
        self.play(Write(req))
        self.wait(2)
        self.play(FadeOut(*self.mobjects))
