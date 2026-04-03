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
        self.wait(2)
