from manim import *

class Sharding(Scene):
    def construct(self):
        title = Text("Database Sharding Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        single = RoundedRectangle(corner_radius=0.2, width=3, height=2, color=RED, fill_opacity=0.2).shift(UP * 1.5)
        single_label = Text("Single DB\n(all data)", font_size=16, color=RED).move_to(single)
        self.play(FadeIn(single, single_label))
        self.wait(0.5)

        arrow = Arrow(UP * 0.2, DOWN * 0.5, color=YELLOW, stroke_width=3)
        shard_text = Text("Shard by user_id", font_size=18, color=YELLOW).next_to(arrow, RIGHT, buff=0.2)
        self.play(GrowArrow(arrow), Write(shard_text), run_time=0.5)

        shards = VGroup()
        shard_data = [("Shard 1", "Users A-H", BLUE), ("Shard 2", "Users I-P", GREEN), ("Shard 3", "Users Q-Z", ORANGE)]
        for i, (name, data, color) in enumerate(shard_data):
            box = RoundedRectangle(corner_radius=0.15, width=2.5, height=1.2, color=color, fill_opacity=0.2)
            box.shift(LEFT * 3.5 + RIGHT * i * 3.5 + DOWN * 2)
            n = Text(name, font_size=14, color=color, weight=BOLD).move_to(box).shift(UP * 0.2)
            d = Text(data, font_size=12).move_to(box).shift(DOWN * 0.2)
            shards.add(VGroup(box, n, d))

        self.play(FadeOut(single, single_label), FadeIn(shards), run_time=0.6)

        result = Text("Horizontal scaling ✓", font_size=22, color=GREEN).shift(DOWN * 3.3)
        self.play(Write(result))
        self.wait(1)
        self.play(FadeOut(arrow, shard_text, shards, result))

        # Sharding strategies
        strat_title = Text("Sharding Strategies", font_size=28, color=YELLOW).shift(UP * 2.5)
        self.play(Write(strat_title))

        strategies = [
            ("Hash-based", "hash(key) % num_shards", "Even distribution", BLUE),
            ("Range-based", "A-H → Shard 1, I-P → Shard 2", "Easy range queries", GREEN),
            ("Geographic", "US → Shard 1, EU → Shard 2", "Low latency", ORANGE),
            ("Directory-based", "Lookup table maps key → shard", "Flexible", PURPLE),
        ]
        for i, (name, example, benefit, color) in enumerate(strategies):
            n = Text(name, font_size=16, color=color, weight=BOLD).shift(LEFT * 3 + UP * (1 - i * 0.9))
            e = Text(example, font_size=12, font="Monospace").shift(RIGHT * 0.5 + UP * (1.1 - i * 0.9))
            b = Text(benefit, font_size=11, color=GREY).shift(RIGHT * 0.5 + UP * (0.7 - i * 0.9))
            self.play(FadeIn(n, e, b), run_time=0.4)
        self.wait(1.5)
        self.play(FadeOut(*self.mobjects))

        # Challenges
        chal_title = Text("Sharding Challenges", font_size=28, color=RED).shift(UP * 2.5)
        self.play(Write(chal_title))

        challenges = [
            ("Cross-shard queries", "JOINs across shards are expensive"),
            ("Rebalancing", "Adding shards requires data migration"),
            ("Hotspots", "Uneven data distribution"),
            ("Complexity", "Application must know shard routing"),
        ]
        for i, (name, desc) in enumerate(challenges):
            n = Text(f"⚠️ {name}", font_size=16, color=RED).shift(LEFT * 1.5 + UP * (1 - i * 0.8))
            d = Text(desc, font_size=13, color=GREY).next_to(n, DOWN, buff=0.05, aligned_edge=LEFT)
            self.play(FadeIn(n, d), run_time=0.4)

        tip = Text("Start without sharding. Shard only when needed!", font_size=16, color=GREEN).shift(DOWN * 2.5)
        self.play(Write(tip))
        self.wait(2)
        self.play(FadeOut(*self.mobjects))
