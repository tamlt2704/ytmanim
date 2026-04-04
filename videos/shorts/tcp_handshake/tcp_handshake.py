from manim import *

class TCPHandshake(Scene):
    def construct(self):
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
            self.wait(0.5)

        connected = Text("✅ Connection Established!", font_size=28, color=GREEN).shift(DOWN * 3)
        self.play(Write(connected))
        self.wait(1)
        self.play(FadeOut(*self.mobjects))

        # What's in each packet
        pkt_title = Text("What's in Each Packet?", font_size=28, color=YELLOW).shift(UP * 2.5)
        self.play(Write(pkt_title))

        packets = [
            ("SYN", "seq=100", "Client picks random sequence number", BLUE),
            ("SYN-ACK", "seq=300, ack=101", "Server picks seq, acknowledges client", GREEN),
            ("ACK", "ack=301", "Client acknowledges server", YELLOW),
        ]
        for i, (flag, data, desc, color) in enumerate(packets):
            f = Text(flag, font_size=18, color=color, weight=BOLD).shift(LEFT * 4 + UP * (1 - i * 1))
            d = Text(data, font_size=14, font="Monospace").shift(LEFT * 0.5 + UP * (1 - i * 1))
            ds = Text(desc, font_size=12, color=GREY).shift(LEFT * 0.5 + UP * (0.6 - i * 1))
            self.play(FadeIn(f, d, ds), run_time=0.5)
        self.wait(1.5)
        self.play(FadeOut(*self.mobjects))

        # Connection teardown
        tear_title = Text("4-Way Teardown", font_size=28, color=RED).shift(UP * 2.5)
        self.play(Write(tear_title))

        cl = RoundedRectangle(corner_radius=0.15, width=2, height=0.8, color=BLUE).shift(LEFT * 3.5)
        cl_lbl = Text("Client", font_size=14).move_to(cl)
        sv = RoundedRectangle(corner_radius=0.15, width=2, height=0.8, color=GREEN).shift(RIGHT * 3.5)
        sv_lbl = Text("Server", font_size=14).move_to(sv)
        self.play(FadeIn(cl, cl_lbl, sv, sv_lbl))

        teardown = [
            ("FIN", cl, sv, RED),
            ("ACK", sv, cl, GREEN),
            ("FIN", sv, cl, RED),
            ("ACK", cl, sv, YELLOW),
        ]
        for i, (flag, src, dst, color) in enumerate(teardown):
            start = src.get_right() if src == cl else src.get_left()
            end = dst.get_left() if dst == sv else dst.get_right()
            a = Arrow(start + DOWN * (i * 0.5), end + DOWN * (i * 0.5), buff=0.1, color=color, stroke_width=2)
            l = Text(flag, font_size=14, color=color).next_to(a, UP, buff=0.02)
            self.play(GrowArrow(a), FadeIn(l), run_time=0.4)

        closed = Text("Connection Closed", font_size=18, color=RED).shift(DOWN * 3)
        self.play(Write(closed))
        self.wait(2)
        self.play(FadeOut(*self.mobjects))
