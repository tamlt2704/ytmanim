from manim import *

class DockerVsVM(Scene):
    def construct(self):

        title = Text("Docker vs VM", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        # VM stack
        vm_title = Text("Virtual Machine", font_size=24, color=ORANGE).shift(LEFT * 3 + UP * 3)
        vm_layers = []
        vm_labels = ["Hardware", "Hypervisor", "Guest OS", "Bins/Libs", "App"]
        vm_colors = [GREY, ORANGE, RED, YELLOW, GREEN]
        for i, (label, color) in enumerate(zip(vm_labels, vm_colors)):
            rect = Rectangle(width=3, height=0.6, color=color, fill_opacity=0.3).shift(LEFT * 3 + DOWN * 1.5 + UP * i * 0.7)
            txt = Text(label, font_size=16).move_to(rect)
            vm_layers.append(VGroup(rect, txt))

        # Docker stack
        dk_title = Text("Docker", font_size=24, color=BLUE).shift(RIGHT * 3 + UP * 3)
        dk_layers = []
        dk_labels = ["Hardware", "Host OS", "Docker Engine", "App"]
        dk_colors = [GREY, BLUE, TEAL, GREEN]
        for i, (label, color) in enumerate(zip(dk_labels, dk_colors)):
            rect = Rectangle(width=3, height=0.6, color=color, fill_opacity=0.3).shift(RIGHT * 3 + DOWN * 1.5 + UP * i * 0.7)
            txt = Text(label, font_size=16).move_to(rect)
            dk_layers.append(VGroup(rect, txt))

        self.play(Write(vm_title), Write(dk_title))
        for vm, dk in zip(vm_layers, dk_layers):
            self.play(FadeIn(vm), FadeIn(dk), run_time=0.5)
        # Show remaining VM layers
        for vm in vm_layers[len(dk_layers):]:
            self.play(FadeIn(vm), run_time=0.5)

        self.wait(1)

        heavy = Text("Heavy & Slow", font_size=20, color=RED).next_to(vm_layers[-1], UP, buff=0.3)
        light = Text("Light & Fast", font_size=20, color=GREEN).next_to(dk_layers[-1], UP, buff=0.3)
        self.play(Write(heavy), Write(light))
        self.wait(2)

        all_objs = VGroup(vm_title, dk_title, heavy, light, *vm_layers, *dk_layers)
        self.play(FadeOut(all_objs))
