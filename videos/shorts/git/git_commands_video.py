from manim import *

class GitCommandsVideo(Scene):
    def construct(self):
        title = Text("Git Commands You Didn't Know", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        # git stash
        stash_title = Text("git stash", font_size=36, color=BLUE).to_edge(UP, buff=0.5)
        working = RoundedRectangle(corner_radius=0.15, width=2.5, height=1.2, color=GREEN, fill_opacity=0.3).shift(LEFT * 3)
        working_label = Text("Working\nDirectory", font_size=16).move_to(working)
        stash_box = RoundedRectangle(corner_radius=0.15, width=2.5, height=1.2, color=YELLOW, fill_opacity=0.3)
        stash_label = Text("Stash\nStack", font_size=16).move_to(stash_box)
        clean = RoundedRectangle(corner_radius=0.15, width=2.5, height=1.2, color=BLUE, fill_opacity=0.3).shift(RIGHT * 3)
        clean_label = Text("Clean\nBranch", font_size=16).move_to(clean)

        self.play(Write(stash_title), FadeIn(working, working_label, stash_box, stash_label, clean, clean_label), run_time=0.6)
        a1 = Arrow(working.get_right(), stash_box.get_left(), buff=0.1, color=YELLOW, stroke_width=3)
        a1_lbl = Text("stash", font_size=14, color=YELLOW).next_to(a1, UP, buff=0.1)
        self.play(GrowArrow(a1), FadeIn(a1_lbl), run_time=0.4)
        a2 = Arrow(stash_box.get_right(), clean.get_left(), buff=0.1, color=BLUE, stroke_width=3)
        a2_lbl = Text("stash pop", font_size=14, color=BLUE).next_to(a2, UP, buff=0.1)
        self.play(GrowArrow(a2), FadeIn(a2_lbl), run_time=0.4)
        self.wait(1)
        self.play(FadeOut(VGroup(stash_title, working, working_label, stash_box, stash_label,
                                 clean, clean_label, a1, a1_lbl, a2, a2_lbl)), run_time=0.4)

        # git bisect
        bisect_title = Text("git bisect", font_size=36, color=GREEN).to_edge(UP, buff=0.5)
        commits = VGroup()
        for i, c in enumerate([GREEN, GREEN, GREEN, GREY, GREY, RED, RED, RED]):
            commits.add(Dot(LEFT * 3.5 + RIGHT * i, radius=0.15, color=c))
        line = Line(commits[0].get_center(), commits[-1].get_center(), color=GREY, stroke_width=2)
        good_lbl = Text("good", font_size=14, color=GREEN).next_to(commits[0], DOWN, buff=0.2)
        bad_lbl = Text("bad", font_size=14, color=RED).next_to(commits[-1], DOWN, buff=0.2)

        self.play(Write(bisect_title), Create(line), FadeIn(commits, good_lbl, bad_lbl), run_time=0.6)
        hl = SurroundingRectangle(commits[3], color=YELLOW, buff=0.15)
        hl_lbl = Text("test here", font_size=14, color=YELLOW).next_to(commits[3], UP, buff=0.2)
        self.play(Create(hl), FadeIn(hl_lbl), run_time=0.4)
        hl2 = SurroundingRectangle(commits[5], color=YELLOW, buff=0.15)
        hl2_lbl = Text("found bug!", font_size=14, color=RED).next_to(commits[5], UP, buff=0.2)
        self.play(ReplacementTransform(hl, hl2), ReplacementTransform(hl_lbl, hl2_lbl), run_time=0.4)
        self.wait(1)
        self.play(FadeOut(VGroup(bisect_title, commits, line, good_lbl, bad_lbl, hl2, hl2_lbl)), run_time=0.4)

        # git reflog
        reflog_title = Text("git reflog", font_size=36, color=ORANGE).to_edge(UP, buff=0.5)
        entries = VGroup(*[
            Text(t, font_size=18, color=ORANGE if i == 2 else WHITE, font="Monospace").shift(DOWN * i * 0.5 + UP * 0.5)
            for i, t in enumerate([
                "HEAD@{0}: commit: fix bug",
                "HEAD@{1}: reset: moving to HEAD~1",
                "HEAD@{2}: commit: add feature",
                "HEAD@{3}: checkout: moving to main",
            ])
        ])

        self.play(Write(reflog_title), run_time=0.4)
        self.play(FadeIn(entries, lag_ratio=0.3), run_time=0.8)
        rescue = SurroundingRectangle(entries[2], color=GREEN, buff=0.1)
        rescue_lbl = Text("← recover this!", font_size=16, color=GREEN).next_to(entries[2], RIGHT, buff=0.3)
        self.play(Create(rescue), FadeIn(rescue_lbl), run_time=0.4)
        self.wait(1)
        self.play(FadeOut(VGroup(reflog_title, entries, rescue, rescue_lbl)), run_time=0.4)

        outro = Text("Now go try them! 🚀", font_size=42, color=YELLOW)
        self.play(Write(outro))
        self.wait(1)
        self.play(FadeOut(outro))
