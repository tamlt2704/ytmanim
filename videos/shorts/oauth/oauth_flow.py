from manim import *

class OAuthFlow(Scene):
    def construct(self):
        title = Text("OAuth 2.0 Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        user = RoundedRectangle(corner_radius=0.2, width=1.8, height=1, color=BLUE).shift(LEFT * 5)
        user_label = Text("User", font_size=18).move_to(user)
        app = RoundedRectangle(corner_radius=0.2, width=1.8, height=1, color=GREEN).shift(LEFT * 1.5)
        app_label = Text("App", font_size=18).move_to(app)
        auth = RoundedRectangle(corner_radius=0.2, width=1.8, height=1, color=ORANGE).shift(RIGHT * 1.5)
        auth_label = Text("Auth\nServer", font_size=14).move_to(auth)
        api = RoundedRectangle(corner_radius=0.2, width=1.8, height=1, color=RED).shift(RIGHT * 5)
        api_label = Text("API", font_size=18).move_to(api)

        nodes = VGroup(user, user_label, app, app_label, auth, auth_label, api, api_label)
        self.play(FadeIn(nodes))

        steps = [
            (user, app, "Login", BLUE),
            (app, auth, "Auth Request", GREEN),
            (auth, user, "Grant?", ORANGE),
            (user, auth, "Approve", BLUE),
            (auth, app, "Auth Code", ORANGE),
            (app, auth, "Exchange Code", GREEN),
            (auth, app, "Access Token", YELLOW),
            (app, api, "API + Token", GREEN),
        ]

        for src, dst, label_text, color in steps:
            start = src.get_right() if src.get_center()[0] < dst.get_center()[0] else src.get_left()
            end = dst.get_left() if src.get_center()[0] < dst.get_center()[0] else dst.get_right()
            arrow = Arrow(start, end, buff=0.1, color=color, stroke_width=2)
            label = Text(label_text, font_size=12, color=color).next_to(arrow, UP, buff=0.05)
            self.play(GrowArrow(arrow), FadeIn(label), run_time=0.5)
            self.wait(0.3)
            self.play(FadeOut(arrow, label), run_time=0.2)

        self.wait(1)
        self.play(FadeOut(nodes))

        # Grant types
        grant_title = Text("OAuth Grant Types", font_size=28, color=YELLOW).shift(UP * 2.5)
        self.play(Write(grant_title))

        grants = [
            ("Authorization Code", "Web apps (most secure)", GREEN),
            ("PKCE", "Mobile/SPA apps", BLUE),
            ("Client Credentials", "Machine-to-machine", ORANGE),
            ("Refresh Token", "Get new access token", YELLOW),
        ]
        for i, (name, desc, color) in enumerate(grants):
            n = Text(name, font_size=18, color=color, weight=BOLD).shift(LEFT * 2 + UP * (1 - i * 0.8))
            d = Text(desc, font_size=14).shift(RIGHT * 2.5 + UP * (1 - i * 0.8))
            self.play(FadeIn(n, d), run_time=0.4)
        self.wait(1.5)
        self.play(FadeOut(*self.mobjects))

        # Token types
        tok_title = Text("Access Token vs Refresh Token", font_size=28, color=TEAL).shift(UP * 2.5)
        self.play(Write(tok_title))

        access = VGroup(
            Text("Access Token", font_size=18, color=GREEN, weight=BOLD),
            Text("• Short-lived (15 min)", font_size=14),
            Text("• Used for API calls", font_size=14),
            Text("• Sent in every request", font_size=14),
        ).arrange(DOWN, aligned_edge=LEFT).shift(LEFT * 3 + DOWN * 0.2)

        refresh = VGroup(
            Text("Refresh Token", font_size=18, color=ORANGE, weight=BOLD),
            Text("• Long-lived (days/weeks)", font_size=14),
            Text("• Used to get new access token", font_size=14),
            Text("• Stored securely", font_size=14),
        ).arrange(DOWN, aligned_edge=LEFT).shift(RIGHT * 3 + DOWN * 0.2)

        self.play(FadeIn(access), run_time=0.5)
        self.play(FadeIn(refresh), run_time=0.5)
        self.wait(2)
        self.play(FadeOut(*self.mobjects))
