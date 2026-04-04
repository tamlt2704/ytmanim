from manim import *

class WebSockets(Scene):
    def construct(self):
        title = Text("WebSockets Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        client = RoundedRectangle(corner_radius=0.2, width=2.5, height=1.2, color=BLUE).shift(LEFT * 4)
        client_label = Text("Client", font_size=20).move_to(client)
        server = RoundedRectangle(corner_radius=0.2, width=2.5, height=1.2, color=GREEN).shift(RIGHT * 4)
        server_label = Text("Server", font_size=20).move_to(server)
        self.play(FadeIn(client, client_label, server, server_label))

        # HTTP polling
        http_label = Text("HTTP Polling", font_size=20, color=RED).shift(UP * 2.5)
        self.play(Write(http_label))
        for _ in range(3):
            a = Arrow(client.get_right(), server.get_left(), buff=0.1, color=RED, stroke_width=2)
            b = Arrow(server.get_left(), client.get_right(), buff=0.1, color=RED, stroke_width=2).shift(DOWN * 0.2)
            self.play(GrowArrow(a), run_time=0.2)
            self.play(GrowArrow(b), run_time=0.2)
            self.play(FadeOut(a, b), run_time=0.1)
        self.play(FadeOut(http_label))

        # WebSocket
        ws_label = Text("WebSocket", font_size=20, color=GREEN).shift(UP * 2.5)
        self.play(Write(ws_label))
        handshake = Arrow(client.get_right(), server.get_left(), buff=0.1, color=YELLOW, stroke_width=3)
        hs_label = Text("Upgrade", font_size=14, color=YELLOW).next_to(handshake, UP, buff=0.05)
        self.play(GrowArrow(handshake), FadeIn(hs_label), run_time=0.5)

        pipe = Line(client.get_right(), server.get_left(), color=GREEN, stroke_width=4)
        self.play(FadeOut(handshake, hs_label), Create(pipe), run_time=0.4)

        for text, color in [("msg1", BLUE), ("msg2", GREEN), ("msg3", BLUE), ("msg4", GREEN)]:
            src = client if color == BLUE else server
            dot = Dot(src.get_center(), color=color, radius=0.1)
            target = server.get_center() if color == BLUE else client.get_center()
            self.play(dot.animate.move_to(target), run_time=0.3)
            self.play(FadeOut(dot), run_time=0.1)

        bi = Text("Full-duplex ✓", font_size=24, color=GREEN).shift(DOWN * 2)
        self.play(Write(bi))
        self.wait(1)
        self.play(FadeOut(client, client_label, server, server_label, ws_label, pipe, bi))

        # Comparison
        comp_title = Text("HTTP vs WebSocket", font_size=28, color=YELLOW).shift(UP * 2.8)
        self.play(Write(comp_title))

        headers = VGroup(
            Text("", font_size=14).shift(LEFT * 3.5),
            Text("HTTP", font_size=16, color=RED, weight=BOLD),
            Text("WebSocket", font_size=16, color=GREEN, weight=BOLD).shift(RIGHT * 3.5),
        ).shift(UP * 2)
        self.play(FadeIn(headers), run_time=0.3)

        rows = [
            ("Direction", "Request-Response", "Bidirectional"),
            ("Connection", "New per request", "Persistent"),
            ("Overhead", "Headers every time", "Minimal after handshake"),
            ("Latency", "Higher", "Very low"),
        ]
        for i, (label, http, ws) in enumerate(rows):
            row = VGroup(
                Text(label, font_size=13, weight=BOLD).shift(LEFT * 3.5),
                Text(http, font_size=13, color=RED),
                Text(ws, font_size=13, color=GREEN).shift(RIGHT * 3.5),
            ).shift(UP * (1.2 - i * 0.6))
            self.play(FadeIn(row), run_time=0.35)
        self.wait(1.5)
        self.play(FadeOut(*self.mobjects))

        # Use cases
        use_title = Text("WebSocket Use Cases", font_size=28, color=TEAL).shift(UP * 2.5)
        self.play(Write(use_title))

        uses = [
            ("Chat apps", "Real-time messaging"),
            ("Live dashboards", "Stock prices, analytics"),
            ("Online gaming", "Player movements, state sync"),
            ("Collaborative editing", "Google Docs-style"),
            ("Notifications", "Push updates instantly"),
        ]
        for i, (use, desc) in enumerate(uses):
            u = Text(f"• {use}", font_size=18, color=GREEN).shift(LEFT * 2 + UP * (1 - i * 0.6))
            d = Text(desc, font_size=14, color=GREY).shift(RIGHT * 2.5 + UP * (1 - i * 0.6))
            self.play(FadeIn(u, d), run_time=0.35)

        self.wait(2)
        self.play(FadeOut(*self.mobjects))
