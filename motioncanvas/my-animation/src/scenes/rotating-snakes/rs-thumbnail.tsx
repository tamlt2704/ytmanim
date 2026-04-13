import {Rect, Txt, Circle, makeScene2D} from '@motion-canvas/2d';
import {waitFor} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, PURPLE, ORANGE, CODE_FONT, TITLE_FONT} from '../../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  view.add(<Circle size={600} fill={GREEN} opacity={0.06} y={-150} />);
  view.add(<Txt text={'🌀'} fontSize={280} y={-380} />);
  view.add(<Txt text={'5 ILLUSIONS'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={120} fontWeight={900} y={-80} letterSpacing={6} />);
  view.add(<Txt text={'THAT MOVE'} fill={GREEN} fontFamily={TITLE_FONT} fontSize={110} fontWeight={900} y={60} letterSpacing={6} />);
  view.add(<Txt text={'But nothing is moving.'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={34} y={220} />);
  view.add(
    <Rect x={350} y={-800} width={180} height={180} radius={90} fill={RED}>
      <Txt text={'30s'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={900} />
    </Rect>,
  );
  view.add(<Txt text={'👁️'} fontSize={120} y={380} />);

  yield* waitFor(2);
});
