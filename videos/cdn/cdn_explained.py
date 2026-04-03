from pathlib import Path
from manim import *

MUSIC = str(Path(__file__).resolve().parent.parent.parent / "music.mp3")


class CDNExplained(Scene):
    def construct(self):
        self.add_sound(MUSIC)
        title = Text("How CDN Works", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        origin = RoundedRectangle(corner_radius=0.2, width=2, height=1, color=RED).shift(UP * 2.5)
        origin_label = Text("Origin\nServer", font_size=14).move_to(origin)
        self.play(FadeIn(origin, origin_label))

        edge_positions = [LEFT * 4, LEFT * 1.5, RIGHT * 1.5, RIGHT * 4]
        edges = VGroup()
        for pos in edge_positions:
            e = RoundedRectangle(corner_radius=0.15, width=1.5, height=0.8, color=GREEN, fill_opacity=0.2)
            e.shift(pos + DOWN * 0.5)
            label = Text("Edge", font_size=12).move_to(e)
            edges.add(VGroup(e, label))
            line = DashedLine(origin.get_bottom(), e.get_top(), color=GREY, stroke_width=1)
            self.play(FadeIn(e, label), Create(line), run_time=0.3)

        users = VGroup()
        user_positions = [LEFT * 5, LEFT * 2.5, RIGHT * 0.5, RIGHT * 3.5]
        for pos in user_positions:
            u = Dot(pos + DOWN * 2.5, color=BLUE, radius=0.15)
            label = Text("User", font_size=10).next_to(u, DOWN, buff=0.1)
            users.add(VGroup(u, label))
        self.play(FadeIn(users), run_time=0.4)

        for i in range(4):
            arrow = Arrow(users[i][0].get_top(), edges[i][0].get_bottom(), buff=0.1, color=BLUE, stroke_width=2)
            self.play(GrowArrow(arrow), run_time=0.3)

        result = Text("Content served from nearest edge!", font_size=22, color=GREEN).shift(DOWN * 3.2)
        self.play(Write(result))
        self.wait(2)
