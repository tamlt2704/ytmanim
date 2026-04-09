import {Rect, Txt, Circle, Node, View2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, PURPLE, CODE_FONT, TITLE_FONT} from './styles';

interface ThumbConfig {
  number: string;
  topic: string;
  command: string;
  commandColor: string;
  emoji: string;
  subtitle: string;
}

export function* showThumbnail(view: View2D, cfg: ThumbConfig) {
  const glow = createRef<Circle>();
  const corner1 = createRef<Rect>();
  const corner2 = createRef<Rect>();
  const topicTxt = createRef<Txt>();
  const cmdTxt = createRef<Txt>();
  const emojiTxt = createRef<Txt>();
  const subTxt = createRef<Txt>();
  const badge = createRef<Rect>();

  view.add(<Circle ref={glow} size={600} fill={cfg.commandColor} opacity={0.08} y={-100} />);
  view.add(<Rect ref={corner1} width={300} height={300} x={-390} y={-810} rotation={45} fill={GREEN} opacity={0.15} />);
  view.add(<Rect ref={corner2} width={200} height={200} x={390} y={810} rotation={45} fill={PURPLE} opacity={0.15} />);
  view.add(<Txt ref={topicTxt} text={cfg.topic} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={200} fontWeight={900} y={-400} letterSpacing={20} />);
  view.add(<Txt ref={cmdTxt} text={cfg.command} fill={cfg.commandColor} fontFamily={CODE_FONT} fontSize={100} fontWeight={900} y={-150} />);
  view.add(<Txt ref={emojiTxt} text={cfg.emoji} fontSize={200} y={150} />);
  view.add(<Txt ref={subTxt} text={cfg.subtitle} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={48} y={400} textAlign={'center'} />);
  view.add(
    <Rect ref={badge} x={350} y={-800} width={180} height={180} radius={90} fill={RED}>
      <Txt text={cfg.number} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={70} fontWeight={900} />
    </Rect>,
  );

  yield* waitFor(2);

  yield* all(
    glow().opacity(0, 0.4),
    corner1().opacity(0, 0.4),
    corner2().opacity(0, 0.4),
    topicTxt().opacity(0, 0.4),
    cmdTxt().opacity(0, 0.4),
    emojiTxt().opacity(0, 0.4),
    subTxt().opacity(0, 0.4),
    badge().opacity(0, 0.4),
  );
}
