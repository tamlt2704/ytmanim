import {Rect, Txt, Circle, makeScene2D} from '@motion-canvas/2d';
import {waitFor} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, PURPLE, ORANGE, CODE_FONT, TITLE_FONT} from '../../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  view.add(<Circle size={600} fill={PURPLE} opacity={0.06} y={-150} />);
  view.add(<Rect width={300} height={300} x={-390} y={-810} rotation={45} fill={ACCENT_COLOR} opacity={0.15} />);
  view.add(<Rect width={200} height={200} x={390} y={810} rotation={45} fill={GREEN} opacity={0.15} />);

  // Mini QR pattern
  const qrSize = 28;
  const qrGap = 32;
  const qrX = 0;
  const qrY = -420;
  const pattern = [
    1,1,1,0,1,0,1,1,1,
    1,0,1,0,0,0,1,0,1,
    1,1,1,0,1,0,1,1,1,
    0,0,0,0,1,0,0,0,0,
    1,0,1,1,0,1,1,0,1,
    0,0,0,0,1,0,0,0,0,
    1,1,1,0,0,0,1,1,1,
    1,0,1,0,1,0,1,0,1,
    1,1,1,0,1,0,1,1,1,
  ];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const on = pattern[r * 9 + c];
      view.add(
        <Rect
          x={qrX - 4 * qrGap + c * qrGap}
          y={qrY - 4 * qrGap + r * qrGap}
          width={qrSize} height={qrSize} radius={4}
          fill={on ? TEXT_COLOR : '#21262d'}
        />,
      );
    }
  }

  view.add(<Txt text={'HOW'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={120} fontWeight={900} y={-60} />);
  view.add(<Txt text={'QR CODES'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={110} fontWeight={900} y={70} letterSpacing={6} />);
  view.add(<Txt text={'WORK'} fill={GREEN} fontFamily={TITLE_FONT} fontSize={120} fontWeight={900} y={200} />);
  view.add(<Txt text={'Decoded pixel by pixel'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={30} y={320} />);

  view.add(
    <Rect x={350} y={-800} width={180} height={180} radius={90} fill={RED}>
      <Txt text={'2m'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={900} />
    </Rect>,
  );

  yield* waitFor(3);
});
