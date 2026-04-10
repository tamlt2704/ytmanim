import {Rect, Txt, Line, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack, easeOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(
    <Txt ref={title}
      text={'How Scanning\nWorks'}
      fill={ORANGE} fontFamily={TITLE_FONT}
      fontSize={76} fontWeight={900}
      y={-780} textAlign={'center'} lineHeight={88}
      opacity={0}
    />,
  );
  yield* fadeInUp(title(), 30, 0.4);

  const steps = [
    {num: '1', text: 'Find the 3\nfinder patterns', emoji: '🔲', color: RED},
    {num: '2', text: 'Determine\norientation & size', emoji: '📐', color: ORANGE},
    {num: '3', text: 'Read timing\npatterns for grid', emoji: '📏', color: GREEN},
    {num: '4', text: 'Extract binary\ndata modules', emoji: '💾', color: ACCENT_COLOR},
    {num: '5', text: 'Apply error\ncorrection', emoji: '🛡️', color: PURPLE},
    {num: '6', text: 'Decode binary\nback to text/URL', emoji: '✅', color: GREEN},
  ];

  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    const y = -600 + i * 150;

    const card = createRef<Rect>();
    view.add(
      <Rect ref={card}
        width={560} height={120} radius={18}
        fill={s.color + '12'} stroke={s.color} lineWidth={2}
        y={y} opacity={0} scale={0}
      >
        <Txt text={s.emoji} fontSize={52} x={-220} />
        <Txt text={s.num} fill={s.color} fontFamily={TITLE_FONT} fontSize={44} fontWeight={900} x={-150} />
        <Txt text={s.text} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={32} fontWeight={700} x={30} textAlign={'center'} lineHeight={42} />
      </Rect>,
    );
    yield* all(card().opacity(1, 0.2), card().scale(1, 0.3, easeOutBack));

    // Arrow between steps
    if (i < steps.length - 1) {
      const arrow = createRef<Line>();
      view.add(<Line ref={arrow} points={[[0, y + 55], [0, y + 75]]} stroke={'#30363d'} lineWidth={2} endArrow arrowSize={8} end={0} />);
      yield* arrow().end(1, 0.1, easeOutCubic);
    }
    yield* waitFor(0.3);
  }

  const speed = createRef<Txt>();
  view.add(
    <Txt ref={speed}
      text={'All 6 steps happen\nin under 0.1 seconds ⚡'}
      fill={ACCENT_COLOR} fontFamily={TITLE_FONT}
      fontSize={38} fontWeight={800}
      y={380} textAlign={'center'} lineHeight={54}
      opacity={0}
    />,
  );
  yield* fadeInUp(speed(), 20, 0.3);
  yield* pulse(speed() as any, 1.05, 0.3);

  yield* waitFor(2);
});
