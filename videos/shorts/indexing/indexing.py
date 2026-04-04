from manim import *

class DatabaseIndexing(Scene):
    def construct(self):
        title = Text("Database Indexing Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        # Without index - full scan
        no_idx = Text("Without Index", font_size=22, color=RED).shift(UP * 2.5)
        self.play(Write(no_idx))
        rows = VGroup()
        for i in range(8):
            box = Rectangle(width=0.8, height=0.5, color=GREY, fill_opacity=0.2)
            box.shift(LEFT * 3.5 + RIGHT * i * 0.9 + UP * 1.2)
            rows.add(box)
        self.play(FadeIn(rows), run_time=0.3)

        for box in rows:
            box.set_fill(RED, opacity=0.3)
            self.wait(0.15)
        scan_label = Text("Full table scan: O(n)", font_size=16, color=RED).shift(UP * 0.3)
        self.play(Write(scan_label), run_time=0.3)

        # With index - B-tree
        with_idx = Text("With Index (B-Tree)", font_size=22, color=GREEN).shift(DOWN * 0.5)
        self.play(Write(with_idx))

        root = Dot(DOWN * 1.5, color=GREEN, radius=0.15)
        l = Dot(DOWN * 1.5 + LEFT * 2 + DOWN * 0.8, color=GREEN, radius=0.15)
        r = Dot(DOWN * 1.5 + RIGHT * 2 + DOWN * 0.8, color=GREEN, radius=0.15)
        target = Dot(DOWN * 1.5 + RIGHT * 1 + DOWN * 1.6, color=YELLOW, radius=0.2)
        lines = VGroup(
            Line(root.get_center(), l.get_center(), color=GREEN),
            Line(root.get_center(), r.get_center(), color=GREEN),
            Line(r.get_center(), target.get_center(), color=YELLOW),
        )
        self.play(FadeIn(root, l, r, target, lines), run_time=0.5)

        idx_label = Text("Index lookup: O(log n)", font_size=16, color=GREEN).shift(DOWN * 3.2)
        self.play(Write(idx_label))
        self.wait(1.5)
        self.play(FadeOut(*self.mobjects))

        # When to use indexes
        when_title = Text("When to Index", font_size=28, color=YELLOW).shift(UP * 2.5)
        self.play(Write(when_title))

        good = VGroup(
            Text("✅ Index when:", font_size=18, color=GREEN, weight=BOLD),
            Text("• Columns in WHERE clauses", font_size=16),
            Text("• Columns in JOIN conditions", font_size=16),
            Text("• Columns in ORDER BY", font_size=16),
            Text("• High cardinality columns", font_size=16),
        ).arrange(DOWN, aligned_edge=LEFT).shift(LEFT * 3 + DOWN * 0.2)

        bad = VGroup(
            Text("❌ Avoid when:", font_size=18, color=RED, weight=BOLD),
            Text("• Small tables", font_size=16),
            Text("• Frequently updated columns", font_size=16),
            Text("• Low cardinality (boolean)", font_size=16),
            Text("• Columns rarely queried", font_size=16),
        ).arrange(DOWN, aligned_edge=LEFT).shift(RIGHT * 3 + DOWN * 0.2)

        self.play(FadeIn(good), run_time=0.6)
        self.play(FadeIn(bad), run_time=0.6)
        self.wait(1.5)
        self.play(FadeOut(*self.mobjects))

        # Index types
        types_title = Text("Index Types", font_size=28, color=TEAL).shift(UP * 2.5)
        self.play(Write(types_title))

        idx_types = [
            ("B-Tree", "Default, range queries", GREEN),
            ("Hash", "Exact match only", BLUE),
            ("Composite", "Multiple columns", ORANGE),
            ("Unique", "Enforces uniqueness", YELLOW),
            ("Full-text", "Text search", PURPLE),
        ]
        for i, (name, desc, color) in enumerate(idx_types):
            n = Text(name, font_size=18, color=color, weight=BOLD).shift(LEFT * 2.5 + UP * (1 - i * 0.7))
            d = Text(desc, font_size=14).shift(RIGHT * 2 + UP * (1 - i * 0.7))
            self.play(FadeIn(n, d), run_time=0.35)

        tradeoff = Text("Tradeoff: faster reads, slower writes + more storage", font_size=16, color=YELLOW).shift(DOWN * 2.5)
        self.play(Write(tradeoff))
        self.wait(2)
        self.play(FadeOut(*self.mobjects))
