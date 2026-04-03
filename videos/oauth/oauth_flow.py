from pathlib import Path
from manim import *

MUSIC = str(Path(__file__).resolve().parent.parent.parent / "music.mp3")


class OAuthFlow(Scene):
    def construct(self):
        self.add_sound(MUSIC)
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

        self.wait(2)
