from pathlib import Path
from manim import *

MUSIC = str(Path(__file__).resolve().parent.parent.parent / "music.mp3")


class RESTvsGraphQL(Scene):
    def construct(self):
        self.add_sound(MUSIC)

        title = Text("REST vs GraphQL", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        # REST side
        rest_title = Text("REST", font_size=28, color=ORANGE).shift(LEFT * 3 + UP * 3)
        rest_endpoints = VGroup()
        endpoints = ["GET /users", "GET /users/1/posts", "GET /posts/1/comments"]
        for i, ep in enumerate(endpoints):
            box = RoundedRectangle(corner_radius=0.15, width=3.5, height=0.6, color=ORANGE, fill_opacity=0.2)
            box.shift(LEFT * 3 + UP * (1.5 - i * 0.9))
            txt = Text(ep, font_size=14).move_to(box)
            rest_endpoints.add(VGroup(box, txt))

        self.play(Write(rest_title))
        for ep in rest_endpoints:
            self.play(FadeIn(ep), run_time=0.4)

        rest_note = Text("3 requests", font_size=18, color=RED).shift(LEFT * 3 + DOWN * 1.5)
        self.play(Write(rest_note), run_time=0.4)

        # GraphQL side
        gql_title = Text("GraphQL", font_size=28, color=PURPLE).shift(RIGHT * 3 + UP * 3)
        query_text = """query {
  user(id: 1) {
    name
    posts {
      title
      comments { text }
    }
  }
}"""
        gql_box = RoundedRectangle(corner_radius=0.15, width=3.8, height=2.8, color=PURPLE, fill_opacity=0.2)
        gql_box.shift(RIGHT * 3 + UP * 0.6)
        gql_code = Text(query_text, font_size=12).move_to(gql_box)

        self.play(Write(gql_title))
        self.play(FadeIn(gql_box, gql_code), run_time=0.6)

        gql_note = Text("1 request", font_size=18, color=GREEN).shift(RIGHT * 3 + DOWN * 1.5)
        self.play(Write(gql_note), run_time=0.4)

        self.wait(1)

        vs = Text("Over-fetching vs Exact data", font_size=22, color=YELLOW).shift(DOWN * 2.5)
        self.play(Write(vs))
        self.wait(2)

        all_objs = VGroup(rest_title, rest_endpoints, rest_note,
                          gql_title, gql_box, gql_code, gql_note, vs)
        self.play(FadeOut(all_objs))
