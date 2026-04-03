from pathlib import Path
from manim import *

MUSIC = str(Path(__file__).resolve().parent.parent.parent / "music.mp3")


class Hoisting(Scene):
    def construct(self):
        self.add_sound(MUSIC)
        title = Text("JavaScript Hoisting", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        before_label = Text("What you write:", font_size=22, color=BLUE).shift(LEFT * 3 + UP * 2.5)
        self.play(Write(before_label))
        code_before = [
            'console.log(x)  // ???',
            'var x = 5',
        ]
        before_group = VGroup()
        for i, line in enumerate(code_before):
            txt = Text(line, font_size=18).shift(LEFT * 3 + UP * (1.5 - i * 0.6))
            before_group.add(txt)
            self.play(FadeIn(txt), run_time=0.3)

        after_label = Text("What JS sees:", font_size=22, color=GREEN).shift(RIGHT * 3 + UP * 2.5)
        self.play(Write(after_label))
        code_after = [
            'var x           // hoisted!',
            'console.log(x)  // undefined',
            'x = 5',
        ]
        after_group = VGroup()
        for i, line in enumerate(code_after):
            color = YELLOW if i == 0 else WHITE
            txt = Text(line, font_size=18, color=color).shift(RIGHT * 3 + UP * (1.5 - i * 0.6))
            after_group.add(txt)
            self.play(FadeIn(txt), run_time=0.3)

        tip = Text("let/const are NOT hoisted the same way!", font_size=18, color=RED).shift(DOWN * 2)
        self.play(Write(tip))
        self.wait(2)
