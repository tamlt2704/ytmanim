import {Rect, makeScene2D} from '@motion-canvas/2d';
import {all, waitFor, createRefArray} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  view.fill('#222222');

  const cols = 12;
  const rows = 24;
  const cellW = 40;
  const cellH = 36;
  const startX = -((cols - 1) * cellW) / 2;
  const startY = -((rows - 1) * cellH) / 2 - 80;

  const cells = createRefArray<Rect>();

  for (let r = 0; r < rows; r++) {
    const offset = (r % 2) * (cellW / 2);
    for (let c = 0; c < cols; c++) {
      const isBlack = (r + c) % 2 === 0;
      view.add(
        <Rect ref={cells}
          x={startX + c * cellW + offset}
          y={startY + r * cellH}
          width={cellW - 3} height={cellH - 3} radius={2}
          fill={isBlack ? '#e6edf3' : '#0d1117'}
          opacity={0}
        />,
      );
    }
  }

  yield* all(...cells.map(c => c.opacity(1, 0.4)));
  yield* waitFor(6);
});
