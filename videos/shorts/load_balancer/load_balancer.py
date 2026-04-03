from manim import *

class HowLoadBalancersWork(Scene):
    def construct(self):

        title = Text("How Load Balancers Work", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        # Clients
        clients = VGroup()
        for i in range(3):
            c = RoundedRectangle(corner_radius=0.15, width=1.5, height=0.8, color=BLUE, fill_opacity=0.2)
            c.shift(LEFT * 5 + UP * (1.5 - i * 1.5))
            label = Text(f"Client {i+1}", font_size=12).move_to(c)
            clients.add(VGroup(c, label))

        # Load balancer
        lb = RoundedRectangle(corner_radius=0.2, width=2, height=2.5, color=YELLOW, fill_opacity=0.2)
        lb_label = Text("Load\nBalancer", font_size=16, color=YELLOW).move_to(lb)

        # Servers
        servers = VGroup()
        for i in range(3):
            s = RoundedRectangle(corner_radius=0.15, width=1.5, height=0.8, color=GREEN, fill_opacity=0.2)
            s.shift(RIGHT * 5 + UP * (1.5 - i * 1.5))
            label = Text(f"Server {i+1}", font_size=12).move_to(s)
            servers.add(VGroup(s, label))

        self.play(FadeIn(clients), FadeIn(lb, lb_label), FadeIn(servers))
        self.wait(0.5)

        # Animate traffic distribution (round robin)
        colors = [BLUE, TEAL, PURPLE]
        for i in range(3):
            client = clients[i][0]
            server = servers[i][0]
            a1 = Arrow(client.get_right(), lb.get_left(), buff=0.1, color=colors[i], stroke_width=2)
            a2 = Arrow(lb.get_right(), server.get_left(), buff=0.1, color=colors[i], stroke_width=2)
            self.play(GrowArrow(a1), run_time=0.4)
            self.play(GrowArrow(a2), run_time=0.4)
            self.wait(0.3)
            self.play(FadeOut(a1), FadeOut(a2), run_time=0.2)

        algo = Text("Round Robin / Least Connections / IP Hash", font_size=18, color=YELLOW).shift(DOWN * 2.8)
        self.play(Write(algo))
        self.wait(2)

        all_objs = VGroup(clients, lb, lb_label, servers, algo)
        self.play(FadeOut(all_objs))
