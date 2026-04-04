from manim import *

class ProxyVsReverse(Scene):
    def construct(self):
        title = Text("Proxy vs Reverse Proxy", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        # Forward proxy
        fwd_label = Text("Forward Proxy", font_size=22, color=BLUE).shift(UP * 2.8)
        self.play(Write(fwd_label))
        client = RoundedRectangle(corner_radius=0.15, width=1.5, height=0.7, color=BLUE).shift(LEFT * 4 + UP * 1.5)
        cl = Text("Client", font_size=14).move_to(client)
        proxy = RoundedRectangle(corner_radius=0.15, width=1.5, height=0.7, color=YELLOW).shift(ORIGIN + UP * 1.5)
        pl = Text("Proxy", font_size=14, color=YELLOW).move_to(proxy)
        server = RoundedRectangle(corner_radius=0.15, width=1.5, height=0.7, color=GREEN).shift(RIGHT * 4 + UP * 1.5)
        sl = Text("Server", font_size=14).move_to(server)
        a1 = Arrow(client.get_right(), proxy.get_left(), buff=0.1, color=BLUE, stroke_width=2)
        a2 = Arrow(proxy.get_right(), server.get_left(), buff=0.1, color=YELLOW, stroke_width=2)
        self.play(FadeIn(client, cl, proxy, pl, server, sl), GrowArrow(a1), GrowArrow(a2), run_time=0.6)
        fwd_note = Text("Hides client identity", font_size=14, color=BLUE).shift(UP * 0.6)
        self.play(Write(fwd_note), run_time=0.3)

        # Reverse proxy
        rev_label = Text("Reverse Proxy", font_size=22, color=GREEN).shift(DOWN * 0.3)
        self.play(Write(rev_label))
        client2 = RoundedRectangle(corner_radius=0.15, width=1.5, height=0.7, color=BLUE).shift(LEFT * 4 + DOWN * 1.5)
        cl2 = Text("Client", font_size=14).move_to(client2)
        rproxy = RoundedRectangle(corner_radius=0.15, width=1.5, height=0.7, color=ORANGE).shift(ORIGIN + DOWN * 1.5)
        rpl = Text("Reverse\nProxy", font_size=12, color=ORANGE).move_to(rproxy)
        servers = VGroup()
        for i in range(2):
            s = RoundedRectangle(corner_radius=0.1, width=1.3, height=0.6, color=GREEN).shift(RIGHT * 4 + DOWN * (1.2 - i * 0.7) + DOWN * 0.3)
            st = Text(f"S{i+1}", font_size=12).move_to(s)
            servers.add(VGroup(s, st))
        b1 = Arrow(client2.get_right(), rproxy.get_left(), buff=0.1, color=BLUE, stroke_width=2)
        b2 = Arrow(rproxy.get_right(), servers[0][0].get_left(), buff=0.1, color=ORANGE, stroke_width=2)
        b3 = Arrow(rproxy.get_right(), servers[1][0].get_left(), buff=0.1, color=ORANGE, stroke_width=2)
        self.play(FadeIn(client2, cl2, rproxy, rpl, servers), GrowArrow(b1), GrowArrow(b2), GrowArrow(b3), run_time=0.6)
        rev_note = Text("Hides server identity", font_size=14, color=GREEN).shift(DOWN * 2.8)
        self.play(Write(rev_note))
        self.wait(1.5)
        self.play(FadeOut(*self.mobjects))

        # Forward proxy use cases
        fwd_title = Text("Forward Proxy Uses", font_size=28, color=BLUE).shift(UP * 2.5)
        self.play(Write(fwd_title))
        fwd_uses = [
            ("Privacy", "Hide your IP address"),
            ("Access control", "Block certain websites"),
            ("Caching", "Cache frequently accessed content"),
            ("Bypass restrictions", "Access geo-blocked content"),
        ]
        for i, (use, desc) in enumerate(fwd_uses):
            u = Text(f"• {use}", font_size=18, color=BLUE).shift(LEFT * 2 + UP * (1 - i * 0.7))
            d = Text(desc, font_size=14, color=GREY).shift(RIGHT * 2.5 + UP * (1 - i * 0.7))
            self.play(FadeIn(u, d), run_time=0.35)
        self.wait(1)
        self.play(FadeOut(*self.mobjects))

        # Reverse proxy use cases
        rev_title = Text("Reverse Proxy Uses", font_size=28, color=GREEN).shift(UP * 2.5)
        self.play(Write(rev_title))
        rev_uses = [
            ("Load balancing", "Distribute traffic across servers"),
            ("SSL termination", "Handle HTTPS at proxy level"),
            ("Caching", "Cache responses for speed"),
            ("Security", "Hide backend infrastructure"),
            ("Compression", "Compress responses"),
        ]
        for i, (use, desc) in enumerate(rev_uses):
            u = Text(f"• {use}", font_size=18, color=GREEN).shift(LEFT * 2 + UP * (1 - i * 0.6))
            d = Text(desc, font_size=14, color=GREY).shift(RIGHT * 2.5 + UP * (1 - i * 0.6))
            self.play(FadeIn(u, d), run_time=0.35)

        tools = Text("Tools: Nginx, HAProxy, Traefik, Envoy", font_size=16, color=YELLOW).shift(DOWN * 2.5)
        self.play(Write(tools))
        self.wait(2)
        self.play(FadeOut(*self.mobjects))
