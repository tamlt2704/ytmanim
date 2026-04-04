from manim import *

class TCPvsUDP(Scene):
    def construct(self):
        title = Text("TCP vs UDP", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        tcp_title = Text("TCP", font_size=28, color=BLUE).shift(LEFT * 3 + UP * 2.5)
        udp_title = Text("UDP", font_size=28, color=GREEN).shift(RIGHT * 3 + UP * 2.5)
        self.play(Write(tcp_title), Write(udp_title))

        tcp_props = ["Reliable", "Ordered", "Connection-based", "Slower"]
        udp_props = ["Unreliable", "Unordered", "Connectionless", "Faster"]
        tcp_colors = [GREEN, BLUE, YELLOW, RED]
        udp_colors = [RED, ORANGE, YELLOW, GREEN]

        for i, (tp, up, tc, uc) in enumerate(zip(tcp_props, udp_props, tcp_colors, udp_colors)):
            t = Text(tp, font_size=18, color=tc).shift(LEFT * 3 + UP * (1.2 - i * 0.8))
            u = Text(up, font_size=18, color=uc).shift(RIGHT * 3 + UP * (1.2 - i * 0.8))
            self.play(FadeIn(t), FadeIn(u), run_time=0.5)

        self.wait(1)
        tcp_use = Text("Web, Email, File Transfer", font_size=16, color=BLUE).shift(LEFT * 3 + DOWN * 2.2)
        udp_use = Text("Gaming, Streaming, VoIP", font_size=16, color=GREEN).shift(RIGHT * 3 + DOWN * 2.2)
        self.play(Write(tcp_use), Write(udp_use))
        self.wait(1)
        self.play(FadeOut(*self.mobjects))

        # Visual analogy
        analogy_title = Text("Analogy", font_size=28, color=YELLOW).shift(UP * 2.5)
        self.play(Write(analogy_title))

        tcp_analogy = VGroup(
            Text("TCP = Phone Call 📞", font_size=22, color=BLUE, weight=BOLD),
            Text("• Establish connection first", font_size=14),
            Text("• Guaranteed delivery", font_size=14),
            Text("• In-order conversation", font_size=14),
        ).arrange(DOWN, aligned_edge=LEFT).shift(LEFT * 3 + DOWN * 0.2)

        udp_analogy = VGroup(
            Text("UDP = Sending Letters 📬", font_size=22, color=GREEN, weight=BOLD),
            Text("• No connection needed", font_size=14),
            Text("• Letters might get lost", font_size=14),
            Text("• May arrive out of order", font_size=14),
        ).arrange(DOWN, aligned_edge=LEFT).shift(RIGHT * 3 + DOWN * 0.2)

        self.play(FadeIn(tcp_analogy), run_time=0.5)
        self.play(FadeIn(udp_analogy), run_time=0.5)
        self.wait(1.5)
        self.play(FadeOut(*self.mobjects))

        # Header comparison
        hdr_title = Text("Header Size", font_size=28, color=TEAL).shift(UP * 2.5)
        self.play(Write(hdr_title))

        tcp_hdr = Rectangle(width=4, height=0.6, color=BLUE, fill_opacity=0.4).shift(UP * 1)
        tcp_hdr_lbl = Text("TCP Header: 20-60 bytes", font_size=16, color=BLUE).next_to(tcp_hdr, RIGHT, buff=0.3)
        udp_hdr = Rectangle(width=1.5, height=0.6, color=GREEN, fill_opacity=0.4).shift(DOWN * 0 + LEFT * 1.25)
        udp_hdr_lbl = Text("UDP Header: 8 bytes", font_size=16, color=GREEN).next_to(udp_hdr, RIGHT, buff=0.3)

        self.play(FadeIn(tcp_hdr, tcp_hdr_lbl), run_time=0.5)
        self.play(FadeIn(udp_hdr, udp_hdr_lbl), run_time=0.5)

        overhead = Text("Less overhead = faster for real-time apps", font_size=16, color=GREEN).shift(DOWN * 1.5)
        self.play(Write(overhead))

        proto = Text("Protocols: HTTP(TCP), DNS(UDP), QUIC(UDP)", font_size=14, color=GREY).shift(DOWN * 2.5)
        self.play(Write(proto))
        self.wait(2)
        self.play(FadeOut(*self.mobjects))
