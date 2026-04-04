from manim import *

class Subnetting(Scene):
    def construct(self):
        title = Text("Subnetting Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        ip = Text("192.168.1.0/24", font_size=28, color=BLUE).shift(UP * 2.5)
        self.play(Write(ip))

        bits = "11000000.10101000.00000001.00000000"
        net_bits = Text(bits[:24], font_size=14, color=GREEN).shift(UP * 1.5 + LEFT * 0.8)
        host_bits = Text(bits[24:], font_size=14, color=RED).next_to(net_bits, RIGHT, buff=0.05)
        net_label = Text("Network (24 bits)", font_size=12, color=GREEN).next_to(net_bits, DOWN, buff=0.1)
        host_label = Text("Host (8 bits)", font_size=12, color=RED).next_to(host_bits, DOWN, buff=0.1)
        self.play(FadeIn(net_bits, host_bits, net_label, host_label), run_time=0.5)

        subnet_label = Text("Split into /26 subnets:", font_size=20, color=YELLOW).shift(DOWN * 0.3)
        self.play(Write(subnet_label))

        subnets = [
            ("192.168.1.0/26", "0-63", BLUE),
            ("192.168.1.64/26", "64-127", GREEN),
            ("192.168.1.128/26", "128-191", ORANGE),
            ("192.168.1.192/26", "192-255", RED),
        ]
        for i, (subnet, range_txt, color) in enumerate(subnets):
            box = RoundedRectangle(corner_radius=0.1, width=3, height=0.5, color=color, fill_opacity=0.2)
            box.shift(LEFT * 2.5 + RIGHT * (i % 2) * 5 + DOWN * (1.2 + (i // 2) * 0.7))
            txt = Text(f"{subnet} ({range_txt})", font_size=12, color=color).move_to(box)
            self.play(FadeIn(box, txt), run_time=0.3)

        self.wait(1)
        self.play(FadeOut(*self.mobjects))

        # CIDR notation
        cidr_title = Text("CIDR Notation", font_size=28, color=YELLOW).shift(UP * 2.5)
        self.play(Write(cidr_title))

        cidr_examples = [
            ("/8", "255.0.0.0", "16M hosts", "10.0.0.0/8"),
            ("/16", "255.255.0.0", "65K hosts", "172.16.0.0/16"),
            ("/24", "255.255.255.0", "254 hosts", "192.168.1.0/24"),
            ("/32", "255.255.255.255", "1 host", "Single IP"),
        ]
        headers = VGroup(
            Text("CIDR", font_size=14, weight=BOLD).shift(LEFT * 4),
            Text("Subnet Mask", font_size=14, weight=BOLD).shift(LEFT * 1.5),
            Text("Hosts", font_size=14, weight=BOLD).shift(RIGHT * 1.5),
            Text("Example", font_size=14, weight=BOLD).shift(RIGHT * 4),
        ).shift(UP * 1.5)
        self.play(FadeIn(headers), run_time=0.3)

        for i, (cidr, mask, hosts, example) in enumerate(cidr_examples):
            row = VGroup(
                Text(cidr, font_size=14, color=BLUE).shift(LEFT * 4),
                Text(mask, font_size=12, font="Monospace").shift(LEFT * 1.5),
                Text(hosts, font_size=14, color=GREEN).shift(RIGHT * 1.5),
                Text(example, font_size=12).shift(RIGHT * 4),
            ).shift(UP * (0.7 - i * 0.6))
            self.play(FadeIn(row), run_time=0.35)

        self.wait(1.5)
        self.play(FadeOut(*self.mobjects))

        # Why subnet
        why_title = Text("Why Subnet?", font_size=28, color=TEAL).shift(UP * 2.5)
        self.play(Write(why_title))

        reasons = [
            ("Security", "Isolate network segments"),
            ("Performance", "Reduce broadcast traffic"),
            ("Organization", "Separate departments/teams"),
            ("Efficiency", "Better IP address utilization"),
        ]
        for i, (reason, desc) in enumerate(reasons):
            r = Text(f"✅ {reason}", font_size=18, color=GREEN).shift(LEFT * 2 + UP * (1 - i * 0.8))
            d = Text(desc, font_size=14).shift(RIGHT * 2.5 + UP * (1 - i * 0.8))
            self.play(FadeIn(r, d), run_time=0.4)

        self.wait(2)
        self.play(FadeOut(*self.mobjects))
