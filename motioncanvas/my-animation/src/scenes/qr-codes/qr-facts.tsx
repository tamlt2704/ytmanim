import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(
    <Txt ref={title}
      text={'Fun Facts'}
      fill={GREEN} fontFamily={TITLE_FONT}
      fontSize={80} fontWeight={900}
      y={-800} opacity={0}
    />,
  );
  yield* fadeInUp(title(), 30, 0.4);

  const facts = [
    {emoji: '📊', text: '40 versions\n21×21 to 177×177 modules', color: ACCENT_COLOR},
    {emoji: '📝', text: 'Max capacity:\n7,089 digits or\n4,296 characters', color: GREEN},
    {emoji: '🇯🇵', text: 'Invented in 1994\nby Denso Wave (Japan)\nfor car parts tracking', color: ORANGE},
    {emoji: '🆓', text: 'Patent exists but\nDenso chose NOT\nto enforce it', color: PURPLE},
    {emoji: '🌍', text: 'Used 10+ billion\ntimes per day\nworldwide', color: RED},
  ];

  for (let i = 0; i < facts.length; i++) {
    const f = facts[i];
    const card = createRef<Rect>();
    view.add(
      <Rect ref={card}
        width={440} height={120} radius={18}
        fill={f.color + '12'} stroke={f.color} lineWidth={2}
        y={-580 + i * 145}
        opacity={0} scale={0}
      >
        <Txt text={f.emoji} fontSize={44} x={-175} />
        <Txt text={f.text} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={22} fontWeight={700} x={20} textAlign={'center'} lineHeight={30} />
      </Rect>,
    );
    yield* all(card().opacity(1, 0.2), card().scale(1, 0.3, easeOutBack));
    yield* waitFor(0.8);
  }

  const mind = createRef<Txt>();
  view.add(
    <Txt ref={mind}
      text={'Free, open, and\neverywhere 🤯'}
      fill={ACCENT_COLOR} fontFamily={TITLE_FONT}
      fontSize={44} fontWeight={800}
      y={200} textAlign={'center'} lineHeight={62}
      opacity={0}
    />,
  );
  yield* fadeInUp(mind(), 20, 0.3);

  yield* waitFor(2);
});
