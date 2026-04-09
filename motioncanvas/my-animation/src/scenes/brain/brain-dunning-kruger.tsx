import {Rect, Txt, Line, Circle, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, easeInOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, CODE_FONT, TITLE_FONT} from '../../styles';
import {showThumbnail} from '../../thumbnail-intro';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  yield* showThumbnail(view, {number: '#7', topic: 'BRAIN', command: 'Dunning-Kruger', commandColor: ORANGE, emoji: '📈', subtitle: 'Why Beginners Feel SMART!'});

  const axisX = createRef<Line>();
  const axisY = createRef<Line>();
  const labelX = createRef<Txt>();
  const labelY = createRef<Txt>();
  const curve = createRef<Line>();
  const peakLabel = createRef<Txt>();
  const valleyLabel = createRef<Txt>();
  const riseLabel = createRef<Txt>();
  const peakDot = createRef<Circle>();
  const valleyDot = createRef<Circle>();
  const reveal = createRef<Txt>();
  const cta = createRef<Txt>();

  const gy = -150;

  view.add(<Line ref={axisX} points={[[-380, gy + 300], [380, gy + 300]]} stroke={'#30363d'} lineWidth={3} end={0} />);
  view.add(<Line ref={axisY} points={[[-380, gy + 300], [-380, gy - 350]]} stroke={'#30363d'} lineWidth={3} end={0} />);
  view.add(<Txt ref={labelX} text={'Knowledge →'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={24} x={200} y={gy + 350} opacity={0} />);
  view.add(<Txt ref={labelY} text={'Confidence →'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={24} x={-430} y={gy - 100} rotation={-90} opacity={0} />);

  view.add(
    <Line ref={curve} points={[[-350, gy + 250], [-200, gy - 300], [-50, gy + 200], [150, gy + 50], [350, gy - 100]]} stroke={ACCENT_COLOR} lineWidth={5} radius={80} end={0} />,
  );

  view.add(<Circle ref={peakDot} size={20} fill={RED} x={-200} y={gy - 300} opacity={0} />);
  view.add(<Txt ref={peakLabel} text={'Mt. Stupid\n"I know everything!"'} fill={RED} fontFamily={CODE_FONT} fontSize={24} x={-200} y={gy - 400} textAlign={'center'} lineHeight={34} opacity={0} />);
  view.add(<Circle ref={valleyDot} size={20} fill={ORANGE} x={-50} y={gy + 200} opacity={0} />);
  view.add(<Txt ref={valleyLabel} text={'Valley of Despair\n"I know nothing..."'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={24} x={-50} y={gy + 290} textAlign={'center'} lineHeight={34} opacity={0} />);
  view.add(<Txt ref={riseLabel} text={'Slope of\nEnlightenment 📈'} fill={GREEN} fontFamily={CODE_FONT} fontSize={24} x={280} y={gy - 180} textAlign={'center'} lineHeight={34} opacity={0} />);

  view.add(<Txt ref={reveal} text={'Beginners overestimate their skill.\nExperts underestimate theirs.\nTrue wisdom = knowing what\nyou don\'t know 🤯'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={28} y={gy + 550} textAlign={'center'} lineHeight={44} opacity={0} />);
  view.add(<Txt ref={cta} text={'Follow for more brain tricks! 🔥'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={40} y={gy + 750} opacity={0} />);

  yield* all(axisX().end(1, 0.6), axisY().end(1, 0.6));
  yield* all(labelX().opacity(1, 0.3), labelY().opacity(1, 0.3));
  yield* waitFor(0.3);

  yield* curve().end(0.3, 1, easeInOutCubic);
  yield* all(peakDot().opacity(1, 0.3), peakLabel().opacity(1, 0.4));
  yield* waitFor(1);
  yield* curve().end(0.55, 1, easeInOutCubic);
  yield* all(valleyDot().opacity(1, 0.3), valleyLabel().opacity(1, 0.4));
  yield* waitFor(1);
  yield* curve().end(1, 1, easeInOutCubic);
  yield* riseLabel().opacity(1, 0.4);
  yield* waitFor(1.5);
  yield* reveal().opacity(1, 0.6);
  yield* waitFor(1.5);
  yield* cta().opacity(1, 0.5);
  yield* waitFor(2);
});
