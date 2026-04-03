from pathlib import Path
from manim import *

MUSIC = str(Path(__file__).resolve().parent.parent.parent / "music.mp3")


class Subnetting(Scene):
    def construct(self):
        self.add_sound(MUSIC)
        title = Text("Subnetting Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        ip = Text("192.168.1.0/24", font_size=28, color=BLUE).shift(UP * 2.5)
        self.play(Write(ip))

        # Binary representation
        bits = "11000000.10101000.00000001.00000000"
        net_bits = Text(bits[:24], font_size=14, color=GREEN).shift(UP * 1.5 + LEFT * 0.8)
        host_bits = Text(bits[24:], font_size=14, color=RED).next_to(net_bits, RIGHT, buff=0.05)
        net_label = Text("Network (24 bits)", font_size=12, color=GREEN).next_to(net_bits, DOWN, buff=0.1)
        host_label = Text("Host (8 bits)", font_size=12, color=RED).next_to(host_bits, DOWN, buff=0.1)
        self.play(FadeIn(net_bits, host_bits, net_label, host_label), run_time=0.5)

        # Subnets
        subnet_label = Text("Split into /26 subnets:", font_size=20, color=YELLOW).shift(DOWN * 0.3)
        self.play(Write(subnet_label))

        subnets = [
            ("192.168.1.0/26", "0-63", BLUE),
            ("192.168.1.64/26", "64-127", GREEN),
            ("192.168.1.128/26", "128-191", ORANGE),
            ("192.168.1.192/26", "192-255", RED),
        ]
        for i, (subnet, range_txt, color) in enumerate(subnets):
            box = RoundedRectangle(corner_radius=0.1, width=3, height=0.5, color=color, fill_opacity=0.2)
            box.shift(LEFT * 2.5 + RIGHT * (i % 2) * 5 + DOWN * (1.2 + (i // 2) * 0.7))
            txt = Text(f"{subnet} ({range_txt})", font_size=12, color=color).move_to(box)
            self.play(FadeIn(box, txt), run_time=0.3)

        self.wait(2)
