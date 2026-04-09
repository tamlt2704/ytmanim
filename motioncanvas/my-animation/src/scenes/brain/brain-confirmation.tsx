import {Rect, Txt, makeScene2D, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, CODE_FONT, TITLE_FONT} from '../../styles';
import {showThumbnail} from '../../thumbnail-intro';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  yield* showThumbnail(view, {number: '#8', topic: 'BRAIN', command: 'Confirmation', commandColor: RED, emoji: '🔍', subtitle: 'You Only See What You BELIEVE!'});

  const hypothesis = createRef<Txt>();
  const rule = createRef<Txt>();
  const cards = createRefArray<Rect>();
  const checkmarks = createRefArray<Txt>();
  const crossmarks = createRefArray<Txt>();
  const reveal = createRef<Txt>();
  const cta = createRef<Txt>();

  view.add(<Txt ref={hypothesis} text={'You believe: "I\'m unlucky"'} fill={ORANGE} fontFamily={TITLE_FONT} fontSize={44} y={-780} opacity={0} />);
  view.add(<Txt ref={rule} text={'Your brain filters reality:'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={36} y={-700} opacity={0} />);

  const events = [
    {text: '🚗 Flat tire', good: false},
    {text: '☀️ Beautiful day', good: true},
    {text: '📧 Got rejected', good: false},
    {text: '🎁 Friend gave gift', good: true},
    {text: '😤 Spilled coffee', good: false},
    {text: '💰 Found $20', good: true},
  ];

  events.forEach((e, i) => {
    view.add(
      <Rect ref={cards} width={700} height={100} y={-550 + i * 130} radius={12} fill={'#161b22'} stroke={'#30363d'} lineWidth={2} opacity={0} scale={0.8}>
        <Txt text={e.text} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={34} x={-50} />
        <Txt ref={checkmarks} text={'NOTICED ✓'} fill={RED} fontFamily={CODE_FONT} fontSize={24} fontWeight={700} x={260} opacity={0} />
        <Txt ref={crossmarks} text={'IGNORED ✗'} fill={'#30363d'} fontFamily={CODE_FONT} fontSize={24} x={260} opacity={0} />
      </Rect>,
    );
  });

  view.add(<Txt ref={reveal} text={'Your brain SEEKS evidence that\nconfirms what you already believe\nand IGNORES everything else.\n\n3 bad + 3 good = "I\'m so unlucky" 🤯'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={28} y={400} textAlign={'center'} lineHeight={44} opacity={0} />);
  view.add(<Txt ref={cta} text={'Follow for more brain tricks! 🔥'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={40} y={700} opacity={0} />);

  yield* hypothesis().opacity(1, 0.4);
  yield* rule().opacity(1, 0.4);
  yield* waitFor(0.5);

  for (let i = 0; i < events.length; i++) {
    yield* all(cards[i].opacity(1, 0.3), cards[i].scale(1, 0.3, easeOutCubic));
    yield* waitFor(0.3);
    if (!events[i].good) {
      yield* all(checkmarks[i].opacity(1, 0.3), cards[i].stroke(RED, 0.3));
    } else {
      yield* all(crossmarks[i].opacity(1, 0.3), cards[i].opacity(0.4, 0.3));
    }
    yield* waitFor(0.4);
  }

  yield* waitFor(1);
  yield* reveal().opacity(1, 0.6);
  yield* waitFor(1.5);
  yield* cta().opacity(1, 0.5);
  yield* waitFor(2);
});
