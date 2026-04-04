from manim import *

class HTTPSHandshake(Scene):
    def construct(self):

        title = Text("How HTTPS Handshake Works", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        # Why HTTPS
        why = Text("HTTP sends data in plain text 😱", font_size=28, color=RED)
        self.play(Write(why))
        self.wait(1)
        fix = Text("HTTPS encrypts everything 🔒", font_size=28, color=GREEN).shift(DOWN * 1)
        self.play(Write(fix))
        self.wait(1)
        self.play(FadeOut(why, fix))

        client = RoundedRectangle(corner_radius=0.2, width=2.5, height=1.2, color=BLUE).shift(LEFT * 4)
        client_label = Text("Client", font_size=22).move_to(client)
        server = RoundedRectangle(corner_radius=0.2, width=2.5, height=1.2, color=GREEN).shift(RIGHT * 4)
        server_label = Text("Server", font_size=22).move_to(server)

        self.play(FadeIn(client, client_label, server, server_label))
        self.wait(0.5)

        steps = [
            ("ClientHello", client, server, BLUE, "Supported ciphers + random"),
            ("ServerHello + Cert", server, client, GREEN, "Chosen cipher + certificate"),
            ("Key Exchange", client, server, YELLOW, "Pre-master secret"),
            ("Finished", server, client, ORANGE, "Session keys derived"),
            ("Encrypted Data ✓", client, server, TEAL, "All traffic encrypted"),
        ]

        for text, src, dst, color, detail in steps:
            arrow = Arrow(src.get_right() if src == client else src.get_left(),
                          dst.get_left() if dst == server else dst.get_right(),
                          buff=0.1, color=color, stroke_width=3)
            label = Text(text, font_size=16, color=color).next_to(arrow, UP, buff=0.1)
            desc = Text(detail, font_size=12, color=GREY).next_to(arrow, DOWN, buff=0.1)
            self.play(GrowArrow(arrow), FadeIn(label, desc), run_time=0.6)
            self.wait(0.8)
            self.play(FadeOut(arrow, label, desc), run_time=0.3)

        lock = Text("🔒 Connection Secure", font_size=36, color=GREEN)
        self.play(FadeOut(client, client_label, server, server_label), Write(lock))
        self.wait(1)
        self.play(FadeOut(lock))

        # TLS versions
        tls_title = Text("TLS Versions", font_size=32, color=YELLOW).shift(UP * 2.5)
        self.play(Write(tls_title))

        versions = [
            ("TLS 1.0", "Deprecated ❌", RED),
            ("TLS 1.1", "Deprecated ❌", RED),
            ("TLS 1.2", "Still used ⚠️", YELLOW),
            ("TLS 1.3", "Recommended ✅", GREEN),
        ]
        for i, (ver, status, color) in enumerate(versions):
            v = Text(ver, font_size=20, color=color, weight=BOLD).shift(LEFT * 2 + UP * (1 - i * 0.8))
            s = Text(status, font_size=16).shift(RIGHT * 2 + UP * (1 - i * 0.8))
            self.play(FadeIn(v, s), run_time=0.4)

        tls_note = Text("TLS 1.3: faster handshake (1-RTT)", font_size=18, color=GREEN).shift(DOWN * 2.5)
        self.play(Write(tls_note))
        self.wait(2)
        self.play(FadeOut(tls_title, tls_note, *self.mobjects))
