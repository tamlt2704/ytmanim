from manim import *

class Recursion(Scene):
    def construct(self):
        title = Text("Recursion Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        header = Text("factorial(5)", font_size=28, color=YELLOW).shift(UP * 3)
        self.play(Write(header))

        calls = ["5 × factorial(4)", "4 × factorial(3)", "3 × factorial(2)", "2 × factorial(1)", "1 (base case)"]
        colors = [BLUE, GREEN, ORANGE, PURPLE, RED]
        boxes = VGroup()

        for i, (call, color) in enumerate(zip(calls, colors)):
            box = RoundedRectangle(corner_radius=0.1, width=4, height=0.6, color=color, fill_opacity=0.2)
            box.shift(UP * (1.8 - i * 0.8))
            txt = Text(call, font_size=16, color=color).move_to(box)
            group = VGroup(box, txt)
            boxes.add(group)
            self.play(FadeIn(group), run_time=0.4)

        self.wait(0.5)

        results = ["1", "2", "6", "24", "120"]
        for i in range(len(boxes) - 1, -1, -1):
            result = Text(f"= {results[len(boxes) - 1 - i]}", font_size=16, color=GREEN).next_to(boxes[i], RIGHT, buff=0.2)
            self.play(FadeIn(result), run_time=0.3)

        answer = Text("factorial(5) = 120", font_size=32, color=GREEN).shift(DOWN * 2.5)
        self.play(Write(answer))
        self.wait(1)
        self.play(FadeOut(header, boxes, answer, *self.mobjects))

        # Two parts of recursion
        parts_title = Text("Every Recursion Needs", font_size=28, color=YELLOW).shift(UP * 2.5)
        self.play(Write(parts_title))

        base = VGroup(
            Text("1. Base Case", font_size=22, color=GREEN, weight=BOLD),
            Text("When to STOP recursing", font_size=16),
            Text("if (n <= 1) return 1", font_size=14, color=GREEN, font="Monospace"),
        ).arrange(DOWN).shift(UP * 0.8)

        recursive = VGroup(
            Text("2. Recursive Case", font_size=22, color=BLUE, weight=BOLD),
            Text("Call itself with smaller input", font_size=16),
            Text("return n * factorial(n - 1)", font_size=14, color=BLUE, font="Monospace"),
        ).arrange(DOWN).shift(DOWN * 1.2)

        self.play(FadeIn(base), run_time=0.5)
        self.play(FadeIn(recursive), run_time=0.5)

        warning = Text("Missing base case = infinite recursion = stack overflow! 💥", font_size=14, color=RED).shift(DOWN * 2.8)
        self.play(Write(warning))
        self.wait(1.5)
        self.play(FadeOut(*self.mobjects))

        # Recursion vs Iteration
        vs_title = Text("Recursion vs Iteration", font_size=28, color=TEAL).shift(UP * 2.5)
        self.play(Write(vs_title))

        rec = VGroup(
            Text("Recursion", font_size=18, color=BLUE, weight=BOLD),
            Text("• Elegant for trees, graphs", font_size=14),
            Text("• Uses call stack (memory)", font_size=14),
            Text("• Risk of stack overflow", font_size=14),
            Text("• Divide & conquer problems", font_size=14),
        ).arrange(DOWN, aligned_edge=LEFT).shift(LEFT * 3 + DOWN * 0.2)

        itr = VGroup(
            Text("Iteration", font_size=18, color=GREEN, weight=BOLD),
            Text("• Better for simple loops", font_size=14),
            Text("• Uses constant memory", font_size=14),
            Text("• No stack overflow risk", font_size=14),
            Text("• Generally faster", font_size=14),
        ).arrange(DOWN, aligned_edge=LEFT).shift(RIGHT * 3 + DOWN * 0.2)

        self.play(FadeIn(rec), run_time=0.5)
        self.play(FadeIn(itr), run_time=0.5)
        self.wait(2)
        self.play(FadeOut(*self.mobjects))
