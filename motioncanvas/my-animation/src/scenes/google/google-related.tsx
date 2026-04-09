import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT, TERMINAL_BG} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'#9 Find Similar Sites'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={60} fontWeight={800} y={-800} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.3);

  const good = createRef<Rect>();
  view.add(
    <Rect ref={good} width={460} height={70} radius={35} fill={TERMINAL_BG} stroke={PURPLE} lineWidth={3} y={-530} opacity={0} scale={0}>
      <Txt text={'🔍 related:netflix.com'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={26} fontWeight={700} />
    </Rect>,
  );
  yield* all(good().opacity(1, 0.2), good().scale(1, 0.3, easeOutBack));

  const result = createRef<Txt>();
  view.add(<Txt ref={result} text={'✅ Hulu, Disney+, HBO Max...'} fill={GREEN} fontFamily={CODE_FONT} fontSize={26} fontWeight={700} y={-440} opacity={0} />);
  yield* fadeIn(result(), 0.2);

  const syntax = createRef<Rect>();
  view.add(
    <Rect ref={syntax} width={430} height={90} radius={18} fill={PURPLE + '15'} stroke={PURPLE} lineWidth={3} y={-300} opacity={0} scale={0}>
      <Txt text={'related:site.com'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={40} fontWeight={900} />
    </Rect>,
  );
  yield* all(syntax().opacity(1, 0.2), syntax().scale(1, 0.3, easeOutBack));
  yield* pulse(syntax() as any, 1.05, 0.3);

  // Examples
  const examples = [
    {query: 'related:github.com', result: '→ GitLab, Bitbucket...', color: ACCENT_COLOR},
    {query: 'related:spotify.com', result: '→ Apple Music, Tidal...', color: GREEN},
    {query: 'related:figma.com', result: '→ Sketch, Adobe XD...', color: ORANGE},
  ];
  for (let i = 0; i < examples.length; i++) {
    const box = createRef<Rect>();
    view.add(
      <Rect ref={box} width={440} height={60} radius={14} fill={examples[i].color + '15'} y={-140 + i * 80} opacity={0}>
        <Txt text={examples[i].query} fill={examples[i].color} fontFamily={CODE_FONT} fontSize={22} fontWeight={800} x={-80} />
        <Txt text={examples[i].result} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={20} x={130} />
      </Rect>,
    );
    yield* box().opacity(1, 0.15);
  }

  const tip = createRef<Txt>();
  view.add(<Txt ref={tip} text={'Discover competitors and\nalternatives instantly 🔍'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={26} y={160} textAlign={'center'} lineHeight={42} opacity={0} />);
  yield* fadeIn(tip(), 0.3);

  yield* waitFor(1.5);
});
