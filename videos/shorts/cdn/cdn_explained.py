from manim import *

class CDNExplained(Scene):
    def construct(self):
        title = Text("How CDN Works", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        # Without CDN
        no_cdn = Text("Without CDN", font_size=28, color=RED).shift(UP * 2.5)
        self.play(Write(no_cdn))

        origin_solo = RoundedRectangle(corner_radius=0.2, width=2, height=1, color=RED).shift(RIGHT * 3)
        origin_solo_lbl = Text("Origin\n(US)", font_size=14).move_to(origin_solo)
        users_far = VGroup()
        positions = [LEFT * 4 + UP * 1, LEFT * 4, LEFT * 4 + DOWN * 1]
        labels = ["EU User", "Asia User", "AU User"]
        for pos, lbl in zip(positions, labels):
            u = Dot(pos, color=BLUE, radius=0.15)
            l = Text(lbl, font_size=10).next_to(u, LEFT, buff=0.1)
            users_far.add(VGroup(u, l))
        self.play(FadeIn(origin_solo, origin_solo_lbl, users_far))

        for u in users_far:
            a = Arrow(u[0].get_right(), origin_solo.get_left(), buff=0.1, color=RED, stroke_width=2)
            latency = Text("~300ms", font_size=10, color=RED).next_to(a, UP, buff=0.02)
            self.play(GrowArrow(a), FadeIn(latency), run_time=0.3)
        slow = Text("Slow for distant users!", font_size=18, color=RED).shift(DOWN * 2.5)
        self.play(Write(slow))
        self.wait(1)
        self.play(FadeOut(*self.mobjects))

        # With CDN
        with_cdn = Text("With CDN", font_size=28, color=GREEN).shift(UP * 2.8)
        self.play(Write(with_cdn))

        origin = RoundedRectangle(corner_radius=0.2, width=2, height=1, color=RED).shift(UP * 2)
        origin_label = Text("Origin\nServer", font_size=14).move_to(origin)
        self.play(FadeIn(origin, origin_label))

        edge_positions = [LEFT * 4, LEFT * 1.5, RIGHT * 1.5, RIGHT * 4]
        edges = VGroup()
        for pos in edge_positions:
            e = RoundedRectangle(corner_radius=0.15, width=1.5, height=0.8, color=GREEN, fill_opacity=0.2)
            e.shift(pos + DOWN * 0.5)
            label = Text("Edge", font_size=12).move_to(e)
            edges.add(VGroup(e, label))
            line = DashedLine(origin.get_bottom(), e.get_top(), color=GREY, stroke_width=1)
            self.play(FadeIn(e, label), Create(line), run_time=0.3)

        users = VGroup()
        user_positions = [LEFT * 5, LEFT * 2.5, RIGHT * 0.5, RIGHT * 3.5]
        for pos in user_positions:
            u = Dot(pos + DOWN * 2.5, color=BLUE, radius=0.15)
            label = Text("User", font_size=10).next_to(u, DOWN, buff=0.1)
            users.add(VGroup(u, label))
        self.play(FadeIn(users), run_time=0.4)

        for i in range(4):
            arrow = Arrow(users[i][0].get_top(), edges[i][0].get_bottom(), buff=0.1, color=BLUE, stroke_width=2)
            latency = Text("~20ms", font_size=10, color=GREEN).next_to(arrow, RIGHT, buff=0.02)
            self.play(GrowArrow(arrow), FadeIn(latency), run_time=0.3)

        result = Text("Content served from nearest edge!", font_size=22, color=GREEN).shift(DOWN * 3.2)
        self.play(Write(result))
        self.wait(1.5)
        self.play(FadeOut(*self.mobjects))

        # What CDN caches
        cache_title = Text("What CDN Caches", font_size=28, color=YELLOW).shift(UP * 2.5)
        self.play(Write(cache_title))

        items = [
            ("Images & Videos", "🖼️", BLUE),
            ("CSS & JavaScript", "📄", GREEN),
            ("HTML pages", "🌐", ORANGE),
            ("API responses", "📡", PURPLE),
        ]
        for i, (item, icon, color) in enumerate(items):
            txt = Text(f"{icon} {item}", font_size=20, color=color).shift(UP * (1 - i * 0.8))
            self.play(FadeIn(txt), run_time=0.35)

        providers = Text("Providers: CloudFront, Cloudflare, Akamai", font_size=16, color=GREY).shift(DOWN * 2.5)
        self.play(Write(providers))
        self.wait(2)
        self.play(FadeOut(*self.mobjects))
