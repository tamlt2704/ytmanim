from pathlib import Path
from manim import *

MUSIC = str(Path(__file__).resolve().parent.parent.parent / "music.mp3")


class Caching(Scene):
    def construct(self):
        self.add_sound(MUSIC)
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
        self.wait(2)
