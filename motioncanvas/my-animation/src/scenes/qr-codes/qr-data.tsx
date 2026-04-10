import {Rect, Txt, Line, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack, easeOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(
    <Txt ref={title}
      text={'Data\nEncoding'}
      fill={ACCENT_COLOR} fontFamily={TITLE_FONT}
      fontSize={80} fontWeight={900}
      y={-780} textAlign={'center'} lineHeight={90}
      opacity={0}
    />,
  );
  yield* fadeInUp(title(), 30, 0.4);

  // Step 1: Text
  const step1Label = createRef<Txt>();
  view.add(<Txt ref={step1Label} text={'① Your text'} fill={GREEN} fontFamily={CODE_FONT} fontSize={40} fontWeight={800} y={-610} opacity={0} />);
  yield* fadeIn(step1Label(), 0.2);

  const textBox = createRef<Rect>();
  view.add(
    <Rect ref={textBox} width={380} height={70} radius={16} fill={GREEN + '15'} stroke={GREEN} lineWidth={3} y={-540} opacity={0} scale={0}>
      <Txt text={'Hi!'} fill={GREEN} fontFamily={CODE_FONT} fontSize={44} fontWeight={900} />
    </Rect>,
  );
  yield* all(textBox().opacity(1, 0.2), textBox().scale(1, 0.3, easeOutBack));
  yield* waitFor(0.8);

  // Arrow
  const arrow1 = createRef<Line>();
  view.add(<Line ref={arrow1} points={[[0, -500], [0, -470]]} stroke={'#30363d'} lineWidth={3} endArrow arrowSize={10} end={0} />);
  yield* arrow1().end(1, 0.2, easeOutCubic);

  // Step 2: ASCII
  const step2Label = createRef<Txt>();
  view.add(<Txt ref={step2Label} text={'② ASCII numbers'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={40} fontWeight={800} y={-440} opacity={0} />);
  yield* fadeIn(step2Label(), 0.2);

  const asciiBox = createRef<Rect>();
  view.add(
    <Rect ref={asciiBox} width={380} height={70} radius={16} fill={ORANGE + '15'} stroke={ORANGE} lineWidth={3} y={-370} opacity={0} scale={0}>
      <Txt text={'72  105  33'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={40} fontWeight={900} />
    </Rect>,
  );
  yield* all(asciiBox().opacity(1, 0.2), asciiBox().scale(1, 0.3, easeOutBack));
  yield* waitFor(0.8);

  // Arrow
  const arrow2 = createRef<Line>();
  view.add(<Line ref={arrow2} points={[[0, -330], [0, -300]]} stroke={'#30363d'} lineWidth={3} endArrow arrowSize={10} end={0} />);
  yield* arrow2().end(1, 0.2, easeOutCubic);

  // Step 3: Binary
  const step3Label = createRef<Txt>();
  view.add(<Txt ref={step3Label} text={'③ Binary'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={40} fontWeight={800} y={-270} opacity={0} />);
  yield* fadeIn(step3Label(), 0.2);

  const binBox = createRef<Rect>();
  view.add(
    <Rect ref={binBox} width={440} height={70} radius={16} fill={PURPLE + '15'} stroke={PURPLE} lineWidth={3} y={-200} opacity={0} scale={0}>
      <Txt text={'01001000 01101001 00100001'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={32} fontWeight={900} />
    </Rect>,
  );
  yield* all(binBox().opacity(1, 0.2), binBox().scale(1, 0.3, easeOutBack));
  yield* waitFor(0.8);

  // Arrow
  const arrow3 = createRef<Line>();
  view.add(<Line ref={arrow3} points={[[0, -160], [0, -130]]} stroke={'#30363d'} lineWidth={3} endArrow arrowSize={10} end={0} />);
  yield* arrow3().end(1, 0.2, easeOutCubic);

  // Step 4: Modules (pixels)
  const step4Label = createRef<Txt>();
  view.add(<Txt ref={step4Label} text={'④ Black & white modules'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={40} fontWeight={800} y={-100} opacity={0} />);
  yield* fadeIn(step4Label(), 0.2);

  // Show binary as colored squares
  const bits = '010010000110100100100001';
  const modSize = 18;
  const modGap = 20;
  const startX = -((bits.length - 1) * modGap) / 2;
  for (let i = 0; i < bits.length; i++) {
    const mod = createRef<Rect>();
    view.add(
      <Rect ref={mod}
        x={startX + i * modGap} y={-30}
        width={modSize} height={modSize} radius={3}
        fill={bits[i] === '1' ? TEXT_COLOR : '#21262d'}
        opacity={0}
      />,
    );
    yield* mod().opacity(1, 0.03);
  }

  yield* waitFor(0.5);

  const explain = createRef<Txt>();
  view.add(
    <Txt ref={explain}
      text={'1 = black module\n0 = white module\nThat simple!'}
      fill={TEXT_COLOR} fontFamily={TITLE_FONT}
      fontSize={44} fontWeight={800}
      y={100} textAlign={'center'} lineHeight={62}
      opacity={0}
    />,
  );
  yield* fadeInUp(explain(), 20, 0.4);

  yield* waitFor(2.5);
});
