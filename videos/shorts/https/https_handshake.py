from manim import *

class HTTPSHandshake(Scene):
    def construct(self):

        title = Text("How HTTPS Handshake Works", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        client = RoundedRectangle(corner_radius=0.2, width=2.5, height=1.2, color=BLUE).shift(LEFT * 4)
        client_label = Text("Client", font_size=22).move_to(client)
        server = RoundedRectangle(corner_radius=0.2, width=2.5, height=1.2, color=GREEN).shift(RIGHT * 4)
        server_label = Text("Server", font_size=22).move_to(server)

        self.play(FadeIn(client, client_label, server, server_label))
        self.wait(0.5)

        steps = [
            ("ClientHello", client, server, BLUE),
            ("ServerHello + Cert", server, client, GREEN),
            ("Key Exchange", client, server, YELLOW),
            ("Finished", server, client, ORANGE),
            ("Encrypted Data ✓", client, server, TEAL),
        ]

        for text, src, dst, color in steps:
            arrow = Arrow(src.get_right() if src == client else src.get_left(),
                          dst.get_left() if dst == server else dst.get_right(),
                          buff=0.1, color=color, stroke_width=3)
            label = Text(text, font_size=16, color=color).next_to(arrow, UP, buff=0.1)
            self.play(GrowArrow(arrow), FadeIn(label), run_time=0.6)
            self.wait(0.5)
            self.play(FadeOut(arrow), FadeOut(label), run_time=0.3)

        lock = Text("🔒 Connection Secure", font_size=36, color=GREEN)
        self.play(FadeOut(client, client_label, server, server_label), Write(lock))
        self.wait(2)
        self.play(FadeOut(lock))
