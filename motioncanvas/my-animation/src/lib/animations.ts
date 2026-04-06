/**
 * Manim-like animation helpers for Motion Canvas.
 *
 * Usage:
 *   import {fadeIn, fadeOut, showCreate, typeText} from '../lib/animations';
 *   yield* fadeIn(myNode);
 *   yield* showCreate(myRect);
 */

import {all, waitFor, Vector2} from '@motion-canvas/core';
import {
  easeOutCubic,
  easeInCubic,
  easeInOutCubic,
  easeOutBack,
  easeOutElastic,
  easeOutBounce,
  easeInOutQuad,
  linear,
} from '@motion-canvas/core';
import {Node, Rect, Txt, Line, Circle} from '@motion-canvas/2d';
import type {View2D} from '@motion-canvas/2d';

// ─── Fade ────────────────────────────────────────────────

/** Fade in from 0 opacity. */
export function* fadeIn(node: Node, duration = 0.4) {
  node.opacity(0);
  yield* node.opacity(1, duration, easeOutCubic);
}

/** Fade out to 0 opacity. */
export function* fadeOut(node: Node, duration = 0.4) {
  yield* node.opacity(0, duration, easeInCubic);
}

/** Fade in + slide up. */
export function* fadeInUp(node: Node, distance = 60, duration = 0.5) {
  const startY = node.y() + distance;
  node.opacity(0);
  node.y(startY);
  yield* all(
    node.opacity(1, duration, easeOutCubic),
    node.y(startY - distance, duration, easeOutCubic),
  );
}

/** Fade in + slide down. */
export function* fadeInDown(node: Node, distance = 60, duration = 0.5) {
  const startY = node.y() - distance;
  node.opacity(0);
  node.y(startY);
  yield* all(
    node.opacity(1, duration, easeOutCubic),
    node.y(startY + distance, duration, easeOutCubic),
  );
}

/** Fade in from left. */
export function* fadeInLeft(node: Node, distance = 80, duration = 0.5) {
  const startX = node.x() - distance;
  node.opacity(0);
  node.x(startX);
  yield* all(
    node.opacity(1, duration, easeOutCubic),
    node.x(startX + distance, duration, easeOutCubic),
  );
}

/** Fade in from right. */
export function* fadeInRight(node: Node, distance = 80, duration = 0.5) {
  const startX = node.x() + distance;
  node.opacity(0);
  node.x(startX);
  yield* all(
    node.opacity(1, duration, easeOutCubic),
    node.x(startX - distance, duration, easeOutCubic),
  );
}

// ─── Show / Create ───────────────────────────────────────

/** Pop in from scale 0 (like Manim's ShowCreation). */
export function* showCreate(node: Node, duration = 0.5) {
  node.opacity(0);
  node.scale(0);
  yield* all(
    node.opacity(1, duration * 0.6),
    node.scale(1, duration, easeOutCubic),
  );
}

/** Pop in with overshoot bounce. */
export function* popIn(node: Node, duration = 0.5) {
  node.opacity(0);
  node.scale(0);
  yield* all(
    node.opacity(1, duration * 0.5),
    node.scale(1, duration, easeOutBack),
  );
}

/** Elastic pop in. */
export function* elasticIn(node: Node, duration = 0.8) {
  node.opacity(0);
  node.scale(0);
  yield* all(
    node.opacity(1, duration * 0.3),
    node.scale(1, duration, easeOutElastic),
  );
}

/** Bounce in. */
export function* bounceIn(node: Node, duration = 0.7) {
  node.opacity(0);
  node.scale(0);
  yield* all(
    node.opacity(1, duration * 0.3),
    node.scale(1, duration, easeOutBounce),
  );
}

/** Scale out and fade. */
export function* scaleOut(node: Node, duration = 0.4) {
  yield* all(
    node.opacity(0, duration, easeInCubic),
    node.scale(0, duration, easeInCubic),
  );
}

// ─── Text ────────────────────────────────────────────────

