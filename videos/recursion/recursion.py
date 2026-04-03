from pathlib import Path
from manim import *

MUSIC = str(Path(__file__).resolve().parent.parent.parent / "music.mp3")


class Recursion(Scene):
    def construct(self):
        self.add_sound(MUSIC)
        title = Text("Recursion Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        # Factorial call stack
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

        # Unwind
        results = ["1", "2", "6", "24", "120"]
        for i in range(len(boxes) - 1, -1, -1):
            result = Text(f"= {results[len(boxes) - 1 - i]}", font_size=16, color=GREEN).next_to(boxes[i], RIGHT, buff=0.2)
            self.play(FadeIn(result), run_time=0.3)

        answer = Text("factorial(5) = 120", font_size=32, color=GREEN).shift(DOWN * 2.5)
        self.play(Write(answer))
        self.wait(2)
