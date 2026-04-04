from manim import *

class CICDPipeline(Scene):
    def construct(self):
        title = Text("CI/CD Pipeline Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        stages = [
            ("Code", BLUE),
            ("Build", GREEN),
            ("Test", YELLOW),
            ("Deploy", ORANGE),
            ("Monitor", PURPLE),
        ]

        boxes = VGroup()
        arrows = VGroup()
        for i, (name, color) in enumerate(stages):
            box = RoundedRectangle(corner_radius=0.15, width=1.8, height=0.9, color=color, fill_opacity=0.3)
            box.shift(LEFT * 4 + RIGHT * i * 2.2)
            txt = Text(name, font_size=16, color=color).move_to(box)
            group = VGroup(box, txt)
            boxes.add(group)
            self.play(FadeIn(group), run_time=0.4)
            if i > 0:
                arrow = Arrow(boxes[i - 1][0].get_right(), box.get_left(), buff=0.1, color=WHITE, stroke_width=2)
                arrows.add(arrow)
                self.play(GrowArrow(arrow), run_time=0.3)

        ci_brace = Brace(VGroup(boxes[0], boxes[1], boxes[2]), DOWN, color=BLUE)
        ci_label = Text("Continuous Integration", font_size=16, color=BLUE).next_to(ci_brace, DOWN, buff=0.1)
        cd_brace = Brace(VGroup(boxes[3], boxes[4]), DOWN, color=ORANGE)
        cd_label = Text("Continuous Delivery", font_size=16, color=ORANGE).next_to(cd_brace, DOWN, buff=0.1)

        self.play(Create(ci_brace), Write(ci_label), Create(cd_brace), Write(cd_label), run_time=0.6)
        self.wait(1.5)
        self.play(FadeOut(boxes, arrows, ci_brace, ci_label, cd_brace, cd_label))

        # Each stage detail
        details = [
            ("Code", "Developer pushes to Git", BLUE, ["git push", "Pull request", "Code review"]),
            ("Build", "Compile & package", GREEN, ["Docker build", "npm install", "Compile"]),
            ("Test", "Automated testing", YELLOW, ["Unit tests", "Integration tests", "E2E tests"]),
            ("Deploy", "Ship to production", ORANGE, ["Staging → Prod", "Blue/Green", "Canary"]),
            ("Monitor", "Watch for issues", PURPLE, ["Logs", "Metrics", "Alerts"]),
        ]

        for name, desc, color, items in details:
            header = Text(name, font_size=32, color=color, weight=BOLD).shift(UP * 2)
            subtitle = Text(desc, font_size=18).shift(UP * 1)
            self.play(Write(header), FadeIn(subtitle), run_time=0.4)

            item_group = VGroup()
            for i, item in enumerate(items):
                txt = Text(f"• {item}", font_size=16).shift(UP * (-0.2 + -i * 0.5))
                item_group.add(txt)
            self.play(FadeIn(item_group), run_time=0.4)
            self.wait(0.8)
            self.play(FadeOut(header, subtitle, item_group), run_time=0.3)

        # Tools
        tools_title = Text("Popular CI/CD Tools", font_size=28, color=TEAL).shift(UP * 2)
        self.play(Write(tools_title))
        tools = ["GitHub Actions", "Jenkins", "GitLab CI", "CircleCI", "AWS CodePipeline"]
        for i, tool in enumerate(tools):
            t = Text(f"• {tool}", font_size=18, color=TEAL).shift(UP * (0.8 - i * 0.6))
            self.play(FadeIn(t), run_time=0.3)
        self.wait(2)
        self.play(FadeOut(*self.mobjects))
