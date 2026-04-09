import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT, TERMINAL_BG} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'#10 Combo Power'} fill={RED} fontFamily={CODE_FONT} fontSize={68} fontWeight={800} y={-800} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.3);

  const label = createRef<Txt>();
  view.add(<Txt ref={label} text={'🔥 Stack them together!'} fill={ORANGE} fontFamily={TITLE_FONT} fontSize={38} fontWeight={900} y={-620} opacity={0} />);
  yield* fadeIn(label(), 0.2);

  // Combo examples
  const combos = [
    {
      query: 'site:github.com "machine learning"\nfiletype:py after:2024',
      desc: 'Recent ML Python code on GitHub',
      color: GREEN,
    },
    {
      query: '"react tutorial" site:youtube.com\n-beginner after:2024',
      desc: 'Advanced React videos, this year',
      color: ACCENT_COLOR,
    },
    {
      query: 'intitle:"cheat sheet"\nfiletype:pdf python OR javascript',
      desc: 'PDF cheat sheets for JS or Python',
      color: PURPLE,
    },
  ];

  for (let i = 0; i < combos.length; i++) {
    const c = combos[i];
    const box = createRef<Rect>();
    view.add(
      <Rect ref={box} width={470} height={150} radius={18} fill={c.color + '12'} stroke={c.color} lineWidth={3} y={-430 + i * 200} opacity={0} scale={0}>
        <Txt text={c.query} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={20} fontWeight={700} y={-25} textAlign={'center'} lineHeight={30} />
        <Txt text={c.desc} fill={c.color} fontFamily={CODE_FONT} fontSize={20} fontWeight={800} y={50} />
      </Rect>,
    );
    yield* all(box().opacity(1, 0.15), box().scale(1, 0.25, easeOutBack));
    yield* waitFor(0.2);
  }

  const explain = createRef<Txt>();
  view.add(<Txt ref={explain} text={'Mix any operators for\nlaser-focused results'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={42} fontWeight={800} y={220} textAlign={'center'} lineHeight={60} opacity={0} />);
  yield* fadeInUp(explain(), 20, 0.3);

  const tip = createRef<Txt>();
  view.add(<Txt ref={tip} text={'You now search better than\n99% of people 🏆'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={26} y={370} textAlign={'center'} lineHeight={42} opacity={0} />);
  yield* fadeIn(tip(), 0.3);

  yield* waitFor(1.5);
});
