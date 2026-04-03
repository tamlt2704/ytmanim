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
        self.wait(2)
