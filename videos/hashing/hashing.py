from pathlib import Path
from manim import *

MUSIC = str(Path(__file__).resolve().parent.parent.parent / "music.mp3")


class Hashing(Scene):
    def construct(self):
        self.add_sound(MUSIC)
        title = Text("Hashing Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        inputs = [
            ("Hello", "2cf24dba5fb0a30e..."),
            ("Hello!", "334d016f755cd6dc..."),
            ("Hello World with a very long string", "a591a6d40bf42040..."),
        ]

        for i, (inp, out) in enumerate(inputs):
            display_inp = inp if len(inp) < 20 else inp[:20] + "..."
            input_text = Text(display_inp, font_size=18, color=BLUE).shift(LEFT * 3.5 + UP * (1.5 - i * 1.5))
            hash_func = RoundedRectangle(corner_radius=0.15, width=1.5, height=0.6, color=YELLOW, fill_opacity=0.2)
            hash_func.shift(UP * (1.5 - i * 1.5))
            hf_label = Text("SHA256", font_size=12, color=YELLOW).move_to(hash_func)
            output_text = Text(out, font_size=14, color=GREEN).shift(RIGHT * 3 + UP * (1.5 - i * 1.5))

            a1 = Arrow(input_text.get_right(), hash_func.get_left(), buff=0.1, color=BLUE, stroke_width=2)
            a2 = Arrow(hash_func.get_right(), output_text.get_left(), buff=0.1, color=GREEN, stroke_width=2)
            self.play(FadeIn(input_text), GrowArrow(a1), FadeIn(hash_func, hf_label), GrowArrow(a2), FadeIn(output_text), run_time=0.7)

        props = VGroup(
            Text("✓ One-way (can't reverse)", font_size=16, color=GREEN),
            Text("✓ Fixed length output", font_size=16, color=GREEN),
            Text("✓ Small change = totally different hash", font_size=16, color=YELLOW),
        ).arrange(DOWN, aligned_edge=LEFT).shift(DOWN * 2.5)
        self.play(FadeIn(props), run_time=0.5)
        self.wait(2)
