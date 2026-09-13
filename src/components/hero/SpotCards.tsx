import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { SpotKey } from "../figures/types";

/**
 * Hover cards for the figure spots — the only interactive component on the site,
 * and the only one that ships JavaScript.
 *
 * The division of labour matters. The SVG scene is rendered by Astro and is
 * static HTML: it costs nothing at runtime, and there is no world in which a
 * landscape needs to re-render. This component owns only the card layer sitting
 * over it, and reaches into the scene to bind pointer listeners and to mark the
 * hovered figure. That is why it queries the DOM rather than receiving the
 * figures as children — they are not React's to own.
 *
 * The card is positioned from script rather than in CSS because it is anchored
 * to a figure inside a viewBox that scales with the viewport: the only reliable
 * place to ask where the climber currently is on screen is the DOM.
 *
 * Every lookup is scoped to the enclosing `.mg-spotframe`. There is one frame
 * today — the hero, which carries the orbit band and the panorama under it — but
 * the scoping is what would keep a second band from reaching into this one.
 */

export interface SpotCard {
  key: SpotKey;
  title: string;
  text: string;
  image?: string | undefined;
  href?: string | undefined;
}

interface Props {
  spots: SpotCard[];
}

/**
 * The frame this layer belongs to.
 *
 * Resolved with `closest` rather than `parentElement`: Astro renders a hydrated
 * component inside an `<astro-island>` wrapper, so the layer's parent is that
 * wrapper and not the hero section. Walking up by class is correct whatever
 * wraps us, and it is what scopes every lookup below to one frame.
 */
const FRAME = ".mg-spotframe";

/** Between the card and the figure it names. */
const GAP = 14;
/** Smallest gap the card may leave at the frame's edge. */
const EDGE = 12;

