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

        lo, hi = 0, len(arr) - 1
        while lo <= hi:
            mid = (lo + hi) // 2
            bracket_lo = Brace(boxes[lo][0], DOWN, color=GREEN)
            bracket_hi = Brace(boxes[hi][0], DOWN, color=GREEN)
            mid_arrow = Arrow(UP * 0.8, DOWN * 0.1, color=RED, stroke_width=3).next_to(boxes[mid][0], UP, buff=0.1)
            mid_label = Text("mid", font_size=14, color=RED).next_to(mid_arrow, UP, buff=0.05)

            self.play(FadeIn(bracket_lo, bracket_hi, mid_arrow, mid_label), run_time=0.5)
            self.wait(0.5)

            if arr[mid] == target:
                boxes[mid][0].set_fill(GREEN, opacity=0.5)
                found = Text("Found!", font_size=28, color=GREEN).shift(DOWN * 2.5)
                self.play(FadeIn(found), run_time=0.4)
                self.wait(2)
                break
            elif arr[mid] < target:
                for i in range(lo, mid + 1):
                    boxes[i][0].set_fill(GREY, opacity=0.3)
                lo = mid + 1
            else:
                for i in range(mid, hi + 1):
                    boxes[i][0].set_fill(GREY, opacity=0.3)
                hi = mid - 1

            self.play(FadeOut(bracket_lo, bracket_hi, mid_arrow, mid_label), run_time=0.3)