/** Typewriter effect for Txt nodes. */
export function* typeText(node: any, text: string, speed = 0.05) {
  for (let i = 0; i <= text.length; i++) {
    node.text(text.slice(0, i) + '\u258c');
    yield* waitFor(speed);
  }
  node.text(text);
}

/** Typewriter with cursor blink at end. */
export function* typeTextBlink(node: any, text: string, speed = 0.05, blinks = 3) {
  yield* typeText(node, text, speed);
  for (let i = 0; i < blinks; i++) {
    node.text(text + '\u258c');
    yield* waitFor(0.3);
    node.text(text);
    yield* waitFor(0.3);
  }
}

/** Reveal text with fade (no typewriter). */
export function* revealText(node: any, text: string, duration = 0.4) {
  node.text(text);
  node.opacity(0);
  yield* node.opacity(1, duration, easeOutCubic);
}

// ─── Transform ───────────────────────────────────────────

/** Slide node to a new position. */
export function* slideTo(node: Node, x: number, y: number, duration = 0.5) {
  yield* all(
    node.x(x, duration, easeInOutCubic),
    node.y(y, duration, easeInOutCubic),
  );
}

/** Slide node by a delta. */
export function* slideBy(node: Node, dx: number, dy: number, duration = 0.5) {
  yield* all(
    node.x(node.x() + dx, duration, easeInOutCubic),
    node.y(node.y() + dy, duration, easeInOutCubic),
  );
}

/** Rotate node to degrees. */
export function* rotateTo(node: Node, degrees: number, duration = 0.5) {
  yield* node.rotation(degrees, duration, easeInOutCubic);
}

/** Scale node to a target. */
export function* scaleTo(node: Node, target: number, duration = 0.4) {
  yield* node.scale(target, duration, easeOutCubic);
}

// ─── Highlight / Emphasis ────────────────────────────────

/** Pulse scale up then back (attention). */
export function* pulse(node: Node, scaleFactor = 1.2, duration = 0.3) {
  yield* node.scale(scaleFactor, duration / 2, easeOutCubic);
  yield* node.scale(1, duration / 2, easeInOutCubic);
}

/** Shake horizontally (error/attention). */
export function* shake(node: Node, distance = 20, duration = 0.4) {
  const orig = node.x();
  const step = duration / 6;
  yield* node.x(orig + distance, step, linear);
  yield* node.x(orig - distance, step, linear);
  yield* node.x(orig + distance * 0.5, step, linear);
  yield* node.x(orig - distance * 0.5, step, linear);
  yield* node.x(orig, step * 2, easeOutCubic);
}

/** Flash opacity (blink). */
export function* flash(node: Node, times = 2, duration = 0.3) {
  for (let i = 0; i < times; i++) {
    yield* node.opacity(0.2, duration / (times * 2));
    yield* node.opacity(1, duration / (times * 2));
  }
}

/** Highlight stroke color then revert. */
export function* highlightStroke(node: any, color: string, duration = 0.6) {
  const original = node.stroke();
  const originalWidth = node.lineWidth();
  yield* all(
    node.stroke(color, duration / 2),
    node.lineWidth(originalWidth + 2, duration / 2),
  );
  yield* all(
    node.stroke(original, duration / 2),
    node.lineWidth(originalWidth, duration / 2),
  );
}

// ─── Sequence Helpers ────────────────────────────────────

/** Stagger fadeIn for an array of nodes. */
export function* staggerFadeIn(nodes: Node[], delay = 0.1, duration = 0.3) {
  for (const node of nodes) node.opacity(0);
  for (const node of nodes) {
    yield* fadeIn(node, duration);
    if (delay > 0) yield* waitFor(delay);
  }
}

/** Stagger showCreate for an array of nodes. */
export function* staggerCreate(nodes: Node[], delay = 0.1, duration = 0.4) {
  for (const node of nodes) { node.opacity(0); node.scale(0); }
  for (const node of nodes) {
    yield* showCreate(node, duration);
    if (delay > 0) yield* waitFor(delay);
  }
}