export default function SpotCards({ spots }: Props) {
  const layerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef(new Map<SpotKey, HTMLElement | null>());

  const [active, setActive] = useState<SpotKey | null>(null);
  /** Keys whose photo failed to load, so the card collapses to text. */
  const [broken, setBroken] = useState<ReadonlySet<SpotKey>>(new Set());

  /** The element the open card is anchored to. Not state: it never renders. */
  const anchorRef = useRef<SVGGraphicsElement | null>(null);

  /**
   * Places the open card against its figure.
   *
   * Placement goes through left/top, not transform: the card's transform is
   * already spoken for by the entrance lift, and having both write it means
   * whichever lands second wins.
   */
  const place = useCallback(() => {
    const anchor = anchorRef.current;
    const layer = layerRef.current;
    if (!anchor || !layer || !active) return;

    const card = cardRefs.current.get(active);
    const frame = layer.closest(FRAME);
    if (!card || !frame) return;

    const box = anchor.getBoundingClientRect();
    const rect = frame.getBoundingClientRect();
    const w = card.offsetWidth;
    const h = card.offsetHeight;

    // Centred on the figure, then pulled back inside the frame.
    let x = box.left + box.width / 2 - w / 2 - rect.left;
    x = Math.max(EDGE, Math.min(x, rect.width - w - EDGE));

    /* Above the figure by default — figures low in the frame have room above
       them. Spots that ask for `below` are the ones near the top, where "above"
       would put the card outside the frame entirely. Either way it is clamped
       back in, so a figure that runs the full height still lands. */
    const below = anchor.dataset.place === "below";
    let y = below ? box.bottom + GAP - rect.top : box.top - h - GAP - rect.top;
    if (y < EDGE) y = box.bottom + GAP - rect.top;
    if (y + h > rect.height - EDGE)
      y = Math.max(EDGE, box.top - h - GAP - rect.top);
    y = Math.max(EDGE, Math.min(y, rect.height - h - EDGE));

    card.style.left = `${Math.round(x)}px`;
    card.style.top = `${Math.round(y)}px`;
  }, [active]);

  /* Bind the scene. The figures are static markup owned by Astro, so this is a
     subscription to them rather than a render of them. */
  useEffect(() => {
    const frame = layerRef.current?.closest(FRAME);
    if (!frame) return;

    const figures = Array.from(
      frame.querySelectorAll<SVGGraphicsElement>(".mg-spot"),
    );
    if (figures.length === 0) return;

    const open = (figure: SVGGraphicsElement) => {
      const key = figure.dataset.spot as SpotKey | undefined;
      if (!key) return;
      anchorRef.current = figure;
      setActive(key);
    };

    const close = () => {
      anchorRef.current = null;
      setActive(null);
    };

    const cleanups: Array<() => void> = [];

    for (const figure of figures) {
      const hit = figure.querySelector<SVGRectElement>(".mg-spot__hit");
      if (!hit) continue;

      const onEnter = (e: PointerEvent) => {
        if (e.pointerType === "mouse") open(figure);
      };
      const onLeave = (e: PointerEvent) => {
        if (e.pointerType === "mouse") close();
      };
      // Touch has no hover, so a tap toggles.
      const onDown = (e: PointerEvent) => {
        if (e.pointerType === "mouse") return;
        if (anchorRef.current === figure) close();
        else open(figure);
      };

      hit.addEventListener("pointerenter", onEnter);
      hit.addEventListener("pointerleave", onLeave);
      hit.addEventListener("pointerdown", onDown);

      cleanups.push(() => {
        hit.removeEventListener("pointerenter", onEnter);
        hit.removeEventListener("pointerleave", onLeave);
        hit.removeEventListener("pointerdown", onDown);
      });
    }

    /* A pointer down anywhere outside a hit box closes the card — including one
       inside another frame, which is what would stop two frames from holding a
       card open at once. */
    const onDocDown = (e: PointerEvent) => {
      if (!(e.target instanceof Element)) return;
      if (!e.target.closest(".mg-spot__hit")) close();
    };
    document.addEventListener("pointerdown", onDocDown);
    cleanups.push(() => document.removeEventListener("pointerdown", onDocDown));

    return () => cleanups.forEach((fn) => fn());
  }, []);

  /* Reflect the open card back onto the scene: the hovered figure keeps its
     weight and everything else falls back. Emphasis is subtraction — the active
     figure flaring would shift the whole scene's brightness.

     Every copy of the figure is marked, not just the hovered one: both layouts
     draw the same spot keys, the hidden one costs nothing, and the state then
     stays correct across a resize that swaps which layout is up. */
  useEffect(() => {
    const frame = layerRef.current?.closest(FRAME);
    if (!frame) return;

    frame.classList.toggle("is-showing", active !== null);
    frame.classList.toggle(
      "is-paused",
      anchorRef.current?.dataset.pause === "orbit",
    );

    for (const figure of frame.querySelectorAll<SVGGraphicsElement>(
      ".mg-spot",
    )) {
      figure.classList.toggle(
        "is-active",
        active !== null && figure.dataset.spot === active,
      );
    }
  }, [active]);

  // Position before paint, so the card never shows up in the wrong place first.
  useLayoutEffect(place, [place]);

  /* The card is pinned to a figure whose screen position depends on the
     viewport, so anything that moves the scene has to move the card with it. */
  useEffect(() => {
    if (!active) return;
    const onMove = () => place();
    window.addEventListener("resize", onMove, { passive: true });
    window.addEventListener("scroll", onMove, { passive: true });
    return () => {
      window.removeEventListener("resize", onMove);
      window.removeEventListener("scroll", onMove);
    };
  }, [active, place]);

  return (
    <div
      ref={layerRef}
      className="mg-spots pointer-events-none absolute inset-0 z-30 overflow-hidden"
      aria-hidden="true"
    >
      {spots.map((spot) => {
        const isOpen = active === spot.key;
        const showImage = spot.image && !broken.has(spot.key);

        return (
          <figure
            key={spot.key}
            ref={(el) => {
              cardRefs.current.set(spot.key, el);
            }}
            data-card={spot.key}
            data-open={isOpen ? "" : undefined}
            /* Never takes the pointer: the card can then open directly under the
               cursor without stealing the hover that opened it. `visibility`
               rides the fade so a closed card is not a tab stop or a hit target. */
            className={[
              "absolute top-0 left-0 m-0 w-[min(19rem,68vw)] overflow-hidden p-0",
              "rounded-[--radius-md] border border-accent-line bg-bg-raised",
              "shadow-[0_14px_34px_rgb(0_0_0/38%)]",
              "invisible translate-y-1.5 opacity-0",
              "transition-[opacity,transform,visibility] duration-200 ease-mg",
              "data-open:visible data-open:translate-y-0 data-open:opacity-100",
              "motion-reduce:translate-y-0 motion-reduce:duration-[1ms]",
            ].join(" ")}
          >
            {showImage ? (
              /* `contain`, not `cover`: a mission patch is a shield on a
                 transparent field, not a photo with margin to spare, and
                 `cover` was cropping straight into the badge artwork. The
                 background behind it is what a photo (no dead space to show)
                 quietly fills edge to edge on its own. */
              <img
                className="block h-34 w-full border-b border-edge bg-bg object-contain p-2"
                src={spot.image}
                alt=""
                loading="lazy"
                decoding="async"
                onError={() =>
                  setBroken((prev) => {
                    const next = new Set(prev);
                    next.add(spot.key);
                    return next;
                  })
                }
              />
            ) : (
              /* The personal spots (climbing, fishing, golf, hiking) carry no
                 `image` in spots.yaml yet. This reserves the same slot a photo
                 would take rather than letting the card jump straight to text,
                 so dropping a path into the YAML later is the only change a
                 photo ever needs. */
              <div className="flex h-34 w-full items-center justify-center border-b border-edge bg-bg text-ink-faint/40">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
                </svg>
              </div>
            )}

            <figcaption className="px-4 pt-3.5 pb-4">
              <p className="m-0 mb-1.5 font-mono text-label tracking-[0.14em] text-accent-text uppercase">
                {spot.title}
              </p>
              <p className="m-0 text-[0.82rem] leading-relaxed text-ink-muted">
                {spot.text}
              </p>
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}
