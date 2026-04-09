import {Rect, Txt, Circle, makeScene2D} from '@motion-canvas/2d';
import {waitFor} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, PURPLE, ORANGE, CODE_FONT, TITLE_FONT} from '../../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  view.add(<Circle size={600} fill={GREEN} opacity={0.06} y={-200} />);
  view.add(<Rect width={300} height={300} x={-390} y={-810} rotation={45} fill={ORANGE} opacity={0.15} />);
  view.add(<Rect width={200} height={200} x={390} y={810} rotation={45} fill={PURPLE} opacity={0.15} />);

  view.add(<Txt text={'💰'} fontSize={280} y={-380} />);
  view.add(<Txt text={'HOW MUCH'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={110} fontWeight={900} y={-140} letterSpacing={8} />);
  view.add(<Txt text={'CEOs MAKE'} fill={GREEN} fontFamily={TITLE_FONT} fontSize={120} fontWeight={900} y={0} letterSpacing={8} />);
  view.add(<Txt text={'PER SECOND'} fill={RED} fontFamily={TITLE_FONT} fontSize={120} fontWeight={900} y={140} letterSpacing={8} />);
  view.add(<Txt text={'vs your salary 😳'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={34} y={290} />);

  view.add(
    <Rect x={350} y={-800} width={180} height={180} radius={90} fill={RED}>
      <Txt text={'2m'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={900} />
    </Rect>,
  );

  yield* waitFor(3);
});
