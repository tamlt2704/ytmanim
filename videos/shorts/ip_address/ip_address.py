from manim import *

class IPAddress(Scene):
    def construct(self):
        title = Text("IP Addresses Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        # IPv4
        ipv4_label = Text("IPv4", font_size=28, color=BLUE).shift(UP * 2.5)
        self.play(Write(ipv4_label))
        octets = ["192", "168", "1", "100"]
        octet_group = VGroup()
        for i, octet in enumerate(octets):
            box = RoundedRectangle(corner_radius=0.1, width=1.2, height=0.7, color=BLUE, fill_opacity=0.2)
            box.shift(LEFT * 2 + RIGHT * i * 1.4 + UP * 1.3)
            txt = Text(octet, font_size=22, color=BLUE).move_to(box)
            if i < 3:
                dot = Text(".", font_size=28).shift(LEFT * 2 + RIGHT * (i * 1.4 + 0.7) + UP * 1.3)
                octet_group.add(VGroup(box, txt), dot)
            else:
                octet_group.add(VGroup(box, txt))
        self.play(FadeIn(octet_group), run_time=0.5)
        ipv4_info = Text("4 octets × 8 bits = 32 bits → 4.3 billion addresses", font_size=14, color=BLUE).shift(UP * 0.5)
        self.play(Write(ipv4_info), run_time=0.4)

        # IPv6
        ipv6_label = Text("IPv6", font_size=28, color=GREEN).shift(DOWN * 0.5)
        self.play(Write(ipv6_label))
        ipv6_addr = Text("2001:0db8:85a3:0000:0000:8a2e:0370:7334", font_size=16, color=GREEN).shift(DOWN * 1.3)
        self.play(Write(ipv6_addr), run_time=0.5)
        ipv6_info = Text("128 bits → 340 undecillion addresses", font_size=14, color=GREEN).shift(DOWN * 2)
        self.play(Write(ipv6_info), run_time=0.4)

        self.wait(2)
