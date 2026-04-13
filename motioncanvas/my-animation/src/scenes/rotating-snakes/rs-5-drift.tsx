import {Circle, Rect, makeScene2D} from '@motion-canvas/2d';
import {all, waitFor, createRefArray} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  view.fill('#555555');

  const colors = ['#000000', '#333333', '#ffffff', '#bbbbbb'];
  const tileSize = 160;
  const dotsPerRing = 10;
  const radius = 55;
  const dotSize = 22;

  const tilesX = 4;
  const tilesY = 7;
  const startX = -((tilesX - 1) * tileSize) / 2;
  const startY = -((tilesY - 1) * tileSize) / 2 - 80;

  const allDots = createRefArray<Circle>();

  for (let ty = 0; ty < tilesY; ty++) {
    for (let tx = 0; tx < tilesX; tx++) {
      const cx = startX + tx * tileSize;
      const cy = startY + ty * tileSize;
      // Alternate direction per tile
      const reverse = (tx + ty) % 2 === 0;
      const c = reverse ? [...colors].reverse() : colors;

      for (let i = 0; i < dotsPerRing; i++) {
        const a = (i / dotsPerRing) * Math.PI * 2;
        view.add(
          <Circle ref={allDots}
            x={cx + Math.cos(a) * radius}
            y={cy + Math.sin(a) * radius}
            size={dotSize} fill={c[i % 4]}
            opacity={0}
          />,
        );
      }
      // Center dot
      view.add(<Circle x={cx} y={cy} size={10} fill={'#f85149'} opacity={0} />);
    }
  }

  yield* all(...allDots.map(d => d.opacity(1, 0.5)));
  // Show all center dots
  yield* waitFor(6);
});
