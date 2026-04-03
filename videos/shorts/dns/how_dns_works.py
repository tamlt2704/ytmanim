from manim import *

class HowDNSWorks(Scene):
    def construct(self):

        title = Text("How DNS Works", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

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
        self.wait(2)
        self.play(FadeOut(result))
