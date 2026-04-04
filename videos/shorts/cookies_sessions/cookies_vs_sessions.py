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

        self.wait(1.5)
        self.play(FadeOut(browser, browser_label, server, server_label,
                          cookie_box, cookie_txt, cookie_label,
                          session_box, session_txt, session_label, arrow, sid))

        # Comparison table
        comp_title = Text("Cookies vs Sessions", font_size=28, color=YELLOW).shift(UP * 2.8)
        self.play(Write(comp_title))

        headers = VGroup(
            Text("", font_size=14).shift(LEFT * 3.5),
            Text("Cookies", font_size=16, color=ORANGE, weight=BOLD),
            Text("Sessions", font_size=16, color=PURPLE, weight=BOLD).shift(RIGHT * 3.5),
        ).shift(UP * 2)
        self.play(FadeIn(headers), run_time=0.3)

        rows = [
            ("Storage", "Browser", "Server"),
            ("Size limit", "4 KB", "No limit"),
            ("Security", "Less secure", "More secure"),
            ("Expiry", "Set by server", "Server-controlled"),
            ("Scalability", "Stateless", "Needs shared store"),
        ]
        for i, (label, cookie, session) in enumerate(rows):
            row = VGroup(
                Text(label, font_size=14, weight=BOLD).shift(LEFT * 3.5),
                Text(cookie, font_size=14, color=ORANGE),
                Text(session, font_size=14, color=PURPLE).shift(RIGHT * 3.5),
            ).shift(UP * (1.2 - i * 0.6))
            self.play(FadeIn(row), run_time=0.35)

        self.wait(1.5)
        self.play(FadeOut(comp_title, headers, *self.mobjects))

        # Cookie types
        ct_title = Text("Cookie Types", font_size=28, color=ORANGE).shift(UP * 2.5)
        self.play(Write(ct_title))

        types = [
            ("Session Cookie", "Deleted when browser closes", YELLOW),
            ("Persistent Cookie", "Has expiration date", ORANGE),
            ("Secure Cookie", "HTTPS only", GREEN),
            ("HttpOnly Cookie", "No JavaScript access", BLUE),
            ("SameSite Cookie", "CSRF protection", PURPLE),
        ]
        for i, (name, desc, color) in enumerate(types):
            n = Text(name, font_size=16, color=color, weight=BOLD).shift(LEFT * 2.5 + UP * (1 - i * 0.6))
            d = Text(desc, font_size=14).shift(RIGHT * 2 + UP * (1 - i * 0.6))
            self.play(FadeIn(n, d), run_time=0.35)

        self.wait(2)
        self.play(FadeOut(*self.mobjects))
