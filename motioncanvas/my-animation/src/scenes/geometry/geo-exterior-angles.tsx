import {Rect, Txt, makeScene2D, Line, Circle, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, easeInOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, ORANGE, PURPLE, RED, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeIn, fadeInUp, drawLine, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'Always 360\u00b0'} fill={RED} fontFamily={CODE_FONT} fontSize={100} fontWeight={800} y={-800} opacity={0} />);
  const sub = createRef<Txt>();
  view.add(<Txt ref={sub} text={'Exterior Angles of ANY Polygon'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={36} y={-720} opacity={0} />);

  yield* fadeInUp(title(), 30, 0.3);
  yield* fadeIn(sub(), 0.3);

  // Draw a pentagon
  const n = 5;
  const r = 200;
  const cx = 0, cy = -350;
  const points: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    points.push([cx + Math.cos(angle) * r, cy + Math.sin(angle) * r]);
  }

  const poly = createRef<Line>();
  view.add(<Line ref={poly} points={points} closed stroke={ACCENT_COLOR} lineWidth={5} end={0} opacity={1} />);
  yield* drawLine(poly(), 0.6);
  yield* waitFor(0.2);

  // Show exterior angles as colored arcs at each vertex
  const colors = [RED, ORANGE, GREEN, PURPLE, ACCENT_COLOR];
  const angleLabels = createRefArray<Txt>();
  for (let i = 0; i < n; i++) {
    const [px, py] = points[i];
    const dx = px > cx ? 30 : -30;
    const dy = py > cy ? 30 : -30;
    view.add(
      <Txt ref={angleLabels} text={'72\u00b0'} fill={colors[i]} fontFamily={CODE_FONT} fontSize={32} fontWeight={800}
        x={px + dx} y={py + dy} opacity={0} />
    );
  }

  for (let i = 0; i < n; i++) {
    yield* angleLabels[i].opacity(1, 0.15);
    yield* waitFor(0.1);
  }
  yield* waitFor(0.3);

  // Sum
  const sum = createRef<Txt>();
  view.add(<Txt ref={sum} text={'72\u00b0 \u00d7 5 = 360\u00b0'} fill={GREEN} fontFamily={CODE_FONT} fontSize={60} fontWeight={800} y={-50} opacity={0} />);
  yield* fadeInUp(sum(), 20, 0.4);
  yield* pulse(sum() as any, 1.15, 0.3);

  // Works for any polygon
  const shapes = createRefArray<Txt>();
  const shapeData = [
    {text: '\u25b3 3 \u00d7 120\u00b0', color: ORANGE},
    {text: '\u25a1 4 \u00d7 90\u00b0', color: GREEN},
    {text: '\u2b21 6 \u00d7 60\u00b0', color: PURPLE},
  ];
  for (let i = 0; i < 3; i++) {
    view.add(
      <Txt ref={shapes} text={shapeData[i].text} fill={shapeData[i].color} fontFamily={CODE_FONT} fontSize={36} fontWeight={700}
        x={-250 + i * 250} y={100} opacity={0} />
    );
  }
  for (let i = 0; i < 3; i++) {
    yield* shapes[i].opacity(1, 0.2);
    yield* waitFor(0.1);
  }

  const allEqual = createRef<Txt>();
  view.add(<Txt ref={allEqual} text={'ALL = 360\u00b0'} fill={RED} fontFamily={CODE_FONT} fontSize={52} fontWeight={800} y={200} opacity={0} />);
  yield* fadeInUp(allEqual(), 20, 0.3);

  const fact = createRef<Txt>();
  view.add(<Txt ref={fact} text={'Walk along the edges and turn\nat each corner \u2192 full rotation!'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={30} y={420} textAlign={'center'} lineHeight={48} opacity={0} />);
  yield* fadeIn(fact(), 0.4);

  yield* waitFor(2);
});