/** Stagger popIn for an array of nodes. */
export function* staggerPopIn(nodes: Node[], delay = 0.08, duration = 0.4) {
  for (const node of nodes) { node.opacity(0); node.scale(0); }
  for (const node of nodes) {
    yield* popIn(node, duration);
    if (delay > 0) yield* waitFor(delay);
  }
}

/** Fade out all nodes in parallel. */
export function* fadeOutAll(nodes: Node[], duration = 0.3) {
  yield* all(...nodes.map(n => n.opacity(0, duration, easeInCubic)));
}

// ─── Line Drawing ────────────────────────────────────────

/** Animate a Line drawing from start to end. */
export function* drawLine(line: any, duration = 0.6) {
  line.end(0);
  line.opacity(1);
  yield* line.end(1, duration, easeInOutCubic);
}

/** Erase a Line from end to start. */
export function* eraseLine(line: any, duration = 0.4) {
  yield* line.end(0, duration, easeInCubic);
}

// ─── Wipe / Reveal ───────────────────────────────────────

/** Grow width from 0 (horizontal wipe). */
export function* wipeIn(node: any, targetWidth: number, duration = 0.5) {
  node.width(0);
  node.opacity(1);
  yield* node.width(targetWidth, duration, easeOutCubic);
}

/** Grow height from 0 (vertical wipe). */
export function* wipeInVertical(node: any, targetHeight: number, duration = 0.5) {
  node.height(0);
  node.opacity(1);
  yield* node.height(targetHeight, duration, easeOutCubic);
}

// ─── Color Transitions ──────────────────────────────────

/** Animate fill color change. */
export function* colorTo(node: any, color: string, duration = 0.3) {
  yield* node.fill(color, duration);
}

/** Animate stroke color change. */
export function* strokeTo(node: any, color: string, duration = 0.3) {
  yield* node.stroke(color, duration);
}

// ─── Corner / Position Helpers ───────────────────────────

// YouTube Shorts: 1080x1920
const HALF_W = 540;
const HALF_H = 960;
const MARGIN = 60;

/** Move node to upper-left corner. */
export function* toCornerUL(node: Node, duration = 0.5) {
  yield* all(
    node.x(-HALF_W + MARGIN + 50, duration, easeInOutCubic),
    node.y(-HALF_H + MARGIN + 50, duration, easeInOutCubic),
  );
}

/** Move node to upper-right corner. */
export function* toCornerUR(node: Node, duration = 0.5) {
  yield* all(
    node.x(HALF_W - MARGIN - 50, duration, easeInOutCubic),
    node.y(-HALF_H + MARGIN + 50, duration, easeInOutCubic),
  );
}

/** Move node to lower-left corner. */
export function* toCornerLL(node: Node, duration = 0.5) {
  yield* all(
    node.x(-HALF_W + MARGIN + 50, duration, easeInOutCubic),
    node.y(HALF_H - MARGIN - 50, duration, easeInOutCubic),
  );
}

/** Move node to lower-right corner. */
export function* toCornerLR(node: Node, duration = 0.5) {
  yield* all(
    node.x(HALF_W - MARGIN - 50, duration, easeInOutCubic),
    node.y(HALF_H - MARGIN - 50, duration, easeInOutCubic),
  );
}

/** Move node to top-center edge. */
export function* toEdgeTop(node: Node, duration = 0.5) {
  yield* node.y(-HALF_H + MARGIN + 50, duration, easeInOutCubic);
}

/** Move node to bottom-center edge. */
export function* toEdgeBottom(node: Node, duration = 0.5) {
  yield* node.y(HALF_H - MARGIN - 50, duration, easeInOutCubic);
}

/** Move node to left-center edge. */
export function* toEdgeLeft(node: Node, duration = 0.5) {
  yield* node.x(-HALF_W + MARGIN + 50, duration, easeInOutCubic);
}

/** Move node to right-center edge. */
export function* toEdgeRight(node: Node, duration = 0.5) {
  yield* node.x(HALF_W - MARGIN - 50, duration, easeInOutCubic);
}

