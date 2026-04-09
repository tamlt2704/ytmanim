import {Rect, Txt, Line, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack, easeOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'#9 Teach It'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={72} fontWeight={800} y={-800} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.3);

  // Feynman steps
  const steps = [
    {num: '1', text: 'Learn the concept', emoji: '📚', color: ACCENT_COLOR},
    {num: '2', text: 'Explain to a 5-year-old', emoji: '👶', color: ORANGE},
    {num: '3', text: 'Find your gaps', emoji: '🕳️', color: RED},
    {num: '4', text: 'Simplify & repeat', emoji: '✨', color: GREEN},
  ];

  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    const box = createRef<Rect>();
    view.add(
      <Rect ref={box} width={440} height={90} radius={18} fill={s.color + '18'} stroke={s.color} lineWidth={3} y={-530 + i * 130} opacity={0} scale={0}>
        <Txt text={s.emoji} fontSize={40} x={-180} />
        <Txt text={`${s.num}. ${s.text}`} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={26} fontWeight={700} x={30} />
      </Rect>,
    );
    yield* all(box().opacity(1, 0.15), box().scale(1, 0.25, easeOutBack));
    yield* waitFor(0.15);
  }

  // Arrow between steps
  for (let i = 0; i < 3; i++) {
    const arrow = createRef<Line>();
    view.add(<Line ref={arrow} points={[[0, -475 + i * 130], [0, -455 + i * 130]]} stroke={'#30363d'} lineWidth={3} endArrow arrowSize={8} end={0} />);
    yield* arrow().end(1, 0.1, easeOutCubic);
  }

  const result = createRef<Txt>();
  view.add(<Txt ref={result} text={"If you can't explain it\nsimply, you don't know it"} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={42} fontWeight={800} y={80} textAlign={'center'} lineHeight={60} opacity={0} />);
  yield* fadeInUp(result(), 20, 0.3);

  const credit = createRef<Txt>();
  view.add(<Txt ref={credit} text={'— The Feynman Technique 🧪'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={28} fontWeight={700} y={200} opacity={0} />);
  yield* fadeIn(credit(), 0.3);

  yield* waitFor(1.5);
});
