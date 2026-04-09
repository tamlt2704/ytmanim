import {Circle, Node} from '@motion-canvas/2d';
import {createRef, all, easeOutCubic} from '@motion-canvas/core';
import type {View2D} from '@motion-canvas/2d';

export interface DotGridRefs {
  dots: Circle[];
  container: Node;
}

export function addDotGrid(
  view: View2D,
  x = 0,
  y = -200,
  dotSize = 28,
  gap = 38,
  defaultColor = '#21262d',
): DotGridRefs {
  const container = new Node({x, y});
  view.add(container);
  const dots: Circle[] = [];
  const cols = 10;
  const startX = -((cols - 1) * gap) / 2;
  const startY = -((cols - 1) * gap) / 2;

  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      const dot = new Circle({
        x: startX + c * gap,
        y: startY + r * gap,
        size: dotSize,
        fill: defaultColor,
        opacity: 0,
      });
      container.add(dot);
      dots.push(dot);
    }
  }
  return {dots, container};
}

export function* showGrid(refs: DotGridRefs, duration = 0.4) {
  yield* all(...refs.dots.map(d => d.opacity(1, duration)));
}

export function* colorDots(
  refs: DotGridRefs,
  segments: {count: number; color: string}[],
  duration = 0.08,
) {
  let idx = 0;
  for (const seg of segments) {
    for (let i = 0; i < seg.count && idx < 100; i++, idx++) {
      refs.dots[idx].fill(seg.color);
      yield* refs.dots[idx].opacity(1, duration, easeOutCubic);
    }
  }
}
