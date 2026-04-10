import {Rect, Txt, Line, Circle, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack, easeOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(
    <Txt ref={title}
      text={'What Makes\na Good Maze?'}
      fill={TEXT_COLOR} fontFamily={TITLE_FONT}
      fontSize={76} fontWeight={900}
      y={-780} textAlign={'center'} lineHeight={90}
      opacity={0}
    />,
  );
  yield* fadeInUp(title(), 30, 0.4);

  // Definition
  const def = createRef<Txt>();
  view.add(
    <Txt ref={def}
      text={'A perfect maze has exactly\none path between any\ntwo points — no loops,\nno isolated areas'}
      fill={ACCENT_COLOR} fontFamily={CODE_FONT}
      fontSize={38} fontWeight={700}
      y={-540} textAlign={'center'} lineHeight={54}
      opacity={0}
    />,
  );
  yield* fadeInUp(def(), 20, 0.4);
  yield* waitFor(1.5);

  // Two phases
  const phases = [
    {
      emoji: '🏗️',
      name: 'Phase 1: Generate',
      desc: 'Build the maze walls\nand passages from scratch',
      algo: 'Recursive Backtracking (DFS)',
      color: GREEN,
    },
    {
      emoji: '🔍',
      name: 'Phase 2: Solve',
      desc: 'Find the shortest path\nfrom start to end',
      algo: 'Breadth-First Search (BFS)',
      color: ACCENT_COLOR,
    },
  ];

  for (let i = 0; i < phases.length; i++) {
    const p = phases[i];
    const card = createRef<Rect>();
    view.add(
      <Rect ref={card}
        width={580} height={240} radius={20}
        fill={p.color + '10'} stroke={p.color} lineWidth={3}
        y={-200 + i * 290}
        opacity={0} scale={0}
      >
        <Txt text={p.emoji} fontSize={56} x={-230} y={-40} />
        <Txt text={p.name} fill={p.color} fontFamily={TITLE_FONT} fontSize={40} fontWeight={900} y={-70} x={20} />
        <Txt text={p.desc} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={30} fontWeight={700} y={10} x={20} textAlign={'center'} lineHeight={40} />
        <Txt text={p.algo} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={24} y={80} x={20} />
      </Rect>,
    );
    yield* all(card().opacity(1, 0.2), card().scale(1, 0.3, easeOutBack));

    if (i === 0) {
      const arrow = createRef<Line>();
      view.add(<Line ref={arrow} points={[[0, -75], [0, -25]]} stroke={'#30363d'} lineWidth={3} endArrow arrowSize={10} end={0} />);
      yield* arrow().end(1, 0.2, easeOutCubic);
    }
    yield* waitFor(1);
  }

  // Properties
  const props = [
    {emoji: '🌳', text: 'Spanning tree of a grid graph', color: GREEN},
    {emoji: '🔀', text: 'Randomness creates unique mazes', color: ORANGE},
    {emoji: '📏', text: 'Every cell reachable from every other', color: PURPLE},
  ];

  for (let i = 0; i < props.length; i++) {
    const p = props[i];
    const row = createRef<Rect>();
    view.add(
      <Rect ref={row}
        width={540} height={70} radius={14}
        fill={p.color + '10'} stroke={p.color} lineWidth={2}
        y={340 + i * 90}
        opacity={0} scale={0}
      >
        <Txt text={p.emoji} fontSize={32} x={-220} />
        <Txt text={p.text} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={26} fontWeight={700} x={30} />
      </Rect>,
    );
    yield* all(row().opacity(1, 0.15), row().scale(1, 0.25, easeOutBack));
    yield* waitFor(0.3);
  }

  yield* waitFor(2);
});
