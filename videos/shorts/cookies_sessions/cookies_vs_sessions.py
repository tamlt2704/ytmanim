from manim import *

class CookiesVsSessions(Scene):
    def construct(self):
        title = Text("Cookies vs Sessions", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        browser = RoundedRectangle(corner_radius=0.2, width=3, height=2, color=BLUE).shift(LEFT * 3.5)
        browser_label = Text("Browser", font_size=20, color=BLUE).next_to(browser, UP, buff=0.1)
        server = RoundedRectangle(corner_radius=0.2, width=3, height=2, color=GREEN).shift(RIGHT * 3.5)
        server_label = Text("Server", font_size=20, color=GREEN).next_to(server, UP, buff=0.1)
        self.play(FadeIn(browser, browser_label, server, server_label))

        # Cookie
        cookie_box = RoundedRectangle(corner_radius=0.1, width=2, height=0.6, color=ORANGE, fill_opacity=0.3)
        cookie_box.move_to(browser).shift(UP * 0.3)
        cookie_txt = Text("Cookie: data", font_size=12, color=ORANGE).move_to(cookie_box)
        cookie_label = Text("Stored in browser", font_size=12, color=ORANGE).next_to(cookie_box, DOWN, buff=0.1)
        self.play(FadeIn(cookie_box, cookie_txt, cookie_label), run_time=0.5)

        # Session
        session_box = RoundedRectangle(corner_radius=0.1, width=2, height=0.6, color=PURPLE, fill_opacity=0.3)
        session_box.move_to(server).shift(UP * 0.3)
        session_txt = Text("Session: data", font_size=12, color=PURPLE).move_to(session_box)
        session_label = Text("Stored on server", font_size=12, color=PURPLE).next_to(session_box, DOWN, buff=0.1)
        self.play(FadeIn(session_box, session_txt, session_label), run_time=0.5)

        # Session ID in cookie
        arrow = Arrow(browser.get_right(), server.get_left(), buff=0.1, color=YELLOW, stroke_width=2)
        sid = Text("Cookie: session_id=abc123", font_size=12, color=YELLOW).next_to(arrow, UP, buff=0.05)
        self.play(GrowArrow(arrow), FadeIn(sid), run_time=0.5)

        self.wait(2)
