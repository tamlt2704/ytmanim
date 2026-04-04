from manim import *

class OSIModel(Scene):
    def construct(self):
        title = Text("OSI Model in 60 Seconds", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        layers = [
            ("7", "Application", "HTTP, FTP, SMTP", RED),
            ("6", "Presentation", "SSL/TLS, JPEG, JSON", ORANGE),
            ("5", "Session", "Sockets, RPC", YELLOW),
            ("4", "Transport", "TCP, UDP", GREEN),
            ("3", "Network", "IP, ICMP, Routers", TEAL),
            ("2", "Data Link", "Ethernet, MAC, Switches", BLUE),
            ("1", "Physical", "Cables, Signals, Hubs", PURPLE),
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
        self.wait(1.5)
        self.play(FadeOut(boxes, mnemonic))

        # Data flow through layers
        flow_title = Text("How Data Flows", font_size=28, color=YELLOW).shift(UP * 2.8)
        self.play(Write(flow_title))

        sender = Text("Sender", font_size=18, color=BLUE).shift(LEFT * 4 + UP * 2)
        receiver = Text("Receiver", font_size=18, color=GREEN).shift(RIGHT * 4 + UP * 2)
        self.play(FadeIn(sender, receiver))

        encap_layers = ["Data", "+Segment", "+Packet", "+Frame", "Bits"]
        colors = [RED, GREEN, TEAL, BLUE, PURPLE]
        for i, (layer, color) in enumerate(zip(encap_layers, colors)):
            box = RoundedRectangle(corner_radius=0.1, width=2 + i * 0.5, height=0.5, color=color, fill_opacity=0.2)
            box.shift(LEFT * 4 + UP * (1 - i * 0.7))
            lbl = Text(layer, font_size=12, color=color).move_to(box)
            self.play(FadeIn(box, lbl), run_time=0.3)

        encap_note = Text("Encapsulation ↓", font_size=14, color=YELLOW).shift(LEFT * 1 + DOWN * 0.5)
        decap_note = Text("↑ Decapsulation", font_size=14, color=YELLOW).shift(RIGHT * 1 + DOWN * 0.5)
        self.play(FadeIn(encap_note, decap_note), run_time=0.4)

        for i, (layer, color) in enumerate(zip(reversed(encap_layers), reversed(colors))):
            box = RoundedRectangle(corner_radius=0.1, width=2 + (4-i) * 0.5, height=0.5, color=color, fill_opacity=0.2)
            box.shift(RIGHT * 4 + UP * (1 - (4-i) * 0.7))
            lbl = Text(layer, font_size=12, color=color).move_to(box)
            self.play(FadeIn(box, lbl), run_time=0.3)

        self.wait(1.5)
        self.play(FadeOut(*self.mobjects))

        # OSI vs TCP/IP
        vs_title = Text("OSI vs TCP/IP Model", font_size=28, color=TEAL).shift(UP * 2.5)
        self.play(Write(vs_title))

        osi_layers = ["Application (5-7)", "Transport (4)", "Internet (3)", "Network Access (1-2)"]
        osi_colors = [RED, GREEN, TEAL, BLUE]
        for i, (layer, color) in enumerate(zip(osi_layers, osi_colors)):
            box = Rectangle(width=5, height=0.6, color=color, fill_opacity=0.2)
            box.shift(UP * (1.2 - i * 0.8))
            lbl = Text(layer, font_size=16, color=color).move_to(box)
            self.play(FadeIn(box, lbl), run_time=0.35)

        note = Text("TCP/IP: 4 layers (practical) vs OSI: 7 layers (theoretical)", font_size=14, color=YELLOW).shift(DOWN * 2.5)
        self.play(Write(note))
        self.wait(2)
        self.play(FadeOut(*self.mobjects))
