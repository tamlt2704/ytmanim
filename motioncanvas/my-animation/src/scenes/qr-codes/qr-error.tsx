import {Rect, Txt, Circle, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(
    <Txt ref={title}
      text={'Error\nCorrection'}
      fill={PURPLE} fontFamily={TITLE_FONT}
      fontSize={80} fontWeight={900}
      y={-780} textAlign={'center'} lineHeight={90}
      opacity={0}
    />,
  );
  yield* fadeInUp(title(), 30, 0.4);

  const hook = createRef<Txt>();
  view.add(
    <Txt ref={hook}
      text={'QR codes still work\neven when damaged!'}
      fill={TEXT_COLOR} fontFamily={TITLE_FONT}
      fontSize={48} fontWeight={800}
      y={-580} textAlign={'center'} lineHeight={66}
      opacity={0}
    />,
  );
  yield* fadeInUp(hook(), 20, 0.4);
  yield* waitFor(1);

  // 4 levels
  const levels = [
    {level: 'L', pct: '7%', desc: 'Low', color: GREEN},
    {level: 'M', pct: '15%', desc: 'Medium', color: ACCENT_COLOR},
    {level: 'Q', pct: '25%', desc: 'Quartile', color: ORANGE},
    {level: 'H', pct: '30%', desc: 'High', color: RED},
  ];

  for (let i = 0; i < levels.length; i++) {
    const l = levels[i];
    const card = createRef<Rect>();
    view.add(
      <Rect ref={card}
        width={420} height={90} radius={18}
        fill={l.color + '12'} stroke={l.color} lineWidth={3}
        y={-380 + i * 110}
        opacity={0} scale={0}
      >
        <Txt text={l.level} fill={l.color} fontFamily={TITLE_FONT} fontSize={48} fontWeight={900} x={-160} />
        <Txt text={l.pct} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={40} fontWeight={900} x={-50} />
        <Txt text={`${l.desc}\ncan be damaged`} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={18} x={90} textAlign={'center'} lineHeight={24} />
      </Rect>,
    );
    yield* all(card().opacity(1, 0.2), card().scale(1, 0.3, easeOutBack));
    yield* waitFor(0.5);
  }

  yield* waitFor(0.5);

  const explain = createRef<Txt>();
  view.add(
    <Txt ref={explain}
      text={"That's why logos\ncan go in the center!"}
      fill={GREEN} fontFamily={TITLE_FONT}
      fontSize={46} fontWeight={800}
      y={120} textAlign={'center'} lineHeight={64}
      opacity={0}
    />,
  );
  yield* fadeInUp(explain(), 20, 0.4);
  yield* pulse(explain() as any, 1.05, 0.3);

  const detail = createRef<Txt>();
  view.add(
    <Txt ref={detail}
      text={'Uses Reed-Solomon\nalgorithm to rebuild\nmissing data'}
      fill={'#8b949e'} fontFamily={CODE_FONT}
      fontSize={24} y={280}
      textAlign={'center'} lineHeight={38}
      opacity={0}
    />,
  );
  yield* fadeIn(detail(), 0.3);

  yield* waitFor(2);
});
