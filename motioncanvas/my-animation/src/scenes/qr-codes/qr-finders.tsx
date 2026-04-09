import {Rect, Txt, Line, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack, easeOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(
    <Txt ref={title}
      text={'Finder\nPatterns'}
      fill={RED} fontFamily={TITLE_FONT}
      fontSize={80} fontWeight={900}
      y={-780} textAlign={'center'} lineHeight={90}
      opacity={0}
    />,
  );
  yield* fadeInUp(title(), 30, 0.4);

  // Draw one finder pattern (nested squares)
  const drawFinder = (cx: number, cy: number) => {
    const outer = createRef<Rect>();
    const mid = createRef<Rect>();
    const inner = createRef<Rect>();
    view.add(<Rect ref={outer} x={cx} y={cy} width={160} height={160} radius={8} fill={'none'} stroke={TEXT_COLOR} lineWidth={6} opacity={0} />);
    view.add(<Rect ref={mid} x={cx} y={cy} width={110} height={110} radius={6} fill={'none'} stroke={BG_COLOR} lineWidth={6} opacity={0} />);
    view.add(<Rect ref={inner} x={cx} y={cy} width={65} height={65} radius={4} fill={TEXT_COLOR} opacity={0} />);
    return {outer, mid, inner};
  };

  // 3 finder patterns
  const tl = drawFinder(-140, -450);
  const tr = drawFinder(140, -450);
  const bl = drawFinder(-140, -170);

  // Animate them in
  yield* all(tl.outer().opacity(1, 0.3), tl.mid().opacity(1, 0.3), tl.inner().opacity(1, 0.3));
  yield* waitFor(0.3);
  yield* all(tr.outer().opacity(1, 0.3), tr.mid().opacity(1, 0.3), tr.inner().opacity(1, 0.3));
  yield* waitFor(0.3);
  yield* all(bl.outer().opacity(1, 0.3), bl.mid().opacity(1, 0.3), bl.inner().opacity(1, 0.3));

  // Labels
  const labelTL = createRef<Txt>();
  view.add(<Txt ref={labelTL} text={'Top Left'} fill={RED} fontFamily={CODE_FONT} fontSize={22} fontWeight={800} x={-140} y={-340} opacity={0} />);
  const labelTR = createRef<Txt>();
  view.add(<Txt ref={labelTR} text={'Top Right'} fill={RED} fontFamily={CODE_FONT} fontSize={22} fontWeight={800} x={140} y={-340} opacity={0} />);
  const labelBL = createRef<Txt>();
  view.add(<Txt ref={labelBL} text={'Bottom Left'} fill={RED} fontFamily={CODE_FONT} fontSize={22} fontWeight={800} x={-140} y={-60} opacity={0} />);
  yield* all(labelTL().opacity(1, 0.2), labelTR().opacity(1, 0.2), labelBL().opacity(1, 0.2));

  // Missing corner
  const missing = createRef<Rect>();
  view.add(
    <Rect ref={missing} x={140} y={-170} width={160} height={160} radius={8}
      fill={'none'} stroke={'#30363d'} lineWidth={4} lineDash={[12, 8]} opacity={0}
    />,
  );
  yield* missing().opacity(1, 0.3);

  const noCorner = createRef<Txt>();
  view.add(<Txt ref={noCorner} text={'No 4th corner!'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={22} fontWeight={800} x={140} y={-60} opacity={0} />);
  yield* fadeIn(noCorner(), 0.2);
  yield* waitFor(0.5);

  // Explanation
  const explain = createRef<Txt>();
  view.add(
    <Txt ref={explain}
      text={'3 corners tell\nyour camera the\nQR code orientation'}
      fill={TEXT_COLOR} fontFamily={TITLE_FONT}
      fontSize={48} fontWeight={800}
      y={80} textAlign={'center'} lineHeight={66}
      opacity={0}
    />,
  );
  yield* fadeInUp(explain(), 20, 0.4);

  const detail = createRef<Txt>();
  view.add(
    <Txt ref={detail}
      text={'The 1:1:3:1:1 ratio of\nblack-white-black-white-black\nis unique and scannable\nfrom any angle'}
      fill={'#8b949e'} fontFamily={CODE_FONT}
      fontSize={24} y={300}
      textAlign={'center'} lineHeight={38}
      opacity={0}
    />,
  );
  yield* fadeIn(detail(), 0.3);

  yield* waitFor(2.5);
});
