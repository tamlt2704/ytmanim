import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, PURPLE, CODE_FONT, TITLE_FONT, TERMINAL_BG} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'#5 Time Filter'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={72} fontWeight={800} y={-800} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.3);

  const bad = createRef<Rect>();
  view.add(
    <Rect ref={bad} width={460} height={70} radius={35} fill={TERMINAL_BG} stroke={RED} lineWidth={3} y={-550} opacity={0}>
      <Txt text={'🔍 best javascript framework'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={23} />
    </Rect>,
  );
  yield* bad().opacity(1, 0.3);

  const badResult = createRef<Txt>();
  view.add(<Txt ref={badResult} text={'❌ Articles from 2015...'} fill={RED} fontFamily={CODE_FONT} fontSize={26} fontWeight={700} y={-460} opacity={0} />);
  yield* fadeIn(badResult(), 0.2);
  yield* waitFor(0.5);

  const good = createRef<Rect>();
  view.add(
    <Rect ref={good} width={480} height={70} radius={35} fill={TERMINAL_BG} stroke={GREEN} lineWidth={3} y={-330} opacity={0} scale={0}>
      <Txt text={'🔍 best js framework after:2024'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={23} fontWeight={700} />
    </Rect>,
  );
  yield* all(good().opacity(1, 0.2), good().scale(1, 0.3, easeOutBack));

  const goodResult = createRef<Txt>();
  view.add(<Txt ref={goodResult} text={'✅ Fresh results only!'} fill={GREEN} fontFamily={CODE_FONT} fontSize={26} fontWeight={700} y={-240} opacity={0} />);
  yield* fadeIn(goodResult(), 0.2);

  const syntax1 = createRef<Rect>();
  const syntax2 = createRef<Rect>();
  view.add(
    <Rect ref={syntax1} width={350} height={75} radius={16} fill={PURPLE + '15'} stroke={PURPLE} lineWidth={3} x={-120} y={-100} opacity={0} scale={0}>
      <Txt text={'before:2020'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={32} fontWeight={900} />
    </Rect>,
  );
  view.add(
    <Rect ref={syntax2} width={350} height={75} radius={16} fill={GREEN + '15'} stroke={GREEN} lineWidth={3} x={120} y={-100} opacity={0} scale={0}>
      <Txt text={'after:2024'} fill={GREEN} fontFamily={CODE_FONT} fontSize={32} fontWeight={900} />
    </Rect>,
  );
  yield* all(syntax1().opacity(1, 0.15), syntax1().scale(1, 0.25, easeOutBack), syntax2().opacity(1, 0.15), syntax2().scale(1, 0.25, easeOutBack));

  const explain = createRef<Txt>();
  view.add(<Txt ref={explain} text={'Filter by date to get\nfresh, relevant results'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={42} fontWeight={800} y={50} textAlign={'center'} lineHeight={60} opacity={0} />);
  yield* fadeInUp(explain(), 20, 0.3);

  const tip = createRef<Txt>();
  view.add(<Txt ref={tip} text={'Combine both:\nafter:2023 before:2025 📅'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={26} y={210} textAlign={'center'} lineHeight={42} opacity={0} />);
  yield* fadeIn(tip(), 0.3);

  yield* waitFor(1.5);
});
