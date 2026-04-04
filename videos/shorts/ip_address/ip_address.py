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

        self.wait(1)
        self.play(FadeOut(ipv4_label, octet_group, ipv4_info, ipv6_label, ipv6_addr, ipv6_info))

        # Public vs Private
        pp_title = Text("Public vs Private IPs", font_size=28, color=YELLOW).shift(UP * 2.5)
        self.play(Write(pp_title))

        private = VGroup(
            Text("Private (LAN):", font_size=18, color=ORANGE, weight=BOLD),
            Text("10.0.0.0/8", font_size=16, font="Monospace"),
            Text("172.16.0.0/12", font_size=16, font="Monospace"),
            Text("192.168.0.0/16", font_size=16, font="Monospace"),
        ).arrange(DOWN, aligned_edge=LEFT).shift(LEFT * 3 + UP * 0.5)

        public = VGroup(
            Text("Public (Internet):", font_size=18, color=GREEN, weight=BOLD),
            Text("Assigned by ISP", font_size=16),
            Text("Globally unique", font_size=16),
            Text("Routable on internet", font_size=16),
        ).arrange(DOWN, aligned_edge=LEFT).shift(RIGHT * 3 + UP * 0.5)

        self.play(FadeIn(private), run_time=0.5)
        self.play(FadeIn(public), run_time=0.5)

        nat = Text("NAT translates private ↔ public", font_size=16, color=YELLOW).shift(DOWN * 2)
        self.play(Write(nat))
        self.wait(1.5)
        self.play(FadeOut(*self.mobjects))

        # Special addresses
        special_title = Text("Special IP Addresses", font_size=28, color=TEAL).shift(UP * 2.5)
        self.play(Write(special_title))

        specials = [
            ("127.0.0.1", "Localhost (loopback)", BLUE),
            ("0.0.0.0", "All interfaces", GREEN),
            ("255.255.255.255", "Broadcast", ORANGE),
            ("8.8.8.8", "Google DNS", YELLOW),
            ("169.254.x.x", "Link-local (DHCP fail)", RED),
        ]
        for i, (ip, desc, color) in enumerate(specials):
            addr = Text(ip, font_size=16, color=color, font="Monospace").shift(LEFT * 2.5 + UP * (1 - i * 0.6))
            d = Text(desc, font_size=14).shift(RIGHT * 2 + UP * (1 - i * 0.6))
            self.play(FadeIn(addr, d), run_time=0.35)

        self.wait(2)
        self.play(FadeOut(*self.mobjects))