/** Move node to center. */
export function* toCenter(node: Node, duration = 0.5) {
  yield* all(
    node.x(0, duration, easeInOutCubic),
    node.y(0, duration, easeInOutCubic),
  );
}

// ─── Axes / Coordinate System ────────────────────────────

export interface AxisConfig {
  view: View2D;
  originX?: number;
  originY?: number;
  xLen?: number;
  yLen?: number;
  color?: string;
  lineWidth?: number;
  tickSpacing?: number;
  tickSize?: number;
  showLabels?: boolean;
  labelFont?: string;
  labelSize?: number;
  labelColor?: string;
  arrowSize?: number;
}

export interface AxisRefs {
  xAxis: Line;
  yAxis: Line;
  ticks: Line[];
  labels: Txt[];
  group: Node;
}

/** Add X/Y axes to the view and return refs. */
export function addAxes(config: AxisConfig): AxisRefs {
  const {
    view,
    originX = 0,
    originY = 0,
    xLen = 700,
    yLen = 500,
    color = '#30363d',
    lineWidth = 3,
    tickSpacing = 100,
    tickSize = 10,
    showLabels = true,
    labelFont = 'JetBrains Mono, monospace',
    labelSize = 18,
    labelColor = '#8b949e',
    arrowSize = 12,
  } = config;

  const group = new Node({});
  group.opacity(0);
  view.add(group);

  // X axis
  const xAxis = new Line({
    points: [
      [originX - xLen / 2, originY],
      [originX + xLen / 2, originY],
    ],
    stroke: color,
    lineWidth,
    endArrow: true,
    arrowSize,
    end: 0,
  });
  group.add(xAxis);

  // Y axis
  const yAxis = new Line({
    points: [
      [originX, originY + yLen / 2],
      [originX, originY - yLen / 2],
    ],
    stroke: color,
    lineWidth,
    endArrow: true,
    arrowSize,
    end: 0,
  });
  group.add(yAxis);

  const ticks: Line[] = [];
  const labels: Txt[] = [];

  // X ticks
  const xStart = originX - xLen / 2 + tickSpacing;
  const xEnd = originX + xLen / 2;
  let labelVal = 1;
  for (let x = xStart; x < xEnd; x += tickSpacing) {
    const tick = new Line({
      points: [[x, originY - tickSize], [x, originY + tickSize]],
      stroke: color,
      lineWidth: 2,
      opacity: 0,
    });
    group.add(tick);
    ticks.push(tick);

    if (showLabels) {
      const lbl = new Txt({
        text: `${labelVal}`,
        x,
        y: originY + tickSize + 18,
        fill: labelColor,
        fontFamily: labelFont,
        fontSize: labelSize,
        opacity: 0,
      });
      group.add(lbl);
      labels.push(lbl);
    }
    labelVal++;
  }

  // Y ticks
  const yStart = originY + yLen / 2 - tickSpacing;
  const yEnd = originY - yLen / 2;
  labelVal = 1;
  for (let y = yStart; y > yEnd; y -= tickSpacing) {
    const tick = new Line({
      points: [[originX - tickSize, y], [originX + tickSize, y]],
      stroke: color,
      lineWidth: 2,
      opacity: 0,
    });
    group.add(tick);
    ticks.push(tick);

    if (showLabels) {
      const lbl = new Txt({
        text: `${labelVal}`,
        x: originX - tickSize - 22,
        y,
        fill: labelColor,
        fontFamily: labelFont,
        fontSize: labelSize,
        opacity: 0,
      });
      group.add(lbl);
      labels.push(lbl);
    }
    labelVal++;
  }

  return {xAxis, yAxis, ticks, labels, group};
}

/** Animate axes drawing in. */
export function* drawAxes(refs: AxisRefs, duration = 0.8) {
  refs.group.opacity(1);
  yield* all(
    refs.xAxis.end(1, duration, easeOutCubic),
    refs.yAxis.end(1, duration, easeOutCubic),
  );
  // Stagger ticks
  for (const tick of refs.ticks) {
    yield* tick.opacity(1, 0.05);
  }
  // Stagger labels
  for (const lbl of refs.labels) {
    yield* lbl.opacity(1, 0.05);
  }
}

