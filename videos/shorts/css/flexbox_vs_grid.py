from manim import *

class FlexboxVsGrid(Scene):
    def construct(self):

        title = Text("CSS Flexbox vs Grid", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        # Flexbox - 1D layout
        flex_title = Text("Flexbox (1D)", font_size=24, color=BLUE).shift(LEFT * 3 + UP * 2.5)
        flex_items = VGroup()
        widths = [1.2, 0.8, 1.5, 1.0]
        x_offset = -4.5
        for w in widths:
            rect = Rectangle(width=w, height=0.8, color=BLUE, fill_opacity=0.3).shift(LEFT * 3)
            rect.move_to([x_offset + w / 2, 1.2, 0])
            x_offset += w + 0.15
            flex_items.add(rect)

        self.play(Write(flex_title))
        self.play(*[FadeIn(item) for item in flex_items], run_time=0.6)

        arrow_flex = Arrow(LEFT * 4.5 + UP * 0.3, LEFT * 0.5 + UP * 0.3, color=BLUE, stroke_width=2)
        flex_dir = Text("→ row direction", font_size=14, color=BLUE).next_to(arrow_flex, DOWN, buff=0.1)
        self.play(GrowArrow(arrow_flex), FadeIn(flex_dir), run_time=0.5)
        self.wait(0.5)

        # Grid - 2D layout
        grid_title = Text("Grid (2D)", font_size=24, color=GREEN).shift(RIGHT * 3 + UP * 2.5)
        grid_items = VGroup()
        for row in range(2):
            for col in range(3):
                rect = Rectangle(width=1.2, height=0.8, color=GREEN, fill_opacity=0.3)
                rect.move_to([2 + col * 1.35, 1.2 - row * 0.95, 0])
                grid_items.add(rect)

        self.play(Write(grid_title))
        self.play(*[FadeIn(item) for item in grid_items], run_time=0.6)

        arrow_h = Arrow(RIGHT * 1.5 + DOWN * 0.8, RIGHT * 5.5 + DOWN * 0.8, color=GREEN, stroke_width=2)
        arrow_v = Arrow(RIGHT * 5.8 + UP * 1.8, RIGHT * 5.8 + DOWN * 0.3, color=GREEN, stroke_width=2)
        grid_dir = Text("rows + columns", font_size=14, color=GREEN).next_to(arrow_h, DOWN, buff=0.1)
        self.play(GrowArrow(arrow_h), GrowArrow(arrow_v), FadeIn(grid_dir), run_time=0.5)

        self.wait(1)

        use_flex = Text("Use Flexbox: navbars, toolbars", font_size=18, color=BLUE).shift(DOWN * 2)
        use_grid = Text("Use Grid: page layouts, dashboards", font_size=18, color=GREEN).shift(DOWN * 2.6)
        self.play(Write(use_flex), run_time=0.5)
        self.play(Write(use_grid), run_time=0.5)
        self.wait(2)

        all_objs = VGroup(flex_title, flex_items, arrow_flex, flex_dir,
                          grid_title, grid_items, arrow_h, arrow_v, grid_dir,
                          use_flex, use_grid)
        self.play(FadeOut(all_objs))
