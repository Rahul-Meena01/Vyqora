import { useEffect, useRef, useState } from "react";
import { parseLinks, resolveLink } from "../utils/wikilinks";

const COLORS = {
  paperDark: "#EDE8DF",
  edge: "rgba(61,107,79,0.25)",
  node: "#3D6B4F",
  hover: "#B5450B",
  ink: "#1C1917",
};

const clamp = (value, low, high) => {
  if (high < low) {
    return (low + high) / 2;
  }

  return Math.max(low, Math.min(high, value));
};

export default function GraphView({ notes, onNavigate }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const hoveredIdRef = useRef(null);
  const positionsRef = useRef(new Map());
  const onNavigateRef = useRef(onNavigate);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    onNavigateRef.current = onNavigate;
  }, [onNavigate]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) {
      return undefined;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return undefined;
    }

    let width = 0;
    let height = 0;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      width = Math.max(1, wrap.clientWidth);
      height = Math.max(1, wrap.clientHeight);
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    resize();

    const nodes = notes.map((note) => {
      const saved = positionsRef.current.get(note.id);

      return {
        id: note.id,
        title: note.title,
        x:
          typeof saved?.x === "number"
            ? clamp(saved.x, 16, Math.max(16, width - 16))
            : width * (0.25 + Math.random() * 0.5),
        y:
          typeof saved?.y === "number"
            ? clamp(saved.y, 16, Math.max(16, height - 16))
            : height * (0.25 + Math.random() * 0.5),
        vx: 0,
        vy: 0,
        radius: 8,
      };
    });

    const links = [];
    const edgeSet = new Set();
    for (const note of notes) {
      const targets = parseLinks(note.content);
      for (const title of targets) {
        const target = resolveLink(title, notes);
        if (target && target.id !== note.id) {
          const edgeKey = `${note.id}->${target.id}`;
          if (edgeSet.has(edgeKey)) {
            continue;
          }

          edgeSet.add(edgeKey);
          links.push({ from: note.id, to: target.id });
        }
      }
    }

    const degree = new Map();
    nodes.forEach((node) => degree.set(node.id, 0));
    links.forEach((link) => {
      degree.set(link.from, (degree.get(link.from) || 0) + 1);
      degree.set(link.to, (degree.get(link.to) || 0) + 1);
    });

    nodes.forEach((node) => {
      node.radius = Math.min(22, 6 + (degree.get(node.id) || 0) * 2.5);
    });

    const nodeById = new Map(nodes.map((node) => [node.id, node]));

    let animationId = 0;
    let draggingNode = null;
    let downPoint = null;

    const findNode = (x, y) => {
      return nodes.find(
        (node) => Math.hypot(node.x - x, node.y - y) <= node.radius + 8,
      );
    };

    const setHoveredNodeId = (nextId) => {
      if (hoveredIdRef.current === nextId) {
        return;
      }

      hoveredIdRef.current = nextId;
      setHoveredId(nextId);
    };

    const tick = () => {
      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.max(1, Math.hypot(dx, dy));
          const repulsion = 1600 / (distance * distance);
          const nx = dx / distance;
          const ny = dy / distance;
          a.vx += nx * repulsion;
          a.vy += ny * repulsion;
          b.vx -= nx * repulsion;
          b.vy -= ny * repulsion;
        }
      }

      for (const edge of links) {
        const a = nodeById.get(edge.from);
        const b = nodeById.get(edge.to);
        if (!a || !b) continue;

        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const distance = Math.max(1, Math.hypot(dx, dy));
        const pull = (distance - 120) * 0.04;
        const nx = dx / distance;
        const ny = dy / distance;

        a.vx += nx * pull;
        a.vy += ny * pull;
        b.vx -= nx * pull;
        b.vy -= ny * pull;
      }

      for (const node of nodes) {
        node.vx += (width / 2 - node.x) * 0.008;
        node.vy += (height / 2 - node.y) * 0.008;

        node.vx *= 0.78;
        node.vy *= 0.78;

        if (!draggingNode || draggingNode.id !== node.id) {
          node.x += node.vx;
          node.y += node.vy;
        }

        node.x = clamp(node.x, node.radius + 16, width - node.radius - 16);
        node.y = clamp(node.y, node.radius + 16, height - node.radius - 16);
      }
    };

    const drawGrid = () => {
      ctx.fillStyle = COLORS.paperDark;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "rgba(28,25,23,0.06)";
      for (let x = 0; x < width; x += 28) {
        for (let y = 0; y < height; y += 28) {
          ctx.fillRect(x, y, 1, 1);
        }
      }
    };

    const draw = () => {
      drawGrid();

      for (const edge of links) {
        const from = nodeById.get(edge.from);
        const to = nodeById.get(edge.to);
        if (!from || !to) continue;

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = COLORS.edge;
        ctx.stroke();
      }

      for (const node of nodes) {
        const hovered = hoveredIdRef.current === node.id;
        const color = hovered ? COLORS.hover : COLORS.node;

        if (hovered) {
          const glow = ctx.createRadialGradient(
            node.x,
            node.y,
            0,
            node.x,
            node.y,
            node.radius * 3,
          );
          glow.addColorStop(0, "rgba(181,69,11,0.2)");
          glow.addColorStop(1, "rgba(181,69,11,0)");
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${color}22`;
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = hovered ? 2.2 : 1.4;
        ctx.stroke();

        ctx.fillStyle = COLORS.ink;
        ctx.font = `${hovered ? 700 : 500} 12px system-ui`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const label =
          node.title.length > 20 ? `${node.title.slice(0, 18)}...` : node.title;
        ctx.fillText(label, node.x, node.y + node.radius + 14);
      }
    };

    const animate = () => {
      tick();
      draw();
      animationId = window.requestAnimationFrame(animate);
    };

    animate();

    const getPointerPoint = (event) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = rect.width ? width / rect.width : 1;
      const scaleY = rect.height ? height / rect.height : 1;

      return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY,
      };
    };

    const onPointerMove = (event) => {
      const { x, y } = getPointerPoint(event);

      if (draggingNode) {
        event.preventDefault();
        draggingNode.x = x;
        draggingNode.y = y;
        return;
      }

      const hit = findNode(x, y);
      setHoveredNodeId(hit?.id || null);
      canvas.style.cursor = hit ? "pointer" : "default";
    };

    const onPointerDown = (event) => {
      const { x, y } = getPointerPoint(event);
      const hit = findNode(x, y);
      if (hit) {
        event.preventDefault();
        canvas.setPointerCapture?.(event.pointerId);
        draggingNode = hit;
        downPoint = { x, y };
      }
    };

    const onPointerUp = (event) => {
      if (!draggingNode) {
        return;
      }

      const { x, y } = getPointerPoint(event);
      const dragDistance = downPoint
        ? Math.hypot(x - downPoint.x, y - downPoint.y)
        : 0;

      if (dragDistance < 4) {
        onNavigateRef.current(draggingNode.id);
      }

      canvas.releasePointerCapture?.(event.pointerId);
      draggingNode = null;
      downPoint = null;
    };

    const onPointerCancel = () => {
      draggingNode = null;
      downPoint = null;
      setHoveredNodeId(null);
      canvas.style.cursor = "default";
    };

    const onPointerLeave = () => {
      if (!draggingNode) {
        setHoveredNodeId(null);
        canvas.style.cursor = "default";
      }
    };

    const supportsResizeObserver = typeof ResizeObserver !== "undefined";
    const observer = supportsResizeObserver ? new ResizeObserver(resize) : null;
    if (observer) {
      observer.observe(wrap);
    } else {
      window.addEventListener("resize", resize);
    }

    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerCancel);
    canvas.addEventListener("pointerleave", onPointerLeave);

    return () => {
      const nextPositions = new Map();
      for (const node of nodes) {
        nextPositions.set(node.id, { x: node.x, y: node.y });
      }
      positionsRef.current = nextPositions;

      cancelAnimationFrame(animationId);
      if (observer) {
        observer.disconnect();
      } else {
        window.removeEventListener("resize", resize);
      }
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerCancel);
      canvas.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [notes]);

  const hoveredNote = hoveredId
    ? notes.find((note) => note.id === hoveredId)
    : null;

  return (
    <div className="graph-wrap" ref={wrapRef}>
      <canvas
        className="graph-canvas"
        ref={canvasRef}
        role="img"
        aria-label="Knowledge graph. Select a node to open its note."
      />
      {hoveredNote && (
        <div className="graph-tooltip">
          <strong>{hoveredNote.title}</strong>
          <span>
            {new Date(hoveredNote.updated).toLocaleDateString("en-IN")}
          </span>
        </div>
      )}
    </div>
  );
}
