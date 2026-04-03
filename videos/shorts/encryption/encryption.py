from manim import *

class Encryption(Scene):
    def construct(self):
        title = Text("Encryption Explained", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        # Symmetric
        sym_label = Text("Symmetric Encryption", font_size=22, color=BLUE).shift(UP * 2.5)
        self.play(Write(sym_label))
        plain1 = Text("Hello", font_size=22, color=GREEN).shift(LEFT * 4 + UP * 1.2)
        key1 = Text("🔑 Same Key", font_size=16, color=YELLOW).shift(UP * 1.2)
        cipher1 = Text("x#k@!", font_size=22, color=RED).shift(RIGHT * 4 + UP * 1.2)
        a1 = Arrow(plain1.get_right(), key1.get_left(), buff=0.2, color=GREEN, stroke_width=2)
        a2 = Arrow(key1.get_right(), cipher1.get_left(), buff=0.2, color=RED, stroke_width=2)
        self.play(FadeIn(plain1), GrowArrow(a1), FadeIn(key1), GrowArrow(a2), FadeIn(cipher1), run_time=0.8)
        sym_ex = Text("AES, DES", font_size=14, color=BLUE).shift(UP * 0.5)
        self.play(Write(sym_ex), run_time=0.3)

        # Asymmetric
        asym_label = Text("Asymmetric Encryption", font_size=22, color=GREEN).shift(DOWN * 0.5)
        self.play(Write(asym_label))
        plain2 = Text("Hello", font_size=22, color=GREEN).shift(LEFT * 4 + DOWN * 1.5)
        pub_key = Text("🔓 Public Key", font_size=14, color=ORANGE).shift(LEFT * 0.5 + DOWN * 1.2)
        priv_key = Text("🔐 Private Key", font_size=14, color=PURPLE).shift(RIGHT * 1 + DOWN * 1.8)
        cipher2 = Text("y&m!@", font_size=22, color=RED).shift(RIGHT * 4 + DOWN * 1.5)
        b1 = Arrow(plain2.get_right(), pub_key.get_left(), buff=0.1, color=GREEN, stroke_width=2)
        b2 = Arrow(pub_key.get_right(), cipher2.get_left(), buff=0.1, color=RED, stroke_width=2)
        self.play(FadeIn(plain2, pub_key, priv_key), GrowArrow(b1), GrowArrow(b2), FadeIn(cipher2), run_time=0.8)
        asym_ex = Text("RSA, ECC", font_size=14, color=GREEN).shift(DOWN * 2.5)
        self.play(Write(asym_ex), run_time=0.3)

        self.wait(2)
