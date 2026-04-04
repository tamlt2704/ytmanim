from manim import *

class Pagination(Scene):
    def construct(self):
        title = Text("API Pagination Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        # Problem
        problem = Text("Returning 1M records at once? 💀", font_size=28, color=RED)
        self.play(Write(problem))
        self.wait(1)
        solution = Text("Pagination: return data in chunks", font_size=22, color=GREEN).shift(DOWN * 1)
        self.play(Write(solution))
        self.wait(1)
        self.play(FadeOut(problem, solution))

        # Visual demo
        all_data = VGroup()
        for i in range(12):
            box = Rectangle(width=0.6, height=0.5, color=GREY, fill_opacity=0.2)
            box.shift(LEFT * 3.3 + RIGHT * (i % 6) * 0.7 + UP * (0.5 - (i // 6) * 0.6))
            txt = Text(str(i + 1), font_size=12).move_to(box)
            all_data.add(VGroup(box, txt))
        all_label = Text("12 records total", font_size=16).shift(UP * 2)
        self.play(FadeIn(all_data, all_label), run_time=0.5)
        self.wait(0.5)

        page_colors = [BLUE, GREEN, ORANGE]
        for page in range(3):
            start = page * 4
            highlight = SurroundingRectangle(
                VGroup(*all_data[start:start + 4]), color=page_colors[page], buff=0.05
            )
            page_label = Text(f"Page {page + 1}: ?page={page + 1}&limit=4", font_size=16, color=page_colors[page]).shift(DOWN * (1.5 + page * 0.6))
            self.play(Create(highlight), Write(page_label), run_time=0.5)
            self.wait(0.3)

        self.wait(1)
        self.play(FadeOut(*self.mobjects))

        # Pagination types
        types_title = Text("Pagination Strategies", font_size=28, color=YELLOW).shift(UP * 2.5)
        self.play(Write(types_title))

        strategies = [
            ("Offset-based", "?page=2&limit=10", "Simple but slow for large offsets", BLUE),
            ("Cursor-based", "?cursor=abc123&limit=10", "Fast, consistent, no skipping", GREEN),
            ("Keyset", "?after_id=100&limit=10", "Uses indexed column, very fast", ORANGE),
        ]
        for i, (name, example, note, color) in enumerate(strategies):
            n = Text(name, font_size=18, color=color, weight=BOLD).shift(LEFT * 1 + UP * (1 - i * 1.2))
            e = Text(example, font_size=14, font="Monospace").shift(LEFT * 1 + UP * (0.5 - i * 1.2))
            nt = Text(note, font_size=12, color=GREY).shift(LEFT * 1 + UP * (0.1 - i * 1.2))
            self.play(FadeIn(n, e, nt), run_time=0.5)

        self.wait(1.5)
        self.play(FadeOut(*self.mobjects))

        # Response format
        resp_title = Text("Response Format", font_size=28, color=TEAL).shift(UP * 2.5)
        self.play(Write(resp_title))

        resp_lines = [
            '{', '  "data": [...],', '  "meta": {',
            '    "total": 100,', '    "page": 2,',
            '    "limit": 10,', '    "next": "/api?page=3"',
            '  }', '}',
        ]
        resp_group = VGroup()
        for i, line in enumerate(resp_lines):
            color = GREEN if "data" in line else YELLOW if "meta" in line or "total" in line or "page" in line or "limit" in line or "next" in line else WHITE
            txt = Text(line, font_size=14, color=color, font="Monospace").shift(UP * (1.5 - i * 0.4) + LEFT * 1)
            resp_group.add(txt)
        self.play(FadeIn(resp_group), run_time=0.6)

        tip = Text("Always include total count & next page link!", font_size=16, color=GREEN).shift(DOWN * 2.5)
        self.play(Write(tip))
        self.wait(2)
        self.play(FadeOut(*self.mobjects))
