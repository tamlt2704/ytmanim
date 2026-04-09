import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT, TERMINAL_BG} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'#7 Wildcard *'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={72} fontWeight={800} y={-800} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.3);

  const good = createRef<Rect>();
  view.add(
    <Rect ref={good} width={480} height={70} radius={35} fill={TERMINAL_BG} stroke={ORANGE} lineWidth={3} y={-530} opacity={0} scale={0}>
      <Txt text={'🔍 "the * of the rings"'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={26} fontWeight={700} />
    </Rect>,
  );
  yield* all(good().opacity(1, 0.2), good().scale(1, 0.3, easeOutBack));

  const result = createRef<Txt>();
  view.add(<Txt ref={result} text={'✅ "The Lord of the Rings"'} fill={GREEN} fontFamily={CODE_FONT} fontSize={26} fontWeight={700} y={-440} opacity={0} />);
  yield* fadeIn(result(), 0.2);

  const syntax = createRef<Rect>();
  view.add(
    <Rect ref={syntax} width={300} height={100} radius={18} fill={ORANGE + '15'} stroke={ORANGE} lineWidth={3} y={-300} opacity={0} scale={0}>
      <Txt text={'*'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={80} fontWeight={900} />
    </Rect>,
  );
  yield* all(syntax().opacity(1, 0.2), syntax().scale(1, 0.3, easeOutBack));
  yield* pulse(syntax() as any, 1.08, 0.3);

  const explain = createRef<Txt>();
  view.add(<Txt ref={explain} text={'Asterisk = any word\nGoogle fills the blank'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={42} fontWeight={800} y={-130} textAlign={'center'} lineHeight={60} opacity={0} />);
  yield* fadeInUp(explain(), 20, 0.3);

  const examples = [
    '"how to * a website"',
    '"* is the best programming language"',
    '"the secret to * is *"',
  ];
  for (let i = 0; i < examples.length; i++) {
    const t = createRef<Txt>();
    view.add(<Txt ref={t} text={examples[i]} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={24} fontWeight={700} y={20 + i * 55} opacity={0} />);
    yield* t().opacity(1, 0.15);
  }

  const tip = createRef<Txt>();
  view.add(<Txt ref={tip} text={"Perfect when you can't\nremember the full phrase 🧩"} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={26} y={250} textAlign={'center'} lineHeight={42} opacity={0} />);
  yield* fadeIn(tip(), 0.3);

  yield* waitFor(1.5);
});
