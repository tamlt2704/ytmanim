import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {showThumbnail} from '../../thumbnail-intro';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  yield* showThumbnail(view, {number: '#3', topic: 'BRAIN', command: 'Anchoring', commandColor: PURPLE, emoji: '⚓', subtitle: 'Your Estimates Are WRONG!'});

  const q1 = createRef<Txt>();
  const q1Calc = createRef<Txt>();
  const q2 = createRef<Txt>();
  const q2Calc = createRef<Txt>();
  const guessLabel = createRef<Txt>();
  const guess1 = createRef<Txt>();
  const guess2 = createRef<Txt>();
  const actualAnswer = createRef<Txt>();
  const reveal = createRef<Txt>();
  const cta = createRef<Txt>();

  view.add(<Txt ref={q1} text={'Quick! Estimate this:'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={48} y={-700} opacity={0} />);
  view.add(<Txt ref={q1Calc} text={'1 × 2 × 3 × 4 × 5 × 6 × 7 × 8'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={42} fontWeight={700} y={-610} opacity={0} />);
  view.add(<Txt ref={q2} text={'Now estimate this:'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={48} y={-430} opacity={0} />);
  view.add(<Txt ref={q2Calc} text={'8 × 7 × 6 × 5 × 4 × 3 × 2 × 1'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={42} fontWeight={700} y={-340} opacity={0} />);
  view.add(<Txt ref={guessLabel} text={'Most people guess:'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={44} y={-150} opacity={0} />);
  view.add(<Txt ref={guess1} text={'First: ~512'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={52} fontWeight={700} y={-50} opacity={0} />);
  view.add(<Txt ref={guess2} text={'Second: ~2,250'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={52} fontWeight={700} y={50} opacity={0} />);
  view.add(<Txt ref={actualAnswer} text={'Actual answer: 40,320'} fill={GREEN} fontFamily={TITLE_FONT} fontSize={64} fontWeight={800} y={230} opacity={0} scale={0} />);
  view.add(<Txt ref={reveal} text={'Same numbers, same answer!\n\nYour brain "anchors" to the first\nnumbers it sees and estimates\nfrom there. This is Anchoring Bias 🤯'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={30} y={500} textAlign={'center'} lineHeight={48} opacity={0} />);
  view.add(<Txt ref={cta} text={'Follow for more brain tricks! 🔥'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={40} y={820} opacity={0} />);

  yield* q1().opacity(1, 0.4);
  yield* q1Calc().opacity(1, 0.4);
  yield* waitFor(2);
  yield* q2().opacity(1, 0.4);
  yield* q2Calc().opacity(1, 0.4);
  yield* waitFor(2);
  yield* guessLabel().opacity(1, 0.4);
  yield* waitFor(0.3);
  yield* guess1().opacity(1, 0.4);
  yield* guess2().opacity(1, 0.4);
  yield* waitFor(1.5);
  yield* all(actualAnswer().opacity(1, 0.4), actualAnswer().scale(1, 0.5, easeOutCubic));
  yield* waitFor(1);
  yield* reveal().opacity(1, 0.6);
  yield* waitFor(1.5);
  yield* cta().opacity(1, 0.5);
  yield* waitFor(2);
});
