from manim import *

class SQLvsNoSQL(Scene):
    def construct(self):
        title = Text("SQL vs NoSQL", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        sql_title = Text("SQL", font_size=28, color=BLUE).shift(LEFT * 3 + UP * 2.5)
        nosql_title = Text("NoSQL", font_size=28, color=GREEN).shift(RIGHT * 3 + UP * 2.5)
        self.play(Write(sql_title), Write(nosql_title))

        # SQL table
        table = VGroup()
        headers = ["id", "name", "age"]
        for i, h in enumerate(headers):
            cell = Rectangle(width=1.5, height=0.5, color=BLUE, fill_opacity=0.3)
            cell.shift(LEFT * (4.5 - i * 1.5) + UP * 1.2)
            txt = Text(h, font_size=14, weight=BOLD).move_to(cell)
            table.add(VGroup(cell, txt))
        for row in range(2):
            for col in range(3):
                cell = Rectangle(width=1.5, height=0.5, color=BLUE, fill_opacity=0.1)
                cell.shift(LEFT * (4.5 - col * 1.5) + UP * (0.7 - row * 0.5))
                table.add(cell)
        self.play(FadeIn(table), run_time=0.5)

        # NoSQL document
        doc_text = '{\n  "name": "User",\n  "age": 25,\n  "hobbies": ["a","b"]\n}'
        doc_box = RoundedRectangle(corner_radius=0.15, width=3.5, height=2, color=GREEN, fill_opacity=0.1)
        doc_box.shift(RIGHT * 3 + UP * 0.5)
        doc = Text(doc_text, font_size=12).move_to(doc_box)
        self.play(FadeIn(doc_box, doc), run_time=0.5)

        self.wait(1)
        sql_note = Text("Structured, ACID", font_size=16, color=BLUE).shift(LEFT * 3 + DOWN * 1.5)
        nosql_note = Text("Flexible, Scalable", font_size=16, color=GREEN).shift(RIGHT * 3 + DOWN * 1.5)
        self.play(Write(sql_note), Write(nosql_note))
        self.wait(2)
