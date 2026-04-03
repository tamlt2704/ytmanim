from pathlib import Path
from manim import *

MUSIC = str(Path(__file__).resolve().parent.parent.parent / "music.mp3")


class Pagination(Scene):
    def construct(self):
        self.add_sound(MUSIC)
        title = Text("API Pagination Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        # All data
        all_data = VGroup()
        for i in range(12):
            box = Rectangle(width=0.6, height=0.5, color=GREY, fill_opacity=0.2)
            box.shift(LEFT * 3.3 + RIGHT * (i % 6) * 0.7 + UP * (0.5 - (i // 6) * 0.6))
            txt = Text(str(i + 1), font_size=12).move_to(box)
            all_data.add(VGroup(box, txt))
        all_label = Text("12 records total", font_size=16).shift(UP * 2)
        self.play(FadeIn(all_data, all_label), run_time=0.5)

        self.wait(0.5)

        # Page 1
        page_colors = [BLUE, GREEN, ORANGE]
        for page in range(3):
            start = page * 4
            highlight = SurroundingRectangle(
                VGroup(*all_data[start:start + 4]), color=page_colors[page], buff=0.05
            )
            page_label = Text(f"Page {page + 1}: ?page={page + 1}&limit=4", font_size=16, color=page_colors[page]).shift(DOWN * (1.5 + page * 0.6))
            self.play(Create(highlight), Write(page_label), run_time=0.5)
            self.wait(0.3)

        self.wait(2)