/** Fade out axes. */
export function* hideAxes(refs: AxisRefs, duration = 0.4) {
  yield* refs.group.opacity(0, duration, easeInCubic);
}

// ─── Graph / Plot Helpers ────────────────────────────────

export interface PlotPointConfig {
  view: View2D;
  x: number;
  y: number;
  radius?: number;
  color?: string;
}

/** Add a plot point (circle) to the view. */
export function addPoint(config: PlotPointConfig): Circle {
  const {view, x, y, radius = 8, color = '#58a6ff'} = config;
  const pt = new Circle({
    x, y, size: radius * 2,
    fill: color,
    opacity: 0,
    scale: 0,
  });
  view.add(pt);
  return pt;
}

/** Add a line segment between two points. */
export function addSegment(
  view: View2D,
  x1: number, y1: number,
  x2: number, y2: number,
  color = '#58a6ff',
  width = 3,
): Line {
  const seg = new Line({
    points: [[x1, y1], [x2, y2]],
    stroke: color,
    lineWidth: width,
    end: 0,
    opacity: 1,
  });
  view.add(seg);
  return seg;
}

// ─── Arrow ───────────────────────────────────────────────

/** Add an arrow between two points. */
export function addArrow(
  view: View2D,
  from: [number, number],
  to: [number, number],
  color = '#58a6ff',
  width = 3,
  arrowSize = 12,
): Line {
  const arrow = new Line({
    points: [from, to],
    stroke: color,
    lineWidth: width,
    endArrow: true,
    arrowSize,
    end: 0,
    opacity: 1,
  });
  view.add(arrow);
  return arrow;
}

/** Animate arrow drawing. */
export function* drawArrow(arrow: Line, duration = 0.5) {
  yield* arrow.end(1, duration, easeOutCubic);
}

// ─── Grid ────────────────────────────────────────────────

/** Add a background grid. */
export function addGrid(
  view: View2D,
  cols: number,
  rows: number,
  cellSize = 100,
  originX = 0,
  originY = 0,
  color = '#21262d',
  width = 1,
): Line[] {
  const lines: Line[] = [];
  const w = cols * cellSize;
  const h = rows * cellSize;
  const left = originX - w / 2;
  const top = originY - h / 2;

  // Vertical lines
  for (let i = 0; i <= cols; i++) {
    const x = left + i * cellSize;
    const l = new Line({
      points: [[x, top], [x, top + h]],
      stroke: color, lineWidth: width, opacity: 0,
    });
    view.add(l);
    lines.push(l);
  }
  // Horizontal lines
  for (let j = 0; j <= rows; j++) {
    const y = top + j * cellSize;
    const l = new Line({
      points: [[left, y], [left + w, y]],
      stroke: color, lineWidth: width, opacity: 0,
    });
    view.add(l);
    lines.push(l);
  }
  return lines;
}

/** Fade in grid lines. */
export function* showGrid(lines: Line[], duration = 0.5) {
  yield* all(...lines.map(l => l.opacity(1, duration, easeOutCubic)));
}

// ─── Bar Chart ───────────────────────────────────────────

export interface BarChartConfig {
  view: View2D;
  values: number[];
  barWidth?: number;
  gap?: number;
  maxHeight?: number;
  baseY?: number;
  colors?: string[];
  defaultColor?: string;
}

/** Add bar chart rectangles. Returns array of Rect refs. */
export function addBarChart(config: BarChartConfig): Rect[] {
  const {
    view, values,
    barWidth = 50, gap = 14,
    maxHeight = 300, baseY = 0,
    colors, defaultColor = '#58a6ff',
  } = config;
  const maxVal = Math.max(...values);
  const startX = -((values.length - 1) * (barWidth + gap)) / 2;
  const bars: Rect[] = [];

  for (let i = 0; i < values.length; i++) {
    const h = (values[i] / maxVal) * maxHeight;
    const color = colors ? colors[i % colors.length] : defaultColor;
    const bar = new Rect({
      x: startX + i * (barWidth + gap),
      y: baseY - h / 2,
      width: barWidth,
      height: h,
      radius: 6,
      fill: color,
      opacity: 0,
      scale: 0,
    });
    view.add(bar);
    bars.push(bar);
  }
  return bars;
}

