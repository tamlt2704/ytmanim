from pathlib import Path
from manim import *

MUSIC = str(Path(__file__).resolve().parent.parent.parent / "music.mp3")


class DesignPatterns(Scene):
    def construct(self):
        self.add_sound(MUSIC)
        title = Text("3 Design Patterns Every Dev Needs", font_size=44)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        patterns = [
            ("Singleton", "One instance only", BLUE,
             ["Class", "→ instance", "→ same instance"]),
            ("Observer", "Subscribe to events", GREEN,
             ["Subject", "→ notify()", "→ Observer 1, 2, 3"]),
            ("Factory", "Create without specifying class", ORANGE,
             ["Factory", "→ create(type)", "→ ProductA / ProductB"]),
        ]

        for name, desc, color, flow in patterns:
            header = Text(name, font_size=32, color=color, weight=BOLD).shift(UP * 2)
            subtitle = Text(desc, font_size=18).shift(UP * 1.2)
            self.play(Write(header), FadeIn(subtitle), run_time=0.5)

            flow_items = VGroup()
            for i, step in enumerate(flow):
                box = RoundedRectangle(corner_radius=0.15, width=2.5, height=0.7, color=color, fill_opacity=0.2)
                box.shift(LEFT * 3 + RIGHT * i * 3)
                txt = Text(step, font_size=14, color=color).move_to(box)
                flow_items.add(VGroup(box, txt))
            self.play(FadeIn(flow_items), run_time=0.5)
            self.wait(1)
            self.play(FadeOut(header, subtitle, flow_items), run_time=0.3)

        self.wait(1)
