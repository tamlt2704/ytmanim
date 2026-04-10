import {Rect, Txt, Line, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(
    <Txt ref={title}
      text={'What Is a\nQR Code?'}
      fill={TEXT_COLOR} fontFamily={TITLE_FONT}
      fontSize={80} fontWeight={900}
      y={-750} textAlign={'center'} lineHeight={90}
      opacity={0}
    />,
  );
  yield* fadeInUp(title(), 30, 0.4);

  // Big centered explanation
  const line1 = createRef<Txt>();
  view.add(
    <Txt ref={line1}
      text={'Quick Response'}
      fill={ACCENT_COLOR} fontFamily={TITLE_FONT}
      fontSize={70} fontWeight={900}
      y={-550} opacity={0}
    />,
  );
  yield* fadeIn(line1(), 0.3);

  const line2 = createRef<Txt>();
  view.add(
    <Txt ref={line2}
      text={'A 2D barcode that\nstores data in a\ngrid of black &\nwhite squares'}
      fill={TEXT_COLOR} fontFamily={CODE_FONT}
      fontSize={38} fontWeight={700}
      y={-340} textAlign={'center'} lineHeight={56}
      opacity={0}
    />,
  );
  yield* fadeInUp(line2(), 20, 0.4);
  yield* waitFor(1.5);

  // Parts list
  const parts = [
    {emoji: '🔲', name: 'Finder Patterns', desc: 'Tell scanner "I\'m a QR code"', color: RED},
    {emoji: '📐', name: 'Alignment Pattern', desc: 'Fixes distortion', color: ORANGE},
    {emoji: '📏', name: 'Timing Patterns', desc: 'Grid coordinate system', color: GREEN},
    {emoji: '💾', name: 'Data Modules', desc: 'Your actual information', color: ACCENT_COLOR},
    {emoji: '🛡️', name: 'Error Correction', desc: 'Works even if damaged', color: PURPLE},
  ];

  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    const card = createRef<Rect>();
    view.add(
      <Rect ref={card}
        width={560} height={110} radius={16}
        fill={p.color + '12'} stroke={p.color} lineWidth={2}
        y={-80 + i * 125}
        opacity={0} scale={0}
      >
        <Txt text={p.emoji} fontSize={44} x={-230} />
        <Txt text={p.name} fill={p.color} fontFamily={CODE_FONT} fontSize={36} fontWeight={900} x={-20} y={-16} />
        <Txt text={p.desc} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} x={-20} y={22} />
      </Rect>,
    );
    yield* all(card().opacity(1, 0.2), card().scale(1, 0.3, easeOutBack));
    yield* waitFor(0.4);
  }

  yield* waitFor(2);
});
