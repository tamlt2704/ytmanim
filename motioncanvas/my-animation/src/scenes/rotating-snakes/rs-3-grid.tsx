import {Rect, Circle, makeScene2D} from '@motion-canvas/2d';
import {all, waitFor, createRefArray} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  view.fill('#000000');

  const cols = 8;
  const rows = 14;
  const gap = 60;
  const startX = -((cols - 1) * gap) / 2;
  const startY = -((rows - 1) * gap) / 2 - 100;

  const lines = createRefArray<Rect>();
  const dots = createRefArray<Circle>();

  // Horizontal lines
  for (let r = 0; r < rows; r++) {
    view.add(
      <Rect ref={lines} x={0} y={startY + r * gap} width={(cols - 1) * gap + 20} height={8} radius={2} fill={'#4a4a4a'} opacity={0} />,
    );
  }
  // Vertical lines
  for (let c = 0; c < cols; c++) {
    view.add(
      <Rect ref={lines} x={startX + c * gap} y={startY + ((rows - 1) * gap) / 2} width={8} height={(rows - 1) * gap + 20} radius={2} fill={'#4a4a4a'} opacity={0} />,
    );
  }

  // White dots at intersections
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      view.add(
        <Circle ref={dots} x={startX + c * gap} y={startY + r * gap} size={16} fill={'#ffffff'} opacity={0} />,
      );
    }
  }

  yield* all(...lines.map(l => l.opacity(1, 0.4)));
  yield* all(...dots.map(d => d.opacity(1, 0.3)));
  yield* waitFor(6);
});
