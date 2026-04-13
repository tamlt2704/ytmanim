import {Circle, makeScene2D} from '@motion-canvas/2d';
import {all, waitFor, createRefArray} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  view.fill('#111111');

  const colors = ['#000000', '#1a3a5c', '#ffffff', '#d4aa00'];
  const colorsRev = ['#d4aa00', '#ffffff', '#1a3a5c', '#000000'];
  const centerY = -200;
  const rings = [
    {r: 80, n: 14, c: colors},
    {r: 145, n: 22, c: colorsRev},
    {r: 210, n: 30, c: colors},
    {r: 275, n: 38, c: colorsRev},
    {r: 340, n: 46, c: colors},
    {r: 405, n: 54, c: colorsRev},
  ];

  const dots = createRefArray<Circle>();
  for (const ring of rings) {
    for (let i = 0; i < ring.n; i++) {
      const a = (i / ring.n) * Math.PI * 2;
      view.add(
        <Circle ref={dots} x={Math.cos(a) * ring.r} y={centerY + Math.sin(a) * ring.r} size={30} fill={ring.c[i % 4]} opacity={0} />,
      );
    }
  }
  view.add(<Circle x={0} y={centerY} size={14} fill={'#f85149'} />);

  yield* all(...dots.map(d => d.opacity(1, 0.4)));
  yield* waitFor(6);
});
