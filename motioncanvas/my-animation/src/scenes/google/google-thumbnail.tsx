import {Rect, Txt, Circle, makeScene2D} from '@motion-canvas/2d';
import {waitFor} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, PURPLE, ORANGE, CODE_FONT, TITLE_FONT} from '../../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  view.add(<Circle size={600} fill={ACCENT_COLOR} opacity={0.08} y={-200} />);
  view.add(<Rect width={300} height={300} x={-390} y={-810} rotation={45} fill={RED} opacity={0.15} />);
  view.add(<Rect width={200} height={200} x={390} y={810} rotation={45} fill={GREEN} opacity={0.15} />);
  view.add(<Txt text={'🔍'} fontSize={280} y={-380} />);
  view.add(<Txt text={"YOU'RE"} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={130} fontWeight={900} y={-130} letterSpacing={10} />);
  view.add(<Txt text={'USING'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={130} fontWeight={900} y={10} letterSpacing={10} />);
  view.add(<Txt text={'GOOGLE'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={140} fontWeight={900} y={160} letterSpacing={12} />);
  view.add(<Txt text={'WRONG'} fill={RED} fontFamily={TITLE_FONT} fontSize={160} fontWeight={900} y={320} letterSpacing={14} />);
  view.add(
    <Rect x={350} y={-800} width={180} height={180} radius={90} fill={RED}>
      <Txt text={'2m'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={900} />
    </Rect>,
  );
  view.add(<Txt text={'10 tricks nobody taught you'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={30} y={470} />);

  yield* waitFor(2);
});
