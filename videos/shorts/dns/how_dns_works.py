from manim import *

class HowDNSWorks(Scene):
    def construct(self):

        title = Text("How DNS Works", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        # What is DNS
        dns_q = Text("What happens when you type a URL?", font_size=28, color=YELLOW)
        self.play(Write(dns_q))
        self.wait(1.5)
        self.play(FadeOut(dns_q))

        browser = RoundedRectangle(corner_radius=0.2, width=2, height=1, color=BLUE).shift(LEFT * 5)
        browser_label = Text("Browser", font_size=20).move_to(browser)
        resolver = RoundedRectangle(corner_radius=0.2, width=2, height=1, color=GREEN).shift(LEFT * 1.5)
        resolver_label = Text("Resolver", font_size=20).move_to(resolver)
        root = RoundedRectangle(corner_radius=0.2, width=2, height=1, color=ORANGE).shift(RIGHT * 1.5)
        root_label = Text("Root", font_size=20).move_to(root)
        auth = RoundedRectangle(corner_radius=0.2, width=2, height=1, color=RED).shift(RIGHT * 5)
        auth_label = Text("Auth NS", font_size=20).move_to(auth)

        nodes = VGroup(browser, browser_label, resolver, resolver_label, root, root_label, auth, auth_label)
        self.play(FadeIn(nodes))
        self.wait(0.5)

        steps = [
            (browser, resolver, "example.com?", BLUE),
            (resolver, root, "Where is .com?", GREEN),
            (root, resolver, ".com NS", ORANGE),
            (resolver, auth, "example.com?", GREEN),
            (auth, resolver, "93.184.216.34", RED),
            (resolver, browser, "93.184.216.34", GREEN),
        ]

        for src, dst, label_text, color in steps:
            arrow = Arrow(src.get_right(), dst.get_left(), buff=0.1, color=color, stroke_width=3)
            label = Text(label_text, font_size=14, color=color).next_to(arrow, UP, buff=0.1)
            self.play(GrowArrow(arrow), FadeIn(label), run_time=0.6)
            self.wait(0.4)
            self.play(FadeOut(arrow), FadeOut(label), run_time=0.3)

        result = Text("IP Address Resolved!", font_size=36, color=GREEN)
        self.play(FadeOut(nodes), Write(result))
        self.wait(1.5)
        self.play(FadeOut(result))

        # DNS Caching
        cache_title = Text("DNS Caching", font_size=36, color=YELLOW)
        self.play(Write(cache_title))
        self.wait(0.5)
        self.play(cache_title.animate.shift(UP * 2.5).scale(0.7))

        cache_layers = [
            ("Browser Cache", BLUE, "~1 min TTL"),
            ("OS Cache", GREEN, "~5 min TTL"),
            ("ISP Resolver", ORANGE, "~1 hour TTL"),
        ]
        cache_boxes = VGroup()
        for i, (name, color, ttl) in enumerate(cache_layers):
            box = RoundedRectangle(corner_radius=0.15, width=5, height=0.8, color=color, fill_opacity=0.2)
            box.shift(UP * (1 - i * 1))
            n = Text(name, font_size=18, color=color).move_to(box).shift(LEFT * 1)
            t = Text(ttl, font_size=14, color=GREY).move_to(box).shift(RIGHT * 1.5)
            cache_boxes.add(VGroup(box, n, t))
            self.play(FadeIn(cache_boxes[-1]), run_time=0.4)

        cache_note = Text("Cached = no lookup needed!", font_size=18, color=GREEN).shift(DOWN * 2)
        self.play(Write(cache_note))
        self.wait(1.5)
        self.play(FadeOut(cache_title, cache_boxes, cache_note))

        # DNS Record Types
        rec_title = Text("DNS Record Types", font_size=32, color=TEAL).shift(UP * 2.5)
        self.play(Write(rec_title))
        records = [
            ("A", "Domain → IPv4", BLUE),
            ("AAAA", "Domain → IPv6", GREEN),
            ("CNAME", "Alias → Domain", ORANGE),
            ("MX", "Mail server", RED),
            ("TXT", "Verification", PURPLE),
        ]
        rec_group = VGroup()
        for i, (rtype, desc, color) in enumerate(records):
            r = Text(rtype, font_size=18, color=color, weight=BOLD).shift(LEFT * 2 + UP * (1.2 - i * 0.7))
            d = Text(desc, font_size=16).shift(RIGHT * 1 + UP * (1.2 - i * 0.7))
            rec_group.add(VGroup(r, d))
            self.play(FadeIn(rec_group[-1]), run_time=0.35)

        self.wait(2)
        self.play(FadeOut(rec_title, rec_group))
