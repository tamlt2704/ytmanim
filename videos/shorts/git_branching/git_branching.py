from manim import *

class GitBranching(Scene):
    def construct(self):
        title = Text("Git Branching Visualized", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        # Main branch
        main_line = Line(LEFT * 5, RIGHT * 3, color=BLUE, stroke_width=3)
        main_label = Text("main", font_size=16, color=BLUE).next_to(main_line, LEFT, buff=0.1).shift(UP * 0.3)
        main_dots = VGroup(*[Dot(LEFT * 5 + RIGHT * i * 2, color=BLUE, radius=0.12) for i in range(5)])
        self.play(Create(main_line), FadeIn(main_label, main_dots), run_time=0.6)

        # Feature branch
        branch_point = main_dots[2].get_center()
        feat_line = Line(branch_point, branch_point + RIGHT * 3 + UP * 1.5, color=GREEN, stroke_width=3)
        feat_label = Text("feature", font_size=16, color=GREEN).next_to(feat_line, UP, buff=0.1)
        feat_dots = VGroup(*[Dot(branch_point + RIGHT * (i+1) * 1 + UP * (i+1) * 0.5, color=GREEN, radius=0.12) for i in range(3)])
        self.play(Create(feat_line), FadeIn(feat_label, feat_dots), run_time=0.6)
        self.wait(1)

        # Merge
        merge_title = Text("Merge", font_size=24, color=YELLOW).shift(UP * 3)
        self.play(Write(merge_title))
        merge_arrow = Arrow(feat_dots[-1].get_center(), main_dots[4].get_center(), buff=0.1, color=YELLOW, stroke_width=3)
        merge_dot = Dot(main_dots[4].get_center(), color=YELLOW, radius=0.15)
        self.play(GrowArrow(merge_arrow), FadeIn(merge_dot), run_time=0.5)
        merge_note = Text("Creates merge commit", font_size=14, color=YELLOW).shift(DOWN * 1.5)
        self.play(Write(merge_note))
        self.wait(1.5)
        self.play(FadeOut(*self.mobjects))

        # Rebase
        rebase_title = Text("Rebase", font_size=28, color=ORANGE).shift(UP * 2.8)
        self.play(Write(rebase_title))

        main2 = Line(LEFT * 5, RIGHT * 1, color=BLUE, stroke_width=3).shift(DOWN * 0.5)
        m2_dots = VGroup(*[Dot(LEFT * 5 + RIGHT * i * 2 + DOWN * 0.5, color=BLUE, radius=0.12) for i in range(4)])
        m2_lbl = Text("main", font_size=14, color=BLUE).next_to(main2, LEFT, buff=0.1).shift(UP * 0.3)
        self.play(Create(main2), FadeIn(m2_dots, m2_lbl), run_time=0.4)

        # Before rebase
        before_lbl = Text("Before rebase:", font_size=16, color=GREY).shift(LEFT * 3 + UP * 1.5)
        self.play(Write(before_lbl))
        old_feat = VGroup(*[Dot(LEFT * 1 + RIGHT * i * 1.5 + UP * 1, color=GREEN, radius=0.12) for i in range(3)])
        old_line = Line(m2_dots[1].get_center(), old_feat[0].get_center(), color=GREEN, stroke_width=2)
        self.play(FadeIn(old_feat, old_line), run_time=0.4)
        self.wait(0.5)

        # After rebase
        after_lbl = Text("After rebase:", font_size=16, color=ORANGE).shift(RIGHT * 2 + UP * 1.5)
        self.play(Write(after_lbl))
        new_feat = VGroup(*[Dot(RIGHT * 1 + RIGHT * i * 1.5 + DOWN * 0.5, color=ORANGE, radius=0.12) for i in range(3)])
        self.play(FadeIn(new_feat), run_time=0.4)

        rebase_note = Text("Replays commits on top of main — linear history!", font_size=14, color=ORANGE).shift(DOWN * 2)
        self.play(Write(rebase_note))
        self.wait(1.5)
        self.play(FadeOut(*self.mobjects))

        # Merge vs Rebase
        vs_title = Text("Merge vs Rebase", font_size=28, color=TEAL).shift(UP * 2.5)
        self.play(Write(vs_title))

        merge_info = VGroup(
            Text("Merge", font_size=18, color=YELLOW, weight=BOLD),
            Text("• Preserves history", font_size=14),
            Text("• Creates merge commit", font_size=14),
            Text("• Non-destructive", font_size=14),
            Text("• Can be messy", font_size=14),
        ).arrange(DOWN, aligned_edge=LEFT).shift(LEFT * 3 + DOWN * 0.2)

        rebase_info = VGroup(
            Text("Rebase", font_size=18, color=ORANGE, weight=BOLD),
            Text("• Linear history", font_size=14),
            Text("• No merge commits", font_size=14),
            Text("• Rewrites history", font_size=14),
            Text("• Cleaner log", font_size=14),
        ).arrange(DOWN, aligned_edge=LEFT).shift(RIGHT * 3 + DOWN * 0.2)

        self.play(FadeIn(merge_info), run_time=0.5)
        self.play(FadeIn(rebase_info), run_time=0.5)

        rule = Text("Never rebase public/shared branches!", font_size=16, color=RED).shift(DOWN * 2.5)
        self.play(Write(rule))
        self.wait(2)
        self.play(FadeOut(*self.mobjects))
