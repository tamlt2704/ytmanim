from manim import *

class RateLimiting(Scene):
    def construct(self):
        title = Text("Rate Limiting Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        client = RoundedRectangle(corner_radius=0.15, width=2, height=0.8, color=BLUE).shift(LEFT * 4)
        client_label = Text("Client", font_size=16).move_to(client)
        limiter = RoundedRectangle(corner_radius=0.2, width=2.5, height=1, color=YELLOW).shift(ORIGIN)
        limiter_label = Text("Rate\nLimiter", font_size=14, color=YELLOW).move_to(limiter)
        api = RoundedRectangle(corner_radius=0.15, width=2, height=0.8, color=GREEN).shift(RIGHT * 4)
        api_label = Text("API", font_size=16).move_to(api)
        self.play(FadeIn(client, client_label, limiter, limiter_label, api, api_label))

        counter = Text("0/5", font_size=20, color=WHITE).next_to(limiter, UP, buff=0.2)
        self.play(FadeIn(counter))

        for i in range(7):
            a = Arrow(client.get_right(), limiter.get_left(), buff=0.1, color=BLUE, stroke_width=2)
            self.play(GrowArrow(a), run_time=0.2)
            if i < 5:
                new_counter = Text(f"{i+1}/5", font_size=20, color=GREEN).next_to(limiter, UP, buff=0.2)
                b = Arrow(limiter.get_right(), api.get_left(), buff=0.1, color=GREEN, stroke_width=2)
                self.play(FadeOut(counter), FadeIn(new_counter), GrowArrow(b), run_time=0.2)
                counter = new_counter
                self.play(FadeOut(a, b), run_time=0.1)
            else:
                blocked = Text("429", font_size=18, color=RED).next_to(limiter, DOWN, buff=0.1)
                self.play(FadeIn(blocked), run_time=0.2)
                self.play(FadeOut(a, blocked), run_time=0.2)

        result = Text("Prevents abuse & DDoS", font_size=22, color=GREEN).shift(DOWN * 2.5)
        self.play(Write(result))
        self.wait(1)
        self.play(FadeOut(*self.mobjects))

        # Algorithms
        algo_title = Text("Rate Limiting Algorithms", font_size=28, color=YELLOW).shift(UP * 2.5)
        self.play(Write(algo_title))

        algorithms = [
            ("Token Bucket", "Tokens refill at fixed rate, each request costs 1 token", BLUE),
            ("Sliding Window", "Count requests in rolling time window", GREEN),
            ("Fixed Window", "Reset counter every interval", ORANGE),
            ("Leaky Bucket", "Process requests at constant rate", PURPLE),
        ]
        for i, (name, desc, color) in enumerate(algorithms):
            n = Text(name, font_size=18, color=color, weight=BOLD).shift(LEFT * 1 + UP * (1 - i * 0.9))
            d = Text(desc, font_size=12, color=GREY).next_to(n, DOWN, buff=0.05, aligned_edge=LEFT)
            self.play(FadeIn(n, d), run_time=0.4)
        self.wait(1.5)
        self.play(FadeOut(*self.mobjects))

        # HTTP headers
        hdr_title = Text("Rate Limit Headers", font_size=28, color=TEAL).shift(UP * 2.5)
        self.play(Write(hdr_title))

        headers = [
            ("X-RateLimit-Limit: 100", "Max requests per window"),
            ("X-RateLimit-Remaining: 42", "Requests left"),
            ("X-RateLimit-Reset: 1625097600", "When limit resets"),
            ("Retry-After: 30", "Seconds to wait (on 429)"),
        ]
        for i, (header, desc) in enumerate(headers):
            h = Text(header, font_size=14, color=YELLOW, font="Monospace").shift(LEFT * 1 + UP * (1 - i * 0.8))
            d = Text(desc, font_size=12, color=GREY).next_to(h, DOWN, buff=0.05, aligned_edge=LEFT)
            self.play(FadeIn(h, d), run_time=0.4)

        self.wait(2)
        self.play(FadeOut(*self.mobjects))