/** Animate bars growing in. */
export function* growBars(bars: Rect[], delay = 0.08, duration = 0.3) {
  for (const bar of bars) {
    yield* all(
      bar.opacity(1, duration * 0.5),
      bar.scale(1, duration, easeOutCubic),
    );
    if (delay > 0) yield* waitFor(delay);
  }
}

// ─── Label / Badge ───────────────────────────────────────

/** Add a rounded badge with text. */
export function addBadge(
  view: View2D,
  text: string,
  x = 0, y = 0,
  bgColor = '#58a6ff',
  textColor = '#fff',
  fontSize = 24,
  paddingX = 30,
  paddingY = 12,
): Rect {
  const badge = new Rect({
    x, y,
    width: text.length * fontSize * 0.6 + paddingX * 2,
    height: fontSize + paddingY * 2,
    radius: (fontSize + paddingY * 2) / 2,
    fill: bgColor,
    opacity: 0,
    scale: 0,
  });
  badge.add(new Txt({
    text,
    fill: textColor,
    fontFamily: 'JetBrains Mono, monospace',
    fontSize,
    fontWeight: 700,
  }));
  view.add(badge);
  return badge;
}

// ─── Connector / Bracket ─────────────────────────────────

/** Add a curved connector between two points. */
export function addCurvedArrow(
  view: View2D,
  from: [number, number],
  to: [number, number],
  curve = 80,
  color = '#58a6ff',
  width = 3,
): Line {
  const midX = (from[0] + to[0]) / 2;
  const midY = (from[1] + to[1]) / 2 - curve;
  const arrow = new Line({
    points: [from, [midX, midY], to],
    stroke: color,
    lineWidth: width,
    endArrow: true,
    arrowSize: 10,
    radius: curve,
    end: 0,
    opacity: 1,
  });
  view.add(arrow);
  return arrow;
}

// ─── Number Line ─────────────────────────────────────────

/** Add a horizontal number line. */
export function addNumberLine(
  view: View2D,
  min: number,
  max: number,
  y = 0,
  width = 800,
  color = '#30363d',
  labelColor = '#8b949e',
  fontSize = 20,
): {line: Line; labels: Txt[]; xForVal: (v: number) => number} {
  const left = -width / 2;
  const right = width / 2;
  const line = new Line({
    points: [[left, y], [right, y]],
    stroke: color,
    lineWidth: 3,
    endArrow: true,
    arrowSize: 10,
    opacity: 0,
    end: 0,
  });
  view.add(line);

  const labels: Txt[] = [];
  const range = max - min;
  for (let v = min; v <= max; v++) {
    const x = left + ((v - min) / range) * width;
    const tick = new Line({
      points: [[x, y - 8], [x, y + 8]],
      stroke: color, lineWidth: 2, opacity: 0,
    });
    view.add(tick);
    const lbl = new Txt({
      text: `${v}`, x, y: y + 24,
      fill: labelColor,
      fontFamily: 'JetBrains Mono, monospace',
      fontSize, opacity: 0,
    });
    view.add(lbl);
    labels.push(lbl);
  }

  const xForVal = (v: number) => left + ((v - min) / range) * width;
  return {line, labels, xForVal};
}

/** Animate number line drawing. */
export function* drawNumberLine(refs: {line: Line; labels: Txt[]}, duration = 0.6) {
  yield* all(
    refs.line.opacity(1, 0.1),
    refs.line.end(1, duration, easeOutCubic),
  );
  for (const lbl of refs.labels) {
    yield* lbl.opacity(1, 0.04);
  }
}
