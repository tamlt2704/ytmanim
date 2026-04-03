from pathlib import Path
from manim import *

MUSIC = str(Path(__file__).resolve().parent.parent.parent / "music.mp3")


class GitCommandsVideo(Scene):
    def construct(self):
        self.add_sound(MUSIC)
        title = Text("Git Commands You Didn't Know", font_size=48)
        self.play(Write(title))
        self.wait(2)
        self.play(FadeOut(title))
