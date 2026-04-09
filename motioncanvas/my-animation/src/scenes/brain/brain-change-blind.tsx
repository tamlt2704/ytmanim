import {Rect, Txt, Circle, makeScene2D, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {showThumbnail} from '../../thumbnail-intro';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  yield* showThumbnail(view, {number: '#6', topic: 'BRAIN', command: 'Blindness', commandColor: RED, emoji: '🫣', subtitle: 'You MISSED the Obvious!'});

  const instruction = createRef<Txt>();
  const grid = createRef<Node>();
  const shapes = createRefArray<Rect>();
  const flash = createRef<Rect>();
  const questionTxt = createRef<Txt>();
  const reveal = createRef<Txt>();
  const cta = createRef<Txt>();

  view.add(<Txt ref={instruction} text={'Watch carefully...\nSomething changes!'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={48} y={-770} textAlign={'center'} lineHeight={60} opacity={0} />);

  const gridData = [
    {x: -250, y: -450, color: RED},
    {x: -50, y: -450, color: ACCENT_COLOR},
    {x: 150, y: -450, color: GREEN},
    {x: -250, y: -250, color: ORANGE},
    {x: -50, y: -250, color: PURPLE},
    {x: 150, y: -250, color: RED},
    {x: -250, y: -50, color: GREEN},
    {x: -50, y: -50, color: ORANGE},
    {x: 150, y: -50, color: ACCENT_COLOR},
  ];

  view.add(<Node ref={grid} opacity={0} />);
  gridData.forEach(d => {
    grid().add(<Rect ref={shapes} width={150} height={150} x={d.x} y={d.y} radius={12} fill={d.color} />);
  });

  view.add(<Rect ref={flash} width={1200} height={2000} fill={'#ffffff'} opacity={0} />);
  view.add(<Txt ref={questionTxt} text={'Did you spot the change? 👀'} fill={ORANGE} fontFamily={TITLE_FONT} fontSize={48} y={250} opacity={0} />);
  view.add(<Txt ref={reveal} text={'The CENTER square changed color!\n\nThis is Change Blindness —\na brief interruption makes your\nbrain miss obvious changes 🤯'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={30} y={500} textAlign={'center'} lineHeight={48} opacity={0} />);
  view.add(<Txt ref={cta} text={'Follow for more brain tricks! 🔥'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={40} y={800} opacity={0} />);

  yield* instruction().opacity(1, 0.4);
  yield* grid().opacity(1, 0.5);
  yield* waitFor(1.5);

  for (let i = 0; i < 3; i++) {
    yield* flash().opacity(1, 0.05);
    shapes[4].fill(i % 2 === 0 ? ORANGE : PURPLE);
    yield* flash().opacity(0, 0.05);
    yield* waitFor(1);
  }

  yield* waitFor(0.5);
  yield* questionTxt().opacity(1, 0.4);
  yield* waitFor(1.5);

  yield* shapes[4].stroke('#ffffff', 0.3);
  yield* shapes[4].lineWidth(6, 0.3);
  yield* shapes[4].fill(ORANGE, 0.3);
  yield* waitFor(0.3);
  yield* shapes[4].fill(PURPLE, 0.3);
  yield* waitFor(0.3);
  yield* shapes[4].fill(ORANGE, 0.3);

  yield* waitFor(0.5);
  yield* reveal().opacity(1, 0.6);
  yield* waitFor(1.5);
  yield* cta().opacity(1, 0.5);
  yield* waitFor(2);
});
