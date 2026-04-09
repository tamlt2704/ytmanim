import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT, TERMINAL_BG} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'#8 Search Titles'} fill={GREEN} fontFamily={CODE_FONT} fontSize={68} fontWeight={800} y={-800} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.3);

  const good = createRef<Rect>();
  view.add(
    <Rect ref={good} width={480} height={70} radius={35} fill={TERMINAL_BG} stroke={GREEN} lineWidth={3} y={-530} opacity={0} scale={0}>
      <Txt text={'🔍 intitle:cheat sheet python'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={24} fontWeight={700} />
    </Rect>,
  );
  yield* all(good().opacity(1, 0.2), good().scale(1, 0.3, easeOutBack));

  const result = createRef<Txt>();
  view.add(<Txt ref={result} text={'✅ Pages with "cheat sheet" in title!'} fill={GREEN} fontFamily={CODE_FONT} fontSize={24} fontWeight={700} y={-440} opacity={0} />);
  yield* fadeIn(result(), 0.2);

  const syntax = createRef<Rect>();
  view.add(
    <Rect ref={syntax} width={400} height={90} radius={18} fill={GREEN + '15'} stroke={GREEN} lineWidth={3} y={-300} opacity={0} scale={0}>
      <Txt text={'intitle:word'} fill={GREEN} fontFamily={CODE_FONT} fontSize={40} fontWeight={900} />
    </Rect>,
  );
  yield* all(syntax().opacity(1, 0.2), syntax().scale(1, 0.3, easeOutBack));
  yield* pulse(syntax() as any, 1.05, 0.3);

  // Also show allintitle
  const also = createRef<Rect>();
  view.add(
    <Rect ref={also} width={440} height={75} radius={16} fill={PURPLE + '15'} stroke={PURPLE} lineWidth={3} y={-160} opacity={0} scale={0}>
      <Txt text={'allintitle:word1 word2'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={32} fontWeight={900} />
    </Rect>,
  );
  yield* all(also().opacity(1, 0.15), also().scale(1, 0.25, easeOutBack));

  const explain = createRef<Txt>();
  view.add(<Txt ref={explain} text={'Only shows pages where\nthe title contains your word'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={40} fontWeight={800} y={0} textAlign={'center'} lineHeight={58} opacity={0} />);
  yield* fadeInUp(explain(), 20, 0.3);

  const tip = createRef<Txt>();
  view.add(<Txt ref={tip} text={'Find tutorials, guides, and\ncheat sheets instantly 🎯'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={26} y={160} textAlign={'center'} lineHeight={42} opacity={0} />);
  yield* fadeIn(tip(), 0.3);

  yield* waitFor(1.5);
});
