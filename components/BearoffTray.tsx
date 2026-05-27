"use client";

import { useRef, useEffect, useState } from "react";

const MAX_CHECKERS = 15;
const RIM_GAP = 3;
const TRAY_INNER_PADDING = 6;

interface BearoffHalfProps {
  player: 1 | 2;
  count: number;
  checkerSize: number;
  halfHeight: number;
  trayWidth: number;
  stackDir: "down" | "up";
  bg: string;
  checkerId: string;
}

function BearoffTrayHalf({
  player,
  count,
  checkerSize,
  halfHeight,
  trayWidth,
  stackDir,
  bg,
  checkerId,
}: BearoffHalfProps) {
  const available =
    halfHeight - TRAY_INNER_PADDING * 2 - (MAX_CHECKERS - 1) * RIM_GAP;
  const rimHeight = Math.max(2, Math.floor((available / MAX_CHECKERS) * 0.6));
  const rimWidth = Math.min(Math.round(checkerSize * 0.72), trayWidth - 10);

  return (
    <div
      data-checker-id={checkerId}
      className="flex-1 flex items-center justify-center overflow-hidden"
      style={{ background: bg }}
    >
      <div
        className={`flex flex-col items-center overflow-hidden rounded ${
          stackDir === "down" ? "justify-start" : "justify-end"
        }`}
        style={{
          width: rimWidth + 8,
          height: "calc(100% - 10px)",
          background: "var(--bearoff-inset-bg)",
          border: "1px solid var(--bearoff-inset-border)",
          paddingTop: stackDir === "down" ? TRAY_INNER_PADDING : 0,
          paddingBottom: stackDir === "up" ? TRAY_INNER_PADDING : 0,
          gap: RIM_GAP,
        }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="shrink-0 rounded"
            style={{
              width: rimWidth,
              height: rimHeight,
              background:
                player === 1
                  ? "linear-gradient(to bottom, #f8f0dc 0%, #e8dcc8 40%, #b8a888 100%)"
                  : "linear-gradient(to bottom, #3a3a3a 0%, #1a1a1a 40%, #000000 100%)",
              boxShadow:
                player === 1
                  ? "0 2px 5px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.3)"
                  : "0 2px 5px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12)",
              border:
                player === 1
                  ? "1px solid rgba(255,255,255,0.25)"
                  : "1px solid rgba(255,255,255,0.18)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

interface BearoffTrayProps {
  p1Count: number;
  p2Count: number;
  checkerSize: number;
  flipped: boolean;
}

export default function BearoffTray({
  p1Count,
  p2Count,
  checkerSize,
  flipped,
}: BearoffTrayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({
    width: Math.round(checkerSize * 1.1),
    height: 200,
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setDims({ width, height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const topPlayer = flipped ? 1 : 2;
  const bottomPlayer = flipped ? 2 : 1;
  const topCount = flipped ? p1Count : p2Count;
  const bottomCount = flipped ? p2Count : p1Count;
  const halfHeight = Math.floor((dims.height - 2) / 2);

  return (
    <div
      ref={containerRef}
      className="flex flex-col shrink-0 overflow-hidden h-full"
      style={{
        width: Math.round(checkerSize * 1.4),
        borderLeft: "2px solid var(--board-border)",
      }}
    >
      <BearoffTrayHalf
        player={topPlayer}
        count={topCount}
        checkerSize={checkerSize}
        halfHeight={halfHeight}
        trayWidth={dims.width}
        stackDir="down"
        bg="var(--bearoff-top-bg)"
        checkerId={`p${topPlayer}-bearoff`}
      />

      <div
        className="shrink-0"
        style={{ height: 2, background: "var(--board-border)" }}
      />

      <BearoffTrayHalf
        player={bottomPlayer}
        count={bottomCount}
        checkerSize={checkerSize}
        halfHeight={halfHeight}
        trayWidth={dims.width}
        stackDir="up"
        bg="var(--bearoff-bottom-bg)"
        checkerId={`p${bottomPlayer}-bearoff`}
      />
    </div>
  );
}
