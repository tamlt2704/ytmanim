from manim import *

class Caching(Scene):
    def construct(self):
        title = Text("How Caching Works", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        client = RoundedRectangle(corner_radius=0.2, width=2, height=1, color=BLUE).shift(LEFT * 5)
        client_label = Text("Client", font_size=18).move_to(client)
        cache = RoundedRectangle(corner_radius=0.2, width=2, height=1, color=YELLOW).shift(ORIGIN)
        cache_label = Text("Cache", font_size=18).move_to(cache)
        db = RoundedRectangle(corner_radius=0.2, width=2, height=1, color=RED).shift(RIGHT * 5)
        db_label = Text("Database", font_size=18).move_to(db)
        self.play(FadeIn(client, client_label, cache, cache_label, db, db_label))

        # Cache miss
        miss_label = Text("Cache Miss", font_size=20, color=RED).shift(UP * 2.5)
        self.play(Write(miss_label))
        a1 = Arrow(client.get_right(), cache.get_left(), buff=0.1, color=BLUE, stroke_width=2)
        self.play(GrowArrow(a1), run_time=0.4)
        miss = Text("✗", font_size=28, color=RED).next_to(cache, UP, buff=0.2)
        self.play(FadeIn(miss), run_time=0.3)
        a2 = Arrow(cache.get_right(), db.get_left(), buff=0.1, color=YELLOW, stroke_width=2)
        a3 = Arrow(db.get_left(), cache.get_right(), buff=0.1, color=RED, stroke_width=2).shift(DOWN * 0.2)
        a4 = Arrow(cache.get_left(), client.get_right(), buff=0.1, color=YELLOW, stroke_width=2).shift(DOWN * 0.2)
        self.play(GrowArrow(a2), run_time=0.3)
        self.play(GrowArrow(a3), run_time=0.3)
        self.play(GrowArrow(a4), run_time=0.3)
        self.play(FadeOut(a1, a2, a3, a4, miss, miss_label), run_time=0.3)

        # Cache hit
        hit_label = Text("Cache Hit", font_size=20, color=GREEN).shift(UP * 2.5)
        self.play(Write(hit_label))
        b1 = Arrow(client.get_right(), cache.get_left(), buff=0.1, color=BLUE, stroke_width=2)
        self.play(GrowArrow(b1), run_time=0.4)
        hit = Text("✓", font_size=28, color=GREEN).next_to(cache, UP, buff=0.2)
        self.play(FadeIn(hit), run_time=0.3)
        b2 = Arrow(cache.get_left(), client.get_right(), buff=0.1, color=GREEN, stroke_width=2).shift(DOWN * 0.2)
        self.play(GrowArrow(b2), run_time=0.3)

        fast = Text("⚡ Much faster!", font_size=24, color=GREEN).shift(DOWN * 2)
        self.play(Write(fast))
        self.wait(1)
        self.play(FadeOut(client, client_label, cache, cache_label, db, db_label,
                          hit_label, b1, b2, hit, fast))

        # Caching strategies
        strat_title = Text("Caching Strategies", font_size=28, color=YELLOW).shift(UP * 2.5)
        self.play(Write(strat_title))

        strategies = [
            ("Cache-Aside", "App checks cache first, loads from DB on miss", BLUE),
            ("Write-Through", "Write to cache AND DB simultaneously", GREEN),
            ("Write-Behind", "Write to cache, async write to DB", ORANGE),
            ("Read-Through", "Cache loads from DB automatically", PURPLE),
        ]
        for i, (name, desc, color) in enumerate(strategies):
            n = Text(name, font_size=16, color=color, weight=BOLD).shift(LEFT * 1 + UP * (1 - i * 0.9))
            d = Text(desc, font_size=12, color=GREY).next_to(n, DOWN, buff=0.05, aligned_edge=LEFT)
            self.play(FadeIn(n, d), run_time=0.4)
        self.wait(1.5)
        self.play(FadeOut(*self.mobjects))

        # Eviction policies
        evict_title = Text("Cache Eviction Policies", font_size=28, color=TEAL).shift(UP * 2.5)
        self.play(Write(evict_title))

        policies = [
            ("LRU", "Least Recently Used", "Remove oldest accessed item", GREEN),
            ("LFU", "Least Frequently Used", "Remove least accessed item", BLUE),
            ("FIFO", "First In First Out", "Remove oldest item", ORANGE),
            ("TTL", "Time To Live", "Expire after set time", YELLOW),
        ]
        for i, (abbr, full, desc, color) in enumerate(policies):
            a = Text(abbr, font_size=18, color=color, weight=BOLD).shift(LEFT * 4 + UP * (1 - i * 0.7))
            f = Text(full, font_size=14).shift(LEFT * 1 + UP * (1 - i * 0.7))
            d = Text(desc, font_size=12, color=GREY).shift(RIGHT * 3 + UP * (1 - i * 0.7))
            self.play(FadeIn(a, f, d), run_time=0.35)

        tools = Text("Tools: Redis, Memcached, CDN, Browser Cache", font_size=14, color=GREY).shift(DOWN * 2.5)
        self.play(Write(tools))
        self.wait(2)
        self.play(FadeOut(*self.mobjects))
