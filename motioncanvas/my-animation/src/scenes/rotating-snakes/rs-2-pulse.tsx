import {Circle, makeScene2D} from '@motion-canvas/2d';
import {all, waitFor, createRefArray} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  view.fill('#111111');

  const centerY = -200;
  const rings = createRefArray<Circle>();
  const count = 18;

  for (let i = count; i >= 1; i--) {
    view.add(
      <Circle ref={rings} x={0} y={centerY} size={i * 50} fill={'#11111100'} stroke={i % 2 === 0 ? '#ffffff' : '#000000'} lineWidth={14} opacity={0} />,
    );
  }
  // Small colored dot in center
  view.add(<Circle x={0} y={centerY} size={16} fill={'#f85149'} />);

  yield* all(...rings.map(r => r.opacity(1, 0.5)));
  yield* waitFor(6);
});
