import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const emoji = createRef<Txt>();
  view.add(<Txt ref={emoji} text={'🪟'} fontSize={150} y={-750} opacity={0} scale={0} />);
  yield* all(emoji().opacity(1, 0.3), emoji().scale(1, 0.4, easeOutBack));

  const name = createRef<Txt>();
  view.add(<Txt ref={name} text={'Satya Nadella'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={64} fontWeight={900} y={-600} opacity={0} />);
  yield* fadeIn(name(), 0.3);

  const company = createRef<Txt>();
  view.add(<Txt ref={company} text={'CEO of Microsoft'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={30} y={-530} opacity={0} />);
  yield* fadeIn(company(), 0.2);

  const annual = createRef<Rect>();
  view.add(
    <Rect ref={annual} width={440} height={80} radius={18} fill={'#21262d'} y={-410} opacity={0}>
      <Txt text={'Annual: $48.5 million'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={30} fontWeight={800} />
    </Rect>,
  );
  yield* annual().opacity(1, 0.3);
  yield* waitFor(0.5);

  const perSecLabel = createRef<Txt>();
  view.add(<Txt ref={perSecLabel} text={'Per second:'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={-310} opacity={0} />);
  yield* fadeIn(perSecLabel(), 0.2);

  const counter = createRef<Txt>();
  view.add(<Txt ref={counter} text={'$0.00'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={100} fontWeight={900} y={-210} opacity={0} />);
  yield* counter().opacity(1, 0.2);

  const steps = ['$0.20', '$0.50', '$0.80', '$1.10', '$1.30', '$1.45', '$1.54'];
  for (const s of steps) {
    counter().text(s);
    yield* waitFor(0.12);
  }
  yield* counter().fill(PURPLE, 0.2);
  yield* pulse(counter() as any, 1.08, 0.3);

  const liveLabel = createRef<Txt>();
  view.add(<Txt ref={liveLabel} text={'While you watch this scene:'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={26} fontWeight={700} y={-90} opacity={0} />);
  yield* fadeIn(liveLabel(), 0.2);

  const live = createRef<Txt>();
  view.add(<Txt ref={live} text={'$0'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={72} fontWeight={900} y={0} opacity={0} />);
  yield* live().opacity(1, 0.2);

  for (let i = 1; i <= 10; i++) {
    live().text(`$${(i * 1.54).toFixed(2)}`);
    yield* waitFor(0.3);
  }

  const context = createRef<Txt>();
  view.add(<Txt ref={context} text={'He tripled Microsoft stock\nsince becoming CEO in 2014 📈'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={26} y={120} textAlign={'center'} lineHeight={40} opacity={0} />);
  yield* fadeIn(context(), 0.3);

  yield* waitFor(1.5);
});
