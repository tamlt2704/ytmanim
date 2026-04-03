from manim import *

class CORSExplained(Scene):
    def construct(self):
        title = Text("CORS Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        browser = RoundedRectangle(corner_radius=0.2, width=2.5, height=1.2, color=BLUE).shift(LEFT * 4)
        browser_label = Text("Browser\nsite-a.com", font_size=14).move_to(browser)
        server = RoundedRectangle(corner_radius=0.2, width=2.5, height=1.2, color=GREEN).shift(RIGHT * 4)
        server_label = Text("API\nsite-b.com", font_size=14).move_to(server)
        self.play(FadeIn(browser, browser_label, server, server_label))

        # Blocked request
        req1 = Arrow(browser.get_right(), server.get_left(), buff=0.1, color=RED, stroke_width=3)
        req1_label = Text("GET /data", font_size=14, color=RED).next_to(req1, UP, buff=0.1)
        self.play(GrowArrow(req1), FadeIn(req1_label), run_time=0.5)

        blocked = Text("❌ CORS Error!", font_size=24, color=RED).shift(DOWN * 1.5)
        self.play(Write(blocked), run_time=0.4)
        self.wait(0.5)
        self.play(FadeOut(req1, req1_label, blocked), run_time=0.3)

        # Preflight
        preflight = Arrow(browser.get_right(), server.get_left(), buff=0.1, color=YELLOW, stroke_width=3).shift(UP * 0.3)
        pre_label = Text("OPTIONS (preflight)", font_size=12, color=YELLOW).next_to(preflight, UP, buff=0.05)
        self.play(GrowArrow(preflight), FadeIn(pre_label), run_time=0.5)

        response = Arrow(server.get_left(), browser.get_right(), buff=0.1, color=GREEN, stroke_width=3).shift(DOWN * 0.3)
        res_label = Text("Access-Control-Allow-Origin: *", font_size=12, color=GREEN).next_to(response, DOWN, buff=0.05)
        self.play(GrowArrow(response), FadeIn(res_label), run_time=0.5)

        allowed = Text("✅ Request Allowed", font_size=24, color=GREEN).shift(DOWN * 2)
        self.play(Write(allowed))
        self.wait(2)
