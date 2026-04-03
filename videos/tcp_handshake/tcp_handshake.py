from pathlib import Path
from manim import *

MUSIC = str(Path(__file__).resolve().parent.parent.parent / "music.mp3")


class TCPHandshake(Scene):
    def construct(self):
        self.add_sound(MUSIC)
        title = Text("TCP 3-Way Handshake", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        client = RoundedRectangle(corner_radius=0.2, width=2.5, height=1.2, color=BLUE).shift(LEFT * 4)
        client_label = Text("Client", font_size=20).move_to(client)
        server = RoundedRectangle(corner_radius=0.2, width=2.5, height=1.2, color=GREEN).shift(RIGHT * 4)
        server_label = Text("Server", font_size=20).move_to(server)
        self.play(FadeIn(client, client_label, server, server_label))

        steps = [
            ("SYN", client, server, BLUE, "Can we connect?"),
            ("SYN-ACK", server, client, GREEN, "Yes, go ahead!"),
            ("ACK", client, server, YELLOW, "Great, connected!"),
        ]

        for i, (flag, src, dst, color, desc) in enumerate(steps):
            y_offset = DOWN * (i * 0.8)
            start = src.get_right() if src == client else src.get_left()
            end = dst.get_left() if dst == server else dst.get_right()
            arrow = Arrow(start + y_offset, end + y_offset, buff=0.1, color=color, stroke_width=3)
            label = Text(flag, font_size=20, color=color, weight=BOLD).next_to(arrow, UP, buff=0.05)
            description = Text(desc, font_size=14, color=GREY).next_to(arrow, DOWN, buff=0.05)
            self.play(GrowArrow(arrow), FadeIn(label, description), run_time=0.6)
            self.wait(0.3)

        connected = Text("✅ Connection Established!", font_size=28, color=GREEN).shift(DOWN * 3)
        self.play(Write(connected))
        self.wait(2)
