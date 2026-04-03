from manim import *

class Thumbnail(Scene):
    def construct(self):
        self.camera.background_color = "#e44c30"
        title = Text("Git Commands You Didn't Know Existed 🤯", font_size=52, weight=BOLD, color=WHITE)
        title.set_width(12)
        self.add(title)
