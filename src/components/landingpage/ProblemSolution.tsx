import { useLayoutEffect, useRef, useState } from "react";

import {
  Box,
  DollarSign,
  Eye,
  MessageSquare,
  MousePointer2,
  RefreshCw,
  Sparkles,
  Zap,
} from "lucide-react";

type ConnectionLine = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

type ConnectionMap = {
  width: number;
  height: number;
  lines: ConnectionLine[];
};

const signalCards = [
  {
    className: "ps-signal-viewed",
    eyebrow: "Viewed options",
    value: "5 options",
    description: "Browsed multiple alternatives",
    icon: Eye,
  },
  {
    className: "ps-signal-hesitation",
    eyebrow: "Hesitation",
    value: "8.2s pause",
    description: "Paused before submitting answer",
    icon: MousePointer2,
  },
  {
    className: "ps-signal-changed",
    eyebrow: "Changed answer",
    value: "2 changes",
    description: "Updated answer before submitting",
    icon: RefreshCw,
  },
  {
    className: "ps-signal-model",
    eyebrow: "Explored 3D model",
    value: "28s engaged",
    description: "Interacted with 3D model and rotated view",
    icon: Box,
  },
  {
    className: "ps-signal-pricing",
    eyebrow: "Revisited pricing",
    value: "2 visits",
    description: "Went back to pricing page",
    icon: DollarSign,
  },
];

const ProblemSolution = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const responseRef = useRef<HTMLElement | null>(null);
  const nodeRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const [connectionMap, setConnectionMap] = useState<ConnectionMap>({
    width: 1,
    height: 1,
    lines: [],
  });

  useLayoutEffect(() => {
    const map = mapRef.current;
    const response = responseRef.current;

    if (!map || !response) return;

    const updateConnections = () => {
      const mapRect = map.getBoundingClientRect();
      const responseRect = response.getBoundingClientRect();
      const centerX = responseRect.left - mapRect.left + responseRect.width / 2;
      const centerY = responseRect.top - mapRect.top + responseRect.height / 2;
      const radiusX = responseRect.width / 2;
      const radiusY = responseRect.height / 2;

      const lines = signalCards.flatMap((card) => {
        const node = nodeRefs.current[card.className];

        if (!node) return [];

        const nodeRect = node.getBoundingClientRect();
        const targetX = nodeRect.left - mapRect.left + nodeRect.width / 2;
        const targetY = nodeRect.top - mapRect.top + nodeRect.height / 2;
        const deltaX = targetX - centerX;
        const deltaY = targetY - centerY;
        const boundaryScale =
          1 /
          Math.sqrt(
            (deltaX * deltaX) / (radiusX * radiusX) +
              (deltaY * deltaY) / (radiusY * radiusY),
          );

        return [
          {
            x1: centerX + deltaX * boundaryScale,
            y1: centerY + deltaY * boundaryScale,
            x2: targetX,
            y2: targetY,
          },
        ];
      });

      setConnectionMap({
        width: mapRect.width,
        height: mapRect.height,
        lines,
      });
    };

    updateConnections();

    const resizeObserver = new ResizeObserver(updateConnections);
    resizeObserver.observe(map);
    resizeObserver.observe(response);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className="ps-section">
      <header className="ps-heading">
        <h2 className="ps-heading-title">
          Every response has a{" "}
          <span className="ps-story-mark">
            story
            <svg aria-hidden="true" viewBox="0 0 160 66">
              <path d="M7 34C13 12 51 3 104 7c37 3 52 12 49 26-4 17-39 26-91 27C24 61 3 52 7 34Z" />
              <path d="M22 18c25-10 67-17 112-14" />
            </svg>
          </span>{" "}
          around it.
        </h2>
      </header>

      <div className="ps-story-layout">
        <div
          ref={mapRef}
          className="ps-signal-map"
          aria-label="Signals behind a survey response"
        >
          <div className="ps-orbits" aria-hidden="true">
            <span className="ps-orbit ps-orbit-one" />
            <span className="ps-orbit ps-orbit-two" />
            <span className="ps-orbit ps-orbit-three" />
            <span className="ps-orbit ps-orbit-four" />
          </div>

          <svg
            className="ps-connections"
            aria-hidden="true"
            preserveAspectRatio="none"
            viewBox={`0 0 ${connectionMap.width} ${connectionMap.height}`}
          >
            {connectionMap.lines.map((line, index) => (
              <line
                key={signalCards[index].className}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
              />
            ))}
          </svg>

          {signalCards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                className={`ps-signal-card ${card.className}`}
                key={card.eyebrow}
              >
                <div className="ps-signal-icon">
                  <Icon aria-hidden="true" />
                </div>
                <div>
                  <p className="ps-signal-eyebrow">{card.eyebrow}</p>
                  <p className="ps-signal-value">{card.value}</p>
                  <p className="ps-signal-description">{card.description}</p>
                </div>
                <span
                  ref={(node) => {
                    nodeRefs.current[card.className] = node;
                  }}
                  className="ps-map-node"
                  aria-hidden="true"
                />
              </article>
            );
          })}

          <article ref={responseRef} className="ps-response-card">
            <div className="ps-response-icon">
              <MessageSquare aria-hidden="true" />
            </div>
            <p className="ps-response-label">Selected answer</p>
            <blockquote>
              “I found the product useful, but it’s a bit expensive.”
            </blockquote>
          </article>

        </div>

        <aside className="ps-insight-card">
          <div className="ps-insight-content">
            <div className="ps-insight-heading">
              <div className="ps-insight-icon">
                <Zap aria-hidden="true" />
              </div>
              <div>
                <p className="ps-insight-label">Insight</p>
                <h3>Price sensitivity with strong curiosity</h3>
              </div>
            </div>

            <p className="ps-insight-copy">
              The user shows high product interest but hesitates due to pricing.
              Consider value clarity or tier highlights.
            </p>

            <div className="ps-insight-tags" aria-label="Insight attributes">
              <span>High intent</span>
              <span>Price sensitive</span>
              <span>Actively evaluating</span>
            </div>
          </div>

          <div className="ps-insight-footer">
            <div className="ps-footer-spark">
              <Sparkles aria-hidden="true" />
            </div>
            <p>
              <strong>Turn signals into smarter decisions.</strong>
              <span>Build better products. Guide users better.</span>
            </p>
            <span className="ps-wordmark">feedflo</span>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ProblemSolution;
