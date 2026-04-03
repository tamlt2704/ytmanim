from pathlib import Path
from manim import *

MUSIC = str(Path(__file__).resolve().parent.parent.parent / "music.mp3")


class KubernetesExplained(Scene):
    def construct(self):
        self.add_sound(MUSIC)
        title = Text("Kubernetes in 60 Seconds", font_size=48)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        cluster = RoundedRectangle(corner_radius=0.3, width=11, height=5, color=BLUE, fill_opacity=0.05)
        cluster_label = Text("Cluster", font_size=20, color=BLUE).next_to(cluster, UP, buff=0.1)
        self.play(FadeIn(cluster, cluster_label))

        nodes = VGroup()
        for i in range(3):
            node = RoundedRectangle(corner_radius=0.2, width=3, height=3.5, color=GREEN, fill_opacity=0.1)
            node.shift(LEFT * 3.5 + RIGHT * i * 3.5 + DOWN * 0.3)
            node_label = Text(f"Node {i+1}", font_size=14, color=GREEN).next_to(node, UP, buff=0.05)
            pods = VGroup()
            for j in range(2):
                pod = RoundedRectangle(corner_radius=0.1, width=2.2, height=0.7, color=ORANGE, fill_opacity=0.2)
                pod.move_to(node).shift(UP * (0.5 - j * 1))
                pod_label = Text(f"Pod", font_size=12, color=ORANGE).move_to(pod)
                pods.add(VGroup(pod, pod_label))
            nodes.add(VGroup(node, node_label, pods))

        for node in nodes:
            self.play(FadeIn(node), run_time=0.5)

        svc = Text("Service → Load Balance across Pods", font_size=18, color=YELLOW).shift(DOWN * 2.8)
        self.play(Write(svc))
        self.wait(2)
