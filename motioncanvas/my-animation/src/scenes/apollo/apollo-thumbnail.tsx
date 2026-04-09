import {Rect, Txt, Circle, makeScene2D} from '@motion-canvas/2d';
import {waitFor} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, PURPLE, ORANGE, CODE_FONT, TITLE_FONT} from '../../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  view.add(<Circle size={600} fill={RED} opacity={0.06} y={-200} />);
  view.add(<Rect width={300} height={300} x={-390} y={-810} rotation={45} fill={ORANGE} opacity={0.15} />);
  view.add(<Rect width={200} height={200} x={390} y={810} rotation={45} fill={ACCENT_COLOR} opacity={0.15} />);

  view.add(<Txt text={'📱'} fontSize={200} x={-150} y={-400} />);
  view.add(<Txt text={'VS'} fill={RED} fontFamily={TITLE_FONT} fontSize={100} fontWeight={900} y={-400} />);
  view.add(<Txt text={'🚀'} fontSize={200} x={150} y={-400} />);

  view.add(<Txt text={'YOUR'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={120} fontWeight={900} y={-180} letterSpacing={10} />);
  view.add(<Txt text={'PHONE'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={140} fontWeight={900} y={-50} letterSpacing={12} />);
  view.add(<Txt text={'vs APOLLO 11'} fill={ORANGE} fontFamily={TITLE_FONT} fontSize={100} fontWeight={900} y={90} letterSpacing={6} />);
  view.add(<Txt text={'COMPUTER'} fill={RED} fontFamily={TITLE_FONT} fontSize={120} fontWeight={900} y={220} letterSpacing={10} />);

  view.add(<Txt text={'The difference will\nblow your mind 🤯'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={32} y={380} textAlign={'center'} lineHeight={48} />);

  view.add(
    <Rect x={350} y={-800} width={180} height={180} radius={90} fill={RED}>
      <Txt text={'2m'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={900} />
    </Rect>,
  );

  yield* waitFor(3);
});
