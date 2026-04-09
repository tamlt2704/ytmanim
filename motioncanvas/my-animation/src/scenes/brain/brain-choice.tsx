import {Rect, Txt, Circle, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {showThumbnail} from '../../thumbnail-intro';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  yield* showThumbnail(view, {number: '#9', topic: 'BRAIN', command: 'Choice', commandColor: GREEN, emoji: '🤯', subtitle: 'More Options = WORSE Decisions!'});

  const scenario1Label = createRef<Txt>();
  const jars3 = createRefArray<Circle>();
  const result1 = createRef<Txt>();
  const vs = createRef<Txt>();
  const scenario2Label = createRef<Txt>();
  const jars24 = createRefArray<Circle>();
  const result2 = createRef<Txt>();
  const reveal = createRef<Txt>();
  const cta = createRef<Txt>();

  view.add(<Txt ref={scenario1Label} text={'Store A: 3 jams'} fill={GREEN} fontFamily={TITLE_FONT} fontSize={44} y={-730} opacity={0} />);
  const colors3 = [RED, ORANGE, PURPLE];
  colors3.forEach((c, i) => {
    view.add(<Circle ref={jars3} size={100} fill={c} x={-150 + i * 150} y={-600} opacity={0} scale={0} />);
  });
  view.add(<Txt ref={result1} text={'30% bought jam ✅'} fill={GREEN} fontFamily={CODE_FONT} fontSize={40} fontWeight={700} y={-490} opacity={0} />);
  view.add(<Txt ref={vs} text={'VS'} fill={'#8b949e'} fontFamily={TITLE_FONT} fontSize={60} fontWeight={800} y={-390} opacity={0} />);
  view.add(<Txt ref={scenario2Label} text={'Store B: 24 jams'} fill={RED} fontFamily={TITLE_FONT} fontSize={44} y={-290} opacity={0} />);

  const colors24 = [RED, ORANGE, PURPLE, GREEN, ACCENT_COLOR, '#ffd93d', RED, ORANGE, PURPLE, GREEN, ACCENT_COLOR, '#ffd93d', RED, ORANGE, PURPLE, GREEN, ACCENT_COLOR, '#ffd93d', RED, ORANGE, PURPLE, GREEN, ACCENT_COLOR, '#ffd93d'];
  colors24.forEach((c, i) => {
    const row = Math.floor(i / 8);
    const col = i % 8;
    view.add(<Circle ref={jars24} size={50} fill={c} x={-280 + col * 80} y={-170 + row * 70} opacity={0} scale={0} />);
  });
  view.add(<Txt ref={result2} text={'3% bought jam ❌'} fill={RED} fontFamily={CODE_FONT} fontSize={40} fontWeight={700} y={90} opacity={0} />);

  view.add(<Txt ref={reveal} text={'Too many choices = decision paralysis.\n\nYour brain gets overwhelmed and\nchooses NOTHING instead.\nLess is more! 🤯'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={28} y={330} textAlign={'center'} lineHeight={44} opacity={0} />);
  view.add(<Txt ref={cta} text={'Follow for more brain tricks! 🔥'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={40} y={620} opacity={0} />);

  yield* scenario1Label().opacity(1, 0.4);
  for (const j of jars3) {
    yield* all(j.opacity(1, 0.2), j.scale(1, 0.3, easeOutCubic));
  }
  yield* waitFor(0.5);
  yield* result1().opacity(1, 0.4);
  yield* waitFor(1);
  yield* vs().opacity(1, 0.3);
  yield* waitFor(0.3);
  yield* scenario2Label().opacity(1, 0.4);
  for (let i = 0; i < jars24.length; i += 3) {
    const batch = jars24.slice(i, i + 3);
    yield* all(...batch.map(j => all(j.opacity(1, 0.1), j.scale(1, 0.15, easeOutCubic))));
  }
  yield* waitFor(0.5);
  yield* result2().opacity(1, 0.4);
  yield* waitFor(1.5);
  yield* reveal().opacity(1, 0.6);
  yield* waitFor(1.5);
  yield* cta().opacity(1, 0.5);
  yield* waitFor(2);
});
