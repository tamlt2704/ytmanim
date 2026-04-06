import {Rect, Txt, makeScene2D, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, TERMINAL_BG, TERMINAL_BORDER, CODE_FONT, TITLE_FONT, ORANGE, PURPLE} from '../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const badge = createRef<Rect>();
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const difficulty = createRef<Rect>();

  view.add(<Rect ref={badge} x={0} y={-750} width={300} height={100} radius={50} fill={ACCENT_COLOR} opacity={0} scale={0}><Txt text={'#7'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={800} /></Rect>);
  view.add(<Txt ref={title} text={'Encode/Decode'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={80} fontWeight={800} y={-580} opacity={0} />);
  view.add(<Txt ref={subtitle} text={'Serialize String List'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={44} y={-490} opacity={0} />);
  view.add(<Rect ref={difficulty} x={0} y={-430} width={180} height={44} radius={22} fill={ORANGE} opacity={0} scale={0}><Txt text={'Medium'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={24} fontWeight={700} /></Rect>);

  const boxes = createRefArray<Rect>();
  const boxSize = 75;
  const gap = 10;
  const startX = -((3 - 1) * (boxSize + gap)) / 2;
  const arrY = -200;

    view.add(
      <Rect ref={boxes} x={startX + 0 * (boxSize + gap)} y={arrY} width={boxSize} height={boxSize} radius={12} fill={TERMINAL_BG} stroke={'#30363d'} lineWidth={2} opacity={0} scale={0}>
        <Txt text={'hi'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={36} fontWeight={800} />
      </Rect>
    );
    view.add(
      <Rect ref={boxes} x={startX + 1 * (boxSize + gap)} y={arrY} width={boxSize} height={boxSize} radius={12} fill={TERMINAL_BG} stroke={'#30363d'} lineWidth={2} opacity={0} scale={0}>
        <Txt text={'bob'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={36} fontWeight={800} />
      </Rect>
    );
    view.add(
      <Rect ref={boxes} x={startX + 2 * (boxSize + gap)} y={arrY} width={boxSize} height={boxSize} radius={12} fill={TERMINAL_BG} stroke={'#30363d'} lineWidth={2} opacity={0} scale={0}>
        <Txt text={'ok'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={36} fontWeight={800} />
      </Rect>
    );

  const statusTxt = createRef<Txt>();
  view.add(<Txt ref={statusTxt} text={''} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={30} fontWeight={800} y={arrY + 90} opacity={0} />);

  const codeBox = createRef<Rect>();
  const codeLines = createRefArray<Txt>();
  view.add(
    <Rect ref={codeBox} width={900} height={394} y={320} radius={16} fill={TERMINAL_BG} stroke={TERMINAL_BORDER} lineWidth={2} opacity={0} scale={0.8} clip>
      <Rect width={900} height={44} y={-175} fill={'#21262d'}><Txt text={'Python'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={18} /></Rect>
      <Txt ref={codeLines} text={''} fill={PURPLE} fontFamily={CODE_FONT} fontSize={20} x={-410} y={-110} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={GREEN} fontFamily={CODE_FONT} fontSize={20} x={-410} y={-78} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={20} x={-410} y={-46} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={PURPLE} fontFamily={CODE_FONT} fontSize={20} x={-410} y={-14} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={20} x={-410} y={18} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={20} x={-410} y={50} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={20} x={-410} y={82} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={20} x={-410} y={114} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={20} x={-410} y={146} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={20} x={-410} y={178} offsetX={-1} opacity={0} />
    </Rect>
  );

  const tip = createRef<Txt>();
  view.add(<Txt ref={tip} text={'Length prefix avoids delimiter conflicts\nWorks with any string content 🔐'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={640} textAlign={'center'} lineHeight={46} opacity={0} />);

  // === ANIMATION ===
  yield* all(badge().opacity(1, 0.3), badge().scale(1, 0.5, easeOutCubic));
  yield* all(title().opacity(1, 0.4), title().y(-580, 0.5, easeOutCubic));
  yield* subtitle().opacity(1, 0.4);
  yield* all(difficulty().opacity(1, 0.3), difficulty().scale(1, 0.4, easeOutCubic));
  yield* waitFor(0.2);

  for (let i = 0; i < 3; i++) {
    yield* all(boxes[i].opacity(1, 0.08), boxes[i].scale(1, 0.15, easeOutCubic));
  }
  yield* statusTxt().opacity(1, 0.2);

  yield* statusTxt().text('Encode: length + delimiter', 0.3);
  yield* waitFor(0.4);
  yield* statusTxt().text(''2#hi3#bob2#ok'', 0.3);
  yield* waitFor(0.4);
  yield* statusTxt().text('Decode: read len, extract string', 0.3);
  yield* waitFor(0.4);
  yield* statusTxt().text('['hi','bob','ok'] ✅', 0.3);
  yield* statusTxt().fill(GREEN, 0.2);
  yield* waitFor(0.5);

  yield* all(codeBox().opacity(1, 0.4), codeBox().scale(1, 0.5, easeOutCubic));
  yield* all(codeLines[0].opacity(1, 0.12), codeLines[0].text('def encode(strs):', 0.2));
  yield* all(codeLines[1].opacity(1, 0.12), codeLines[1].text('    return ''.join(f'{len(s)}#{s}' for s in strs)', 0.2));
  yield* all(codeLines[2].opacity(1, 0.12), codeLines[2].text('', 0.2));
  yield* all(codeLines[3].opacity(1, 0.12), codeLines[3].text('def decode(s):', 0.2));
  yield* all(codeLines[4].opacity(1, 0.12), codeLines[4].text('    res, i = [], 0', 0.2));
  yield* all(codeLines[5].opacity(1, 0.12), codeLines[5].text('    while i < len(s):', 0.2));
  yield* all(codeLines[6].opacity(1, 0.12), codeLines[6].text('        j = s.index('#', i)', 0.2));
  yield* all(codeLines[7].opacity(1, 0.12), codeLines[7].text('        length = int(s[i:j])', 0.2));
  yield* all(codeLines[8].opacity(1, 0.12), codeLines[8].text('        res.append(s[j+1:j+1+length])', 0.2));
  yield* all(codeLines[9].opacity(1, 0.12), codeLines[9].text('        i = j + 1 + length', 0.2));

  yield* tip().opacity(1, 0.5);
  yield* waitFor(2);
});
