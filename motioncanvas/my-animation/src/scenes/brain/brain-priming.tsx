import {Rect, Txt, makeScene2D, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, ORANGE, CODE_FONT, TITLE_FONT} from '../../styles';
import {showThumbnail} from '../../thumbnail-intro';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  yield* showThumbnail(view, {number: '#5', topic: 'BRAIN', command: 'Priming', commandColor: ACCENT_COLOR, emoji: '🎯', subtitle: 'Your Brain Is Being TRICKED!'});

  const prompt1 = createRef<Txt>();
  const word1 = createRef<Txt>();
  const ambiguous = createRef<Txt>();
  const divider = createRef<Rect>();
  const prompt2 = createRef<Txt>();
  const word2 = createRef<Txt>();
  const ambiguous2 = createRef<Txt>();
  const infoBox = createRef<Node>();
  const reveal = createRef<Txt>();
  const cta = createRef<Txt>();

  view.add(<Txt ref={prompt1} text={'Read this word:'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={32} y={-700} opacity={0} />);
  view.add(<Txt ref={word1} text={'DOCTOR'} fill={ORANGE} fontFamily={TITLE_FONT} fontSize={80} fontWeight={800} y={-600} opacity={0} scale={0} />);
  view.add(<Txt ref={ambiguous} text={'Now complete: N U R _ E'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={64} fontWeight={700} y={-460} opacity={0} />);
  view.add(<Rect ref={divider} width={600} height={4} fill={'#30363d'} y={-330} opacity={0} />);
  view.add(<Txt ref={prompt2} text={'But if you first read:'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={32} y={-240} opacity={0} />);
  view.add(<Txt ref={word2} text={'BABY'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={80} fontWeight={800} y={-140} opacity={0} scale={0} />);
  view.add(<Txt ref={ambiguous2} text={'N U R _ E → NURSE 👩‍⚕️'} fill={GREEN} fontFamily={CODE_FONT} fontSize={56} fontWeight={700} y={0} opacity={0} />);

  view.add(
    <Node ref={infoBox} y={200} opacity={0}>
      <Rect width={850} height={200} radius={16} fill={'#161b22'} stroke={'#30363d'} lineWidth={2}>
        <Txt text={'DOCTOR → NURSE (medical)\nBABY → PURSE (baby items)\n\nSame letters, different answer!'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={28} textAlign={'center'} lineHeight={44} />
      </Rect>
    </Node>,
  );

  view.add(<Txt ref={reveal} text={'Your brain fills in blanks based on\nwhat it was PRIMED with.\nContext shapes perception! 🤯'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={30} y={480} textAlign={'center'} lineHeight={48} opacity={0} />);
  view.add(<Txt ref={cta} text={'Follow for more brain tricks! 🔥'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={40} y={700} opacity={0} />);

  yield* prompt1().opacity(1, 0.3);
  yield* all(word1().opacity(1, 0.3), word1().scale(1, 0.4, easeOutCubic));
  yield* waitFor(1);
  yield* ambiguous().opacity(1, 0.5);
  yield* waitFor(2);
  yield* divider().opacity(1, 0.3);
  yield* waitFor(0.3);
  yield* prompt2().opacity(1, 0.3);
  yield* all(word2().opacity(1, 0.3), word2().scale(1, 0.4, easeOutCubic));
  yield* waitFor(1);
  yield* ambiguous2().opacity(1, 0.5);
  yield* waitFor(1.5);
  yield* infoBox().opacity(1, 0.5);
  yield* waitFor(1.5);
  yield* reveal().opacity(1, 0.6);
  yield* waitFor(1);
  yield* cta().opacity(1, 0.5);
  yield* waitFor(2);
});
