from manim import *

class GitBranching(Scene):
    def construct(self):

        title = Text("How Git Branching Works", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        def commit_dot(pos, color=BLUE):
            return Dot(pos, radius=0.15, color=color)

        # Main branch
        main_label = Text("main", font_size=18, color=BLUE).shift(LEFT * 5.5 + UP * 1)
        c1 = commit_dot(LEFT * 4)
        c2 = commit_dot(LEFT * 2)
        c3 = commit_dot(ORIGIN)
        main_line = VGroup(
            Line(c1.get_center(), c2.get_center(), color=BLUE),
            Line(c2.get_center(), c3.get_center(), color=BLUE),
        )

        self.play(Write(main_label))
        self.play(FadeIn(c1), run_time=0.3)
        self.play(Create(main_line[0]), FadeIn(c2), run_time=0.4)
        self.play(Create(main_line[1]), FadeIn(c3), run_time=0.4)
        self.wait(0.5)

        # Feature branch
        feat_label = Text("feature", font_size=18, color=GREEN).shift(LEFT * 1 + DOWN * 2.2)
        f1 = commit_dot(LEFT * 1 + DOWN * 1.2, GREEN)
        f2 = commit_dot(RIGHT * 1 + DOWN * 1.2, GREEN)
        branch_line = Line(c2.get_center(), f1.get_center(), color=GREEN)
        feat_line = Line(f1.get_center(), f2.get_center(), color=GREEN)

        self.play(Write(feat_label), Create(branch_line), FadeIn(f1), run_time=0.5)
        self.play(Create(feat_line), FadeIn(f2), run_time=0.4)
        self.wait(0.5)

        # Merge
        c4 = commit_dot(RIGHT * 2.5, YELLOW)
        merge_from_main = Line(c3.get_center(), c4.get_center(), color=BLUE)
        merge_from_feat = Line(f2.get_center(), c4.get_center(), color=GREEN)
        merge_label = Text("merge", font_size=16, color=YELLOW).next_to(c4, UP, buff=0.2)

        self.play(Create(merge_from_main), Create(merge_from_feat), FadeIn(c4), Write(merge_label), run_time=0.8)
        self.wait(1)

        # Continue main
        c5 = commit_dot(RIGHT * 4.5, BLUE)
        cont_line = Line(c4.get_center(), c5.get_center(), color=BLUE)
        self.play(Create(cont_line), FadeIn(c5), run_time=0.4)
        self.wait(2)

        all_objs = VGroup(main_label, c1, c2, c3, main_line, feat_label, f1, f2,
                          branch_line, feat_line, c4, merge_from_main, merge_from_feat,
                          merge_label, c5, cont_line)
        self.play(FadeOut(all_objs))
