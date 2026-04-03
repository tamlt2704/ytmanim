from pathlib import Path
from manim import *

MUSIC = str(Path(__file__).resolve().parent.parent.parent / "music.mp3")


class OSIModel(Scene):
    def construct(self):
        self.add_sound(MUSIC)
        title = Text("OSI Model in 60 Seconds", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        layers = [
            ("7", "Application", "HTTP, FTP", RED),
            ("6", "Presentation", "SSL, JPEG", ORANGE),
            ("5", "Session", "Sockets", YELLOW),
            ("4", "Transport", "TCP, UDP", GREEN),
            ("3", "Network", "IP, ICMP", TEAL),
            ("2", "Data Link", "Ethernet, MAC", BLUE),
            ("1", "Physical", "Cables, Signals", PURPLE),
        ]

        boxes = VGroup()
        for i, (num, name, example, color) in enumerate(layers):
            box = Rectangle(width=8, height=0.55, color=color, fill_opacity=0.2)
            box.shift(UP * (2.1 - i * 0.65))
            n = Text(f"L{num}", font_size=14, color=color, weight=BOLD).move_to(box).shift(LEFT * 3.2)
            nm = Text(name, font_size=14, color=color).move_to(box).shift(LEFT * 1)
            ex = Text(example, font_size=12, color=GREY).move_to(box).shift(RIGHT * 2)
            group = VGroup(box, n, nm, ex)
            boxes.add(group)
            self.play(FadeIn(group), run_time=0.35)

        mnemonic = Text("All People Seem To Need Data Processing", font_size=16, color=YELLOW).shift(DOWN * 2.8)
        self.play(Write(mnemonic))
        self.wait(2)
