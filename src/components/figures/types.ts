/**
 * The shared drawing vocabulary for the landscape and the orbit band.
 *
 * Every figure is built once, as a component, and dropped into a composition
 * inside a plain translate/scale wrapper. That matters: the skeleton below is
 * drawn at a single canonical size, so one set of joint origins and one set of
 * keyframes in `src/styles/scene.css` drives every placement. Do not respell a
 * figure inline — extend its component.
 *
 * FIGURE SKELETON (local units, feet on the origin, side view facing +x):
 *
 *     ground   0        hip      -13.2      elbow  -16.8
 *     ankle   -1.6      shoulder -21.6      wrist  -12.0
 *     knee    -7.2      neck     -22.8      head c -24.8 (r 2.2)
 *
 * Limbs are two-segment chains — thigh/shin/foot, upper arm/forearm — each
 * segment a nested <g> that rotates about the joint above it. scene.css names
 * those origins once; they only hold because every figure shares the skeleton.
 *
 * SVG transform note: a CSS `transform` overrides an element's `transform`
 * ATTRIBUTE. Anything animated is therefore a child of a plain positioning
 * <g transform="translate(…)">, never the positioned element itself — which is
 * why `Place` exists rather than every figure taking x/y props of its own.
 */

/** A mountain skyline, left to right. Authored as a polyline: at this distance
 *  a range reads as an angular silhouette, and curves read as hills. */
export type Ridge = readonly (readonly [number, number])[];

/** A conifer on a ridge: [x, baselineY, height]. */
export type TreeSpec = readonly [x: number, y: number, height: number];

/**
 * Which figure a hover card belongs to. The key appears on the SVG group as
 * `data-spot` and on the card as `data-card`; the hover layer routes between
 * them by this value, so a typo here is a build error rather than a card that
 * silently never opens.
 */
export type SpotKey =
  | "leopardsat"
  | "habsat"
  | "cubesats"
  | "climbing"
  | "fishing"
  | "golf"
  | "hiking";

/** Which side of the figure a card should open on. */
export type SpotPlacement = "above" | "below";

/** Rounds to one decimal, the precision the hand-authored path data uses. */
export const r1 = (n: number): number => Math.round(n * 10) / 10;

/**
 * How far up a cliff's local frame must run to cover `height` on screen.
 *
 * The wall is drawn in a frame rotated 15 degrees off vertical, so a local y
 * contributes only `y * cos(15°)` of screen height. A caller that knows how tall
 * its own frame is uses this to work out where the arete has to end.
 */
export const areteTopFor = (height: number): number =>
  -Math.ceil(height / Math.cos((15 * Math.PI) / 180));

/** A point in a composition's own viewBox units. */
export type Pt = readonly [number, number];

/**
 * Catmull-Rom through the given points, emitted as cubic beziers.
 *
 * Hand-authoring control points for a winding river bank or a footpath is a poor
 * use of anyone's time and impossible to adjust later: move one point and every
 * neighbouring handle needs redoing. A spline takes the points you actually care
 * about — where the water bends, where the path crosses a ridge — and produces
 * the curve through them.
 *
 * Returns only the `C` segments, with no leading `M`, so two runs can be joined
 * into one closed shape: a river is its left bank, a line across the head, and
 * its right bank walked back.
 */
export function smoothSegments(points: readonly Pt[]): string {
  if (points.length < 2) return "";

  const at = (i: number): Pt =>
    points[Math.min(Math.max(i, 0), points.length - 1)]!;
  const r = (n: number) => Math.round(n * 10) / 10;
  const out: string[] = [];

  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = at(i - 1);
    const [x1, y1] = at(i);
    const [x2, y2] = at(i + 1);
    const [x3, y3] = at(i + 2);

    // The 1/6 tension is the standard uniform Catmull-Rom to Bezier conversion.
    out.push(
      `C ${r(x1 + (x2 - x0) / 6)} ${r(y1 + (y2 - y0) / 6)}, ` +
        `${r(x2 - (x3 - x1) / 6)} ${r(y2 - (y3 - y1) / 6)}, ` +
        `${r(x2)} ${r(y2)}`,
    );
  }

  return out.join(" ");
}

/** `smoothSegments`, with the opening `M` — for an open path such as a track. */
export function smoothPath(points: readonly Pt[]): string {
  const [x, y] = points[0]!;
  return `M ${x} ${y} ${smoothSegments(points)}`;
}

/**
 * A receding channel, from a centreline and a half-width at each station.
 *
 * Both banks come from the same list, which is what keeps a river symmetrical
 * about its own course while it narrows into the distance — describing the two
 * banks separately means every edit has to be made twice and they drift apart.
 */
export function channel(
  stations: readonly { y: number; cx: number; hw: number }[],
): string {
  const left: Pt[] = stations.map((s): Pt => [s.cx - s.hw, s.y]);
  const right: Pt[] = stations.map((s): Pt => [s.cx + s.hw, s.y]).reverse();
  const head = right[0]!;
  return (
    `M ${left[0]![0]} ${left[0]![1]} ${smoothSegments(left)} ` +
    `L ${head[0]} ${head[1]} ${smoothSegments(right)} Z`
  );
}
