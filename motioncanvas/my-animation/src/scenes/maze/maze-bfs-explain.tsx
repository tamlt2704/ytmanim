import {Rect, Txt, Line, Circle, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack, easeOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(
    <Txt ref={title}
      text={'Breadth-First\nSearch'}
      fill={ACCENT_COLOR} fontFamily={TITLE_FONT}
      fontSize={80} fontWeight={900}
      y={-780} textAlign={'center'} lineHeight={90}
      opacity={0}
    />,
  );
  yield* fadeInUp(title(), 30, 0.4);

  const hook = createRef<Txt>();
  view.add(
    <Txt ref={hook}
      text={'Explores level by level\nlike ripples in water 🌊'}
      fill={TEXT_COLOR} fontFamily={CODE_FONT}
      fontSize={38} fontWeight={700}
      y={-600} textAlign={'center'} lineHeight={52}
      opacity={0}
    />,
  );
  yield* fadeInUp(hook(), 20, 0.3);
  yield* waitFor(1);

  // Visual: concentric rings showing BFS levels
  const ringColors = [GREEN, ACCENT_COLOR, ORANGE, PURPLE, RED];
  const ringCenter = {x: 0, y: -340};
  for (let i = 0; i < 5; i++) {
    const ring = createRef<Circle>();
    view.add(
      <Circle ref={ring}
        x={ringCenter.x} y={ringCenter.y}
        size={(i + 1) * 70}
        fill={null} stroke={ringColors[i]} lineWidth={3}
        opacity={0}
      />,
    );
    yield* ring().opacity(0.5, 0.2);
    yield* waitFor(0.15);
  }
  const levelLabel = createRef<Txt>();
  view.add(<Txt ref={levelLabel} text={'Level 0  →  Level 4'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={24} x={ringCenter.x} y={ringCenter.y + 200} opacity={0} />);
  yield* fadeIn(levelLabel(), 0.2);
  yield* waitFor(0.5);

  // Steps
  const steps = [
    {num: '1', text: 'Start at entrance\nadd to queue', emoji: '📍', color: GREEN},
    {num: '2', text: 'Dequeue front cell\nexplore all neighbors', emoji: '👀', color: ACCENT_COLOR},
    {num: '3', text: 'Add unvisited neighbors\nto back of queue', emoji: '📋', color: ORANGE},
    {num: '4', text: 'Track parent of\neach visited cell', emoji: '🔗', color: PURPLE},
    {num: '5', text: 'Reached the exit?\nTrace parents back!', emoji: '🏁', color: RED},
  ];

  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    const y = -80 + i * 120;

    const card = createRef<Rect>();
    view.add(
      <Rect ref={card}
        width={560} height={95} radius={16}
        fill={s.color + '12'} stroke={s.color} lineWidth={2}
        y={y} opacity={0} scale={0}
      >
        <Txt text={s.emoji} fontSize={36} x={-230} />
        <Txt text={s.num} fill={s.color} fontFamily={TITLE_FONT} fontSize={38} fontWeight={900} x={-170} />
        <Txt text={s.text} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={26} fontWeight={700} x={20} textAlign={'center'} lineHeight={34} />
      </Rect>,
    );
    yield* all(card().opacity(1, 0.2), card().scale(1, 0.3, easeOutBack));

    if (i < steps.length - 1) {
      const arrow = createRef<Line>();
      view.add(<Line ref={arrow} points={[[0, y + 45], [0, y + 60]]} stroke={'#30363d'} lineWidth={2} endArrow arrowSize={8} end={0} />);
      yield* arrow().end(1, 0.1, easeOutCubic);
    }
    yield* waitFor(0.3);
  }

  yield* waitFor(0.5);

  const key = createRef<Txt>();
  view.add(
    <Txt ref={key}
      text={'Queue = FIFO\nFirst In, First Out\n→ guarantees shortest path!'}
      fill={ACCENT_COLOR} fontFamily={TITLE_FONT}
      fontSize={36} fontWeight={800}
      y={570} textAlign={'center'} lineHeight={50}
      opacity={0}
    />,
  );
  yield* fadeInUp(key(), 20, 0.3);
  yield* pulse(key() as any, 1.05, 0.3);

  yield* waitFor(2);
});
