import {Rect, Txt, Line, Circle, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack, easeOutCubic, easeInOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(
    <Txt ref={title}
      text={'Recursive\nBacktracking'}
      fill={GREEN} fontFamily={TITLE_FONT}
      fontSize={80} fontWeight={900}
      y={-780} textAlign={'center'} lineHeight={90}
      opacity={0}
    />,
  );
  yield* fadeInUp(title(), 30, 0.4);

  const hook = createRef<Txt>();
  view.add(
    <Txt ref={hook}
      text={'A depth-first search\nthat carves passages'}
      fill={TEXT_COLOR} fontFamily={CODE_FONT}
      fontSize={38} fontWeight={700}
      y={-600} textAlign={'center'} lineHeight={52}
      opacity={0}
    />,
  );
  yield* fadeInUp(hook(), 20, 0.3);
  yield* waitFor(1);

  // Step-by-step cards
  const steps = [
    {num: '1', text: 'Start with a grid\nof all walls', emoji: '🧱', color: RED},
    {num: '2', text: 'Pick a starting cell\nmark it as passage', emoji: '📍', color: GREEN},
    {num: '3', text: 'Look at unvisited\nneighbors (2 cells away)', emoji: '👀', color: ACCENT_COLOR},
    {num: '4', text: 'Pick one randomly\ncarve wall between', emoji: '🔨', color: ORANGE},
    {num: '5', text: 'Push to stack\nrepeat from new cell', emoji: '📚', color: PURPLE},
    {num: '6', text: 'No neighbors?\nPop stack (backtrack!)', emoji: '↩️', color: RED},
  ];

  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    const y = -460 + i * 130;

    const card = createRef<Rect>();
    view.add(
      <Rect ref={card}
        width={560} height={105} radius={16}
        fill={s.color + '12'} stroke={s.color} lineWidth={2}
        y={y} opacity={0} scale={0}
      >
        <Txt text={s.emoji} fontSize={40} x={-230} />
        <Txt text={s.num} fill={s.color} fontFamily={TITLE_FONT} fontSize={40} fontWeight={900} x={-170} />
        <Txt text={s.text} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={28} fontWeight={700} x={20} textAlign={'center'} lineHeight={36} />
      </Rect>,
    );
    yield* all(card().opacity(1, 0.2), card().scale(1, 0.3, easeOutBack));

    if (i < steps.length - 1) {
      const arrow = createRef<Line>();
      view.add(<Line ref={arrow} points={[[0, y + 50], [0, y + 70]]} stroke={'#30363d'} lineWidth={2} endArrow arrowSize={8} end={0} />);
      yield* arrow().end(1, 0.1, easeOutCubic);
    }
    yield* waitFor(0.4);
  }

  yield* waitFor(0.5);

  const key = createRef<Txt>();
  view.add(
    <Txt ref={key}
      text={'The "2 cells away" trick\ncreates walls between passages!'}
      fill={GREEN} fontFamily={TITLE_FONT}
      fontSize={38} fontWeight={800}
      y={380} textAlign={'center'} lineHeight={54}
      opacity={0}
    />,
  );
  yield* fadeInUp(key(), 20, 0.3);
  yield* pulse(key() as any, 1.05, 0.3);

  const note = createRef<Txt>();
  view.add(
    <Txt ref={note}
      text={'Creates long, winding corridors\nwith lots of dead ends'}
      fill={'#8b949e'} fontFamily={CODE_FONT}
      fontSize={28} y={490} textAlign={'center'} lineHeight={40}
      opacity={0}
    />,
  );
  yield* fadeIn(note(), 0.3);

  yield* waitFor(2);
});
