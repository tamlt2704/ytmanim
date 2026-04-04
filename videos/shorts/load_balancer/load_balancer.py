from manim import *

class HowLoadBalancersWork(Scene):
    def construct(self):
        title = Text("How Load Balancers Work", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        clients = VGroup()
        for i in range(3):
            c = RoundedRectangle(corner_radius=0.15, width=1.5, height=0.8, color=BLUE, fill_opacity=0.2)
            c.shift(LEFT * 5 + UP * (1.5 - i * 1.5))
            label = Text(f"Client {i+1}", font_size=12).move_to(c)
            clients.add(VGroup(c, label))

        lb = RoundedRectangle(corner_radius=0.2, width=2, height=2.5, color=YELLOW, fill_opacity=0.2)
        lb_label = Text("Load\nBalancer", font_size=16, color=YELLOW).move_to(lb)

        servers = VGroup()
        for i in range(3):
            s = RoundedRectangle(corner_radius=0.15, width=1.5, height=0.8, color=GREEN, fill_opacity=0.2)
            s.shift(RIGHT * 5 + UP * (1.5 - i * 1.5))
            label = Text(f"Server {i+1}", font_size=12).move_to(s)
            servers.add(VGroup(s, label))

        self.play(FadeIn(clients), FadeIn(lb, lb_label), FadeIn(servers))
        self.wait(0.5)

        colors = [BLUE, TEAL, PURPLE]
        for i in range(3):
            a1 = Arrow(clients[i][0].get_right(), lb.get_left(), buff=0.1, color=colors[i], stroke_width=2)
            a2 = Arrow(lb.get_right(), servers[i][0].get_left(), buff=0.1, color=colors[i], stroke_width=2)
            self.play(GrowArrow(a1), run_time=0.4)
            self.play(GrowArrow(a2), run_time=0.4)
            self.wait(0.3)
            self.play(FadeOut(a1), FadeOut(a2), run_time=0.2)

        algo = Text("Round Robin / Least Connections / IP Hash", font_size=18, color=YELLOW).shift(DOWN * 2.8)
        self.play(Write(algo))
        self.wait(1)
        self.play(FadeOut(clients, lb, lb_label, servers, algo))

        # Algorithms explained
        algo_title = Text("Load Balancing Algorithms", font_size=28, color=YELLOW).shift(UP * 2.5)
        self.play(Write(algo_title))

        algorithms = [
            ("Round Robin", "Rotate through servers 1→2→3→1", BLUE),
            ("Least Connections", "Send to server with fewest active", GREEN),
            ("IP Hash", "Same client → same server", ORANGE),
            ("Weighted", "More traffic to stronger servers", PURPLE),
            ("Random", "Pick a random server", TEAL),
        ]
        for i, (name, desc, color) in enumerate(algorithms):
            n = Text(name, font_size=16, color=color, weight=BOLD).shift(LEFT * 2.5 + UP * (1 - i * 0.6))
            d = Text(desc, font_size=13).shift(RIGHT * 2 + UP * (1 - i * 0.6))
            self.play(FadeIn(n, d), run_time=0.35)
        self.wait(1.5)
        self.play(FadeOut(*self.mobjects))

        # L4 vs L7
        layer_title = Text("Layer 4 vs Layer 7", font_size=28, color=TEAL).shift(UP * 2.5)
        self.play(Write(layer_title))

        l4 = VGroup(
            Text("Layer 4 (Transport)", font_size=18, color=BLUE, weight=BOLD),
            Text("• TCP/UDP level", font_size=14),
            Text("• Faster, less features", font_size=14),
            Text("• Can't inspect content", font_size=14),
        ).arrange(DOWN, aligned_edge=LEFT).shift(LEFT * 3 + DOWN * 0.2)

        l7 = VGroup(
            Text("Layer 7 (Application)", font_size=18, color=GREEN, weight=BOLD),
            Text("• HTTP/HTTPS level", font_size=14),
            Text("• URL-based routing", font_size=14),
            Text("• SSL termination", font_size=14),
        ).arrange(DOWN, aligned_edge=LEFT).shift(RIGHT * 3 + DOWN * 0.2)

        self.play(FadeIn(l4), run_time=0.5)
        self.play(FadeIn(l7), run_time=0.5)

        providers = Text("AWS ALB/NLB, Nginx, HAProxy", font_size=16, color=GREY).shift(DOWN * 2.5)
        self.play(Write(providers))
        self.wait(2)
        self.play(FadeOut(*self.mobjects))
