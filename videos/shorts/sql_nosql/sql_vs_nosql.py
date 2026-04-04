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

        doc_text = '{\n  "name": "User",\n  "age": 25,\n  "hobbies": ["a","b"]\n}'
        doc_box = RoundedRectangle(corner_radius=0.15, width=3.5, height=2, color=GREEN, fill_opacity=0.1)
        doc_box.shift(RIGHT * 3 + UP * 0.5)
        doc = Text(doc_text, font_size=12).move_to(doc_box)
        self.play(FadeIn(doc_box, doc), run_time=0.5)

        self.wait(1)
        sql_note = Text("Structured, ACID", font_size=16, color=BLUE).shift(LEFT * 3 + DOWN * 1.5)
        nosql_note = Text("Flexible, Scalable", font_size=16, color=GREEN).shift(RIGHT * 3 + DOWN * 1.5)
        self.play(Write(sql_note), Write(nosql_note))
        self.wait(1)
        self.play(FadeOut(sql_title, nosql_title, table, doc_box, doc, sql_note, nosql_note))

        # Comparison
        comp_title = Text("Detailed Comparison", font_size=28, color=YELLOW).shift(UP * 2.8)
        self.play(Write(comp_title))

        headers = VGroup(
            Text("", font_size=14).shift(LEFT * 3.5),
            Text("SQL", font_size=16, color=BLUE, weight=BOLD),
            Text("NoSQL", font_size=16, color=GREEN, weight=BOLD).shift(RIGHT * 3.5),
        ).shift(UP * 2)
        self.play(FadeIn(headers), run_time=0.3)

        rows = [
            ("Schema", "Fixed schema", "Schema-less"),
            ("Scaling", "Vertical", "Horizontal"),
            ("Joins", "Powerful JOINs", "No JOINs (denormalize)"),
            ("Transactions", "ACID", "BASE (eventual)"),
            ("Query", "SQL language", "API-specific"),
        ]
        for i, (label, sql, nosql) in enumerate(rows):
            row = VGroup(
                Text(label, font_size=13, weight=BOLD).shift(LEFT * 3.5),
                Text(sql, font_size=13, color=BLUE),
                Text(nosql, font_size=13, color=GREEN).shift(RIGHT * 3.5),
            ).shift(UP * (1.2 - i * 0.6))
            self.play(FadeIn(row), run_time=0.35)
        self.wait(1.5)
        self.play(FadeOut(*self.mobjects))

        # NoSQL types
        types_title = Text("NoSQL Types", font_size=28, color=TEAL).shift(UP * 2.5)
        self.play(Write(types_title))

        nosql_types = [
            ("Document", "MongoDB, CouchDB", "JSON-like documents"),
            ("Key-Value", "Redis, DynamoDB", "Simple key → value"),
            ("Column", "Cassandra, HBase", "Column families"),
            ("Graph", "Neo4j, Neptune", "Nodes & relationships"),
        ]
        for i, (ntype, examples, desc) in enumerate(nosql_types):
            n = Text(ntype, font_size=16, color=GREEN, weight=BOLD).shift(LEFT * 3.5 + UP * (1 - i * 0.7))
            e = Text(examples, font_size=13).shift(LEFT * 0.5 + UP * (1 - i * 0.7))
            d = Text(desc, font_size=12, color=GREY).shift(RIGHT * 3 + UP * (1 - i * 0.7))
            self.play(FadeIn(n, e, d), run_time=0.35)

        self.wait(2)
        self.play(FadeOut(*self.mobjects))
