import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, CODE_FONT, TITLE_FONT, TERMINAL_BG} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'#6 OR Search'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={72} fontWeight={800} y={-800} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.3);

  const good = createRef<Rect>();
  view.add(
    <Rect ref={good} width={480} height={70} radius={35} fill={TERMINAL_BG} stroke={ACCENT_COLOR} lineWidth={3} y={-530} opacity={0} scale={0}>
      <Txt text={'🔍 best laptop 2024 OR 2025'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={24} fontWeight={700} />
    </Rect>,
  );
  yield* all(good().opacity(1, 0.2), good().scale(1, 0.3, easeOutBack));

  const result = createRef<Txt>();
  view.add(<Txt ref={result} text={'✅ Results with either year!'} fill={GREEN} fontFamily={CODE_FONT} fontSize={26} fontWeight={700} y={-440} opacity={0} />);
  yield* fadeIn(result(), 0.2);

  const syntax = createRef<Rect>();
  view.add(
    <Rect ref={syntax} width={380} height={90} radius={18} fill={ACCENT_COLOR + '15'} stroke={ACCENT_COLOR} lineWidth={3} y={-300} opacity={0} scale={0}>
      <Txt text={'term1 OR term2'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={38} fontWeight={900} />
    </Rect>,
  );
  yield* all(syntax().opacity(1, 0.2), syntax().scale(1, 0.3, easeOutBack));
  yield* pulse(syntax() as any, 1.05, 0.3);

  // Examples
  const examples = [
    {text: 'JavaScript OR TypeScript tutorial', color: ORANGE},
    {text: 'cheap flights NYC OR Boston', color: GREEN},
    {text: 'React OR Vue OR Svelte jobs', color: ACCENT_COLOR},
  ];
  for (let i = 0; i < examples.length; i++) {
    const box = createRef<Rect>();
    view.add(
      <Rect ref={box} width={460} height={55} radius={12} fill={examples[i].color + '15'} y={-150 + i * 75} opacity={0}>
        <Txt text={examples[i].text} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={22} fontWeight={700} />
      </Rect>,
    );
    yield* box().opacity(1, 0.15);
  }

  const explain = createRef<Txt>();
  view.add(<Txt ref={explain} text={'OR must be UPPERCASE!\nLowercase "or" is ignored'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={26} y={130} textAlign={'center'} lineHeight={42} opacity={0} />);
  yield* fadeIn(explain(), 0.3);

  yield* waitFor(1.5);
});
