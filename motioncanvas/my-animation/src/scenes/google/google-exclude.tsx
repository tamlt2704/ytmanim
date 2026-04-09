import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, CODE_FONT, TITLE_FONT, TERMINAL_BG} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'#2 Exclude Words'} fill={RED} fontFamily={CODE_FONT} fontSize={68} fontWeight={800} y={-800} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.3);

  const bad = createRef<Rect>();
  view.add(
    <Rect ref={bad} width={460} height={70} radius={35} fill={TERMINAL_BG} stroke={RED} lineWidth={3} y={-550} opacity={0}>
      <Txt text={'🔍 apple'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={24} />
    </Rect>,
  );
  yield* bad().opacity(1, 0.3);

  const badResult = createRef<Txt>();
  view.add(<Txt ref={badResult} text={'❌ iPhones everywhere...'} fill={RED} fontFamily={CODE_FONT} fontSize={26} fontWeight={700} y={-460} opacity={0} />);
  yield* fadeIn(badResult(), 0.2);
  yield* waitFor(0.5);

  const good = createRef<Rect>();
  view.add(
    <Rect ref={good} width={460} height={70} radius={35} fill={TERMINAL_BG} stroke={GREEN} lineWidth={3} y={-330} opacity={0} scale={0}>
      <Txt text={'🔍 apple -iphone -mac'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={26} fontWeight={700} />
    </Rect>,
  );
  yield* all(good().opacity(1, 0.2), good().scale(1, 0.3, easeOutBack));

  const goodResult = createRef<Txt>();
  view.add(<Txt ref={goodResult} text={'✅ Only the fruit! 🍎'} fill={GREEN} fontFamily={CODE_FONT} fontSize={26} fontWeight={700} y={-240} opacity={0} />);
  yield* fadeIn(goodResult(), 0.2);

  const syntax = createRef<Rect>();
  view.add(
    <Rect ref={syntax} width={350} height={90} radius={18} fill={RED + '15'} stroke={RED} lineWidth={3} y={-100} opacity={0} scale={0}>
      <Txt text={'-word'} fill={RED} fontFamily={CODE_FONT} fontSize={48} fontWeight={900} />
    </Rect>,
  );
  yield* all(syntax().opacity(1, 0.2), syntax().scale(1, 0.3, easeOutBack));
  yield* pulse(syntax() as any, 1.05, 0.3);

  const explain = createRef<Txt>();
  view.add(<Txt ref={explain} text={'Minus sign removes\nunwanted results'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={42} fontWeight={800} y={60} textAlign={'center'} lineHeight={60} opacity={0} />);
  yield* fadeInUp(explain(), 20, 0.3);

  const tip = createRef<Txt>();
  view.add(<Txt ref={tip} text={'Stack multiple: -word1 -word2\nNo space after the minus! ⚠️'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={26} y={220} textAlign={'center'} lineHeight={42} opacity={0} />);
  yield* fadeIn(tip(), 0.3);

  yield* waitFor(1.5);
});
