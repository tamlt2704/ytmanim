import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const emoji = createRef<Txt>();
  view.add(<Txt ref={emoji} text={'👑'} fontSize={150} y={-750} opacity={0} scale={0} />);
  yield* all(emoji().opacity(1, 0.3), emoji().scale(1, 0.4, easeOutBack));

  const name = createRef<Txt>();
  view.add(<Txt ref={name} text={'Hock Tan'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={72} fontWeight={900} y={-600} opacity={0} />);
  yield* fadeIn(name(), 0.3);

  const company = createRef<Txt>();
  view.add(<Txt ref={company} text={'CEO of Broadcom'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={30} y={-530} opacity={0} />);
  yield* fadeIn(company(), 0.2);

  const tag = createRef<Rect>();
  view.add(
    <Rect ref={tag} width={340} height={50} radius={25} fill={RED} y={-470} opacity={0} scale={0}>
      <Txt text={'#1 HIGHEST PAID CEO'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={22} fontWeight={900} letterSpacing={2} />
    </Rect>,
  );
  yield* all(tag().opacity(1, 0.2), tag().scale(1, 0.3, easeOutBack));

  const annual = createRef<Rect>();
  view.add(
    <Rect ref={annual} width={440} height={80} radius={18} fill={'#21262d'} y={-380} opacity={0}>
      <Txt text={'Annual: $162 million'} fill={RED} fontFamily={CODE_FONT} fontSize={30} fontWeight={800} />
    </Rect>,
  );
  yield* annual().opacity(1, 0.3);
  yield* waitFor(0.5);

  const perSecLabel = createRef<Txt>();
  view.add(<Txt ref={perSecLabel} text={'Per second:'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={-280} opacity={0} />);
  yield* fadeIn(perSecLabel(), 0.2);

  const counter = createRef<Txt>();
  view.add(<Txt ref={counter} text={'$0.00'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={100} fontWeight={900} y={-180} opacity={0} />);
  yield* counter().opacity(1, 0.2);

  const steps = ['$0.80', '$1.80', '$3.00', '$4.00', '$4.60', '$5.00', '$5.14'];
  for (const s of steps) {
    counter().text(s);
    yield* waitFor(0.12);
  }
  yield* counter().fill(RED, 0.2);
  yield* pulse(counter() as any, 1.1, 0.4);

  const liveLabel = createRef<Txt>();
  view.add(<Txt ref={liveLabel} text={'While you watch this scene:'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={26} fontWeight={700} y={-60} opacity={0} />);
  yield* fadeIn(liveLabel(), 0.2);

  const live = createRef<Txt>();
  view.add(<Txt ref={live} text={'$0'} fill={RED} fontFamily={CODE_FONT} fontSize={72} fontWeight={900} y={30} opacity={0} />);
  yield* live().opacity(1, 0.2);

  for (let i = 1; i <= 10; i++) {
    live().text(`$${(i * 5.14).toFixed(2)}`);
    yield* waitFor(0.3);
  }

  const context = createRef<Txt>();
  view.add(<Txt ref={context} text={'$5.14 every second\n$308 every minute\n$18,500 every hour\n$444,000 every day'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={24} fontWeight={700} y={180} textAlign={'center'} lineHeight={38} opacity={0} />);
  yield* fadeInUp(context(), 20, 0.3);

  yield* waitFor(2);
});
