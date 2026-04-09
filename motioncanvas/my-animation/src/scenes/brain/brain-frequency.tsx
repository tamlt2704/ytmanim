import {Rect, Txt, makeScene2D, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {showThumbnail} from '../../thumbnail-intro';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  yield* showThumbnail(view, {number: '#10', topic: 'BRAIN', command: 'Frequency', commandColor: PURPLE, emoji: '🔁', subtitle: 'Why You See It EVERYWHERE!'});

  const step1 = createRef<Txt>();
  const word = createRef<Txt>();
  const step2 = createRef<Txt>();
  const highlights = createRefArray<Rect>();
  const reveal = createRef<Txt>();
  const cta = createRef<Txt>();

  view.add(<Txt ref={step1} text={'You learn a new word:'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={36} y={-750} opacity={0} />);
  view.add(<Txt ref={word} text={'SONDER'} fill={ORANGE} fontFamily={TITLE_FONT} fontSize={90} fontWeight={800} y={-640} opacity={0} scale={0} />);
  view.add(<Txt ref={step2} text={'Suddenly it\'s EVERYWHERE:'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={40} y={-510} opacity={0} />);

  const sightings = [
    {text: '📱 Social media post mentions "sonder"', y: -390},
    {text: '📖 Book chapter titled "Sonder"', y: -270},
    {text: '🎵 Song lyric: "...feeling sonder..."', y: -150},
    {text: '💬 Friend uses "sonder" in conversation', y: -30},
    {text: '📺 TV show character says "sonder"', y: 90},
  ];

  sightings.forEach(s => {
    view.add(
      <Rect ref={highlights} width={800} height={80} y={s.y} radius={12} fill={'#161b22'} stroke={'#30363d'} lineWidth={2} opacity={0}>
        <Txt text={s.text} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={28} />
      </Rect>,
    );
  });

  view.add(<Txt ref={reveal} text={'The word was always there.\nYour brain just started NOTICING it.\n\nBaader-Meinhof Phenomenon:\nlearning something new makes your\nbrain flag it everywhere 🤯'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={26} y={380} textAlign={'center'} lineHeight={42} opacity={0} />);
  view.add(<Txt ref={cta} text={'Follow for more brain tricks! 🔥'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={40} y={700} opacity={0} />);

  yield* step1().opacity(1, 0.3);
  yield* all(word().opacity(1, 0.3), word().scale(1, 0.5, easeOutCubic));
  yield* waitFor(1);
  yield* step2().opacity(1, 0.4);
  yield* waitFor(0.5);

  for (let i = 0; i < sightings.length; i++) {
    yield* highlights[i].opacity(1, 0.3);
    yield* waitFor(0.3);
    yield* highlights[i].stroke(ORANGE, 0.3);
    yield* waitFor(0.5);
  }

  yield* waitFor(1);
  yield* reveal().opacity(1, 0.6);
  yield* waitFor(1.5);
  yield* cta().opacity(1, 0.5);
  yield* waitFor(2);
});
