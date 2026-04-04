from manim import *

class RESTvsGraphQL(Scene):
    def construct(self):
        title = Text("REST vs GraphQL", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

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
        self.wait(1)
        self.play(FadeOut(*self.mobjects))

        # Comparison
        comp_title = Text("Detailed Comparison", font_size=28, color=YELLOW).shift(UP * 2.8)
        self.play(Write(comp_title))

        headers = VGroup(
            Text("", font_size=14).shift(LEFT * 3.5),
            Text("REST", font_size=16, color=ORANGE, weight=BOLD),
            Text("GraphQL", font_size=16, color=PURPLE, weight=BOLD).shift(RIGHT * 3.5),
        ).shift(UP * 2)
        self.play(FadeIn(headers), run_time=0.3)

        rows = [
            ("Endpoints", "Multiple", "Single /graphql"),
            ("Data fetching", "Over/under-fetch", "Exact data"),
            ("Caching", "HTTP caching easy", "More complex"),
            ("Learning curve", "Simple", "Steeper"),
            ("File upload", "Native support", "Needs workaround"),
        ]
        for i, (label, rest, gql) in enumerate(rows):
            row = VGroup(
                Text(label, font_size=13, weight=BOLD).shift(LEFT * 3.5),
                Text(rest, font_size=13, color=ORANGE),
                Text(gql, font_size=13, color=PURPLE).shift(RIGHT * 3.5),
            ).shift(UP * (1.2 - i * 0.6))
            self.play(FadeIn(row), run_time=0.35)

        self.wait(1.5)
        self.play(FadeOut(*self.mobjects))

        # When to use
        when_title = Text("When to Use", font_size=28, color=TEAL).shift(UP * 2.5)
        self.play(Write(when_title))

        rest_when = VGroup(
            Text("REST when:", font_size=18, color=ORANGE, weight=BOLD),
            Text("• Simple CRUD operations", font_size=14),
            Text("• Caching is important", font_size=14),
            Text("• File uploads/downloads", font_size=14),
        ).arrange(DOWN, aligned_edge=LEFT).shift(LEFT * 3 + DOWN * 0.2)

        gql_when = VGroup(
            Text("GraphQL when:", font_size=18, color=PURPLE, weight=BOLD),
            Text("• Complex nested data", font_size=14),
            Text("• Mobile apps (bandwidth)", font_size=14),
            Text("• Multiple data sources", font_size=14),
        ).arrange(DOWN, aligned_edge=LEFT).shift(RIGHT * 3 + DOWN * 0.2)

        self.play(FadeIn(rest_when), run_time=0.5)
        self.play(FadeIn(gql_when), run_time=0.5)
        self.wait(2)
        self.play(FadeOut(*self.mobjects))
