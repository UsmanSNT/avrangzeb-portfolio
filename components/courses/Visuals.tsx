"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Visual } from "@/content/network-courses";

type TopologyNode = Extract<Visual, { kind: "topology" }>["nodes"][number];

const ICON_PATHS: Record<TopologyNode["icon"], string> = {
  host: "M4 5h16v10H4zM9 19h6M12 15v4",
  switch: "M3 9h18v8H3zM7 13h.01M11 13h.01M15 13h.01M19 13h.01M7 9V6M17 9V6",
  router: "M4 14h16v5H4zM8 17h.01M12 17h.01M7 14l-2-6M17 14l2-6M12 14V6",
  cloud: "M7 18a4 4 0 0 1-.5-7.97A5.5 5.5 0 0 1 17 8.5a4.5 4.5 0 0 1 .5 9.5H7z",
  server: "M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01",
};

function StackVisual({ layers }: { layers: Extract<Visual, { kind: "stack" }>["layers"] }) {
  const reduce = useReducedMotion();
  return (
    <ol className="space-y-1.5">
      {layers.map((layer, index) => (
        <motion.li
          key={layer.label}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduce ? 0 : index * 0.07, duration: 0.25 }}
          className={`flex flex-col gap-0.5 rounded-lg border px-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${
            layer.accent ? "border-accent-cyan/40 bg-accent-cyan/10" : "border-line bg-card"
          }`}
        >
          <span className="text-sm font-bold text-foreground">{layer.label}</span>
          {layer.note && <span className="text-xs text-muted sm:text-right sm:text-sm">{layer.note}</span>}
        </motion.li>
      ))}
    </ol>
  );
}

function SequenceVisual({ actors, messages }: Extract<Visual, { kind: "sequence" }>) {
  const reduce = useReducedMotion();
  return (
    <div>
      <div className="mb-3 flex justify-between gap-2">
        {actors.map((actor) => (
          <span key={actor} className="rounded-lg border border-line bg-card px-3 py-1.5 text-xs font-bold text-cyan-text sm:text-sm">
            {actor}
          </span>
        ))}
      </div>
      <ol className="space-y-2">
        {messages.map((message, index) => {
          const toRight = message.to > message.from;
          return (
            <motion.li
              key={message.label}
              initial={reduce ? false : { opacity: 0, x: toRight ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: reduce ? 0 : index * 0.35, duration: 0.3 }}
              className={`flex ${toRight ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[92%] rounded-xl border px-3 py-2 text-sm leading-6 sm:max-w-[80%] ${
                  toRight ? "border-accent-cyan/40 bg-accent-cyan/10" : "border-accent-green/40 bg-accent-green/10"
                } text-foreground`}
              >
                <span className="mr-1 font-bold text-subtle" aria-hidden="true">
                  {index + 1}. {toRight ? "→" : "←"}
                </span>
                {message.label}
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}

const ROW_HEIGHT = 88;
const NODE_HEIGHT = 70;
const NODE_CENTER_Y = 24;

function computeLevels(nodes: readonly TopologyNode[], links: readonly (readonly [string, string])[]) {
  const degree = new Map(nodes.map((node) => [node.id, 0]));
  links.forEach(([a, b]) => {
    degree.set(a, (degree.get(a) ?? 0) + 1);
    degree.set(b, (degree.get(b) ?? 0) + 1);
  });
  // A simple chain (every node has at most two links) reads best as a straight vertical line.
  const isChain = links.length === nodes.length - 1 && nodes.every((node) => (degree.get(node.id) ?? 0) <= 2);
  const root =
    nodes.find((node) => node.icon === "cloud") ??
    (isChain ? nodes.find((node) => degree.get(node.id) === 1) : undefined) ??
    [...nodes].sort((a, b) => (degree.get(b.id) ?? 0) - (degree.get(a.id) ?? 0))[0];

  const level = new Map<string, number>([[root.id, 0]]);
  const queue = [root.id];
  while (queue.length) {
    const current = queue.shift() as string;
    links.forEach(([a, b]) => {
      const other = a === current ? b : b === current ? a : null;
      if (other && !level.has(other)) {
        level.set(other, (level.get(current) ?? 0) + 1);
        queue.push(other);
      }
    });
  }
  return level;
}

function TopologyVisual({ nodes, links }: Extract<Visual, { kind: "topology" }>) {
  const levels = computeLevels(nodes, links);
  const rows = new Map<number, TopologyNode[]>();
  nodes.forEach((node) => {
    const l = levels.get(node.id) ?? 0;
    rows.set(l, [...(rows.get(l) ?? []), node]);
  });
  const position = new Map<string, { x: number; level: number }>();
  rows.forEach((rowNodes, l) => {
    rowNodes.forEach((node, i) => position.set(node.id, { x: ((i + 0.5) / rowNodes.length) * 100, level: l }));
  });
  const rowCount = Math.max(...rows.keys()) + 1;

  return (
    <div className="relative mx-auto w-full max-w-md" style={{ height: (rowCount - 1) * ROW_HEIGHT + NODE_HEIGHT }}>
      <svg className="absolute inset-0 h-full w-full text-accent-cyan/60" aria-hidden="true">
        {links.map(([a, b]) => {
          const pa = position.get(a);
          const pb = position.get(b);
          if (!pa || !pb) return null;
          return (
            <line
              key={`${a}-${b}`}
              x1={`${pa.x}%`}
              y1={pa.level * ROW_HEIGHT + NODE_CENTER_Y}
              x2={`${pb.x}%`}
              y2={pb.level * ROW_HEIGHT + NODE_CENTER_Y}
              stroke="currentColor"
              strokeWidth={2}
              strokeDasharray="4 4"
            />
          );
        })}
      </svg>
      {nodes.map((node) => {
        const pos = position.get(node.id);
        if (!pos) return null;
        return (
          <div
            key={node.id}
            className="absolute flex w-24 -translate-x-1/2 flex-col items-center gap-1.5 text-center"
            style={{ left: `${pos.x}%`, top: pos.level * ROW_HEIGHT }}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-card text-cyan-text shadow-md shadow-elevation/20">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <path d={ICON_PATHS[node.icon]} />
              </svg>
            </span>
            <span className="rounded bg-background px-1 text-[11px] font-semibold leading-tight text-secondary sm:text-xs">{node.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function PacketVisual({ layers }: Extract<Visual, { kind: "packet" }>) {
  return (
    <div className="space-y-2 font-mono text-xs leading-6 sm:text-sm">
      {layers.map((layer) => (
        <div key={layer.name} className="overflow-hidden rounded-lg border border-line bg-card">
          <p className="border-b border-line bg-surface px-3 py-1.5 font-bold text-cyan-text">▾ {layer.name}</p>
          <dl className="px-3 py-1.5">
            {layer.fields.map((field) => (
              <div
                key={field.name}
                className={`flex flex-wrap gap-x-2 rounded px-1 ${field.highlight ? "bg-accent-cyan/15 text-foreground" : "text-secondary"}`}
              >
                <dt className="text-muted">{field.name}:</dt>
                <dd className="min-w-0 break-words">{field.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

export function VisualBlock({ visual }: { visual: Visual }) {
  switch (visual.kind) {
    case "stack":
      return <StackVisual layers={visual.layers} />;
    case "sequence":
      return <SequenceVisual {...visual} />;
    case "topology":
      return <TopologyVisual {...visual} />;
    case "packet":
      return <PacketVisual {...visual} />;
  }
}
