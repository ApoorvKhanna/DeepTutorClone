"use client";

import {
  CSSProperties,
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useGuideSession, useGuideHistory, useKaTeXInjection } from "../hooks";
import type { ChatMessage, KnowledgePoint, SessionSummary } from "../types";

// ─── Aurora tokens ──────────────────────────────────────────────
const A = {
  bg: "#F6F5FB",
  ink: "#13111C",
  sub: "rgba(19,17,28,0.52)",
  dim: "rgba(19,17,28,0.32)",
  hair: "rgba(19,17,28,0.08)",
  glass: "rgba(255,255,255,0.6)",
  glassB: "rgba(255,255,255,0.8)",
  h1: "#B9A8FF",
  h2: "#9EE5FF",
  h3: "#FFB8D1",
  h4: "#C8FFE1",
  green: "#2BA94E",
  red: "#E54545",
  violet: "#6E55D9",
} as const;

const STATUS_COLORS = {
  ready: A.green,
  generating: A.h1,
  pending: A.dim,
  failed: A.red,
} as const;

const MODULE_PALETTE = [A.h1, A.h2, A.h3, A.h4, "#FFD088"];
const MODULE_ICONS = ["👁", "⚡", "🔀", "📍", "🏗", "🧠", "📊", "🧪"];

const FONT_STACK = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
const SERIF_STACK = "'Instrument Serif', 'Lora', serif";
const MONO_STACK = "'JetBrains Mono', ui-monospace, monospace";

function glass(strong = false): CSSProperties {
  return {
    background: strong ? "rgba(255,255,255,0.78)" : A.glass,
    border: `1px solid ${A.glassB}`,
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    boxShadow:
      "0 1px 2px rgba(19,17,28,0.04), 0 8px 28px rgba(99,78,191,0.07)",
  };
}

function iconFor(index: number) {
  return MODULE_ICONS[index % MODULE_ICONS.length];
}

function colorFor(index: number) {
  return MODULE_PALETTE[index % MODULE_PALETTE.length];
}

// ─── Animated aurora halo ───────────────────────────────────────
function MobileHalo({ style }: { style?: CSSProperties }) {
  const [angle, setAngle] = useState(0);
  useEffect(() => {
    let id = 0;
    const tick = () => {
      setAngle((prev) => (prev + 0.2) % 360);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "-20%",
          width: "90%",
          height: "80%",
          background: `radial-gradient(circle,${A.h1} 0%,transparent 65%)`,
          filter: "blur(60px)",
          opacity: 0.55,
          transform: `rotate(${angle}deg)`,
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "10%",
          right: "-20%",
          width: "80%",
          height: "70%",
          background: `radial-gradient(circle,${A.h2} 0%,transparent 65%)`,
          filter: "blur(70px)",
          opacity: 0.5,
          transform: `rotate(${-angle * 0.8}deg)`,
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          left: "10%",
          width: "80%",
          height: "70%",
          background: `radial-gradient(circle,${A.h3} 0%,transparent 65%)`,
          filter: "blur(65px)",
          opacity: 0.4,
          transform: `rotate(${angle * 0.5}deg)`,
          borderRadius: "50%",
        }}
      />
    </div>
  );
}

function BottomTabBar({ active = 2 }: { active?: number }) {
  const tabs = [
    { ic: "⚡", label: "Solver" },
    { ic: "🔬", label: "Research" },
    { ic: "📖", label: "Guide" },
    { ic: "✍️", label: "Write" },
    { ic: "🗂", label: "Knowledge" },
  ];
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 82,
        ...glass(true),
        borderRadius: "20px 20px 0 0",
        display: "flex",
        alignItems: "flex-start",
        paddingTop: 10,
        zIndex: 20,
      }}
    >
      {tabs.map((t, i) => {
        const isActive = active === i;
        return (
          <div
            key={t.label}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              paddingTop: 4,
              cursor: "pointer",
            }}
          >
            <div
              style={{
                fontSize: 22,
                lineHeight: 1,
                ...(isActive
                  ? { filter: `drop-shadow(0 0 6px ${A.h1})` }
                  : { opacity: 0.45 }),
              }}
            >
              {t.ic}
            </div>
            <div
              style={{
                fontSize: 10,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? A.violet : A.sub,
                letterSpacing: 0.2,
              }}
            >
              {t.label}
            </div>
            {isActive && (
              <div
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: A.h1,
                  marginTop: 1,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── SCREEN: Idle / Input ──────────────────────────────────────
function ScreenIdle({
  topicInput,
  setTopicInput,
  onSubmit,
  isLoading,
  recentSessions,
  onOpenSession,
}: {
  topicInput: string;
  setTopicInput: (v: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  recentSessions: SessionSummary[];
  onOpenSession: (id: string) => void;
}) {
  const canSubmit = topicInput.trim().length > 0 && !isLoading;
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100%",
        position: "relative",
        background: A.bg,
        overflow: "hidden",
        paddingBottom: 100,
      }}
    >
      <MobileHalo />
      <div style={{ height: 60 }} />
      <div
        style={{ position: "relative", zIndex: 2, padding: "0 22px", marginTop: 20 }}
      >
        <div
          style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: `conic-gradient(from 180deg,${A.h1},${A.h2},${A.h3},${A.h4},${A.h1})`,
              boxShadow: `0 4px 14px ${A.h1}55`,
            }}
          />
          <div
            style={{
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: -0.4,
              color: A.ink,
            }}
          >
            Lumen
          </div>
        </div>

        <div
          style={{
            fontFamily: SERIF_STACK,
            fontSize: 38,
            lineHeight: 1.05,
            letterSpacing: -1.2,
            color: A.ink,
            marginBottom: 10,
          }}
        >
          What do you<br />want to<br />
          <span style={{ fontStyle: "italic" }}>learn today?</span>
        </div>
        <div
          style={{
            fontSize: 14,
            color: A.sub,
            lineHeight: 1.5,
            marginBottom: 28,
          }}
        >
          Describe a topic and Lumen builds an interactive, multi-part guided
          course — just for you.
        </div>

        <div style={{ ...glass(true), borderRadius: 20, overflow: "hidden" }}>
          <div style={{ padding: "16px 16px 0" }}>
            <textarea
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="Teach me transformer attention mechanisms, from intuition to math…"
              rows={4}
              style={{
                width: "100%",
                resize: "none",
                border: "none",
                outline: "none",
                background: "transparent",
                fontFamily: "inherit",
                fontSize: 14.5,
                color: A.ink,
                lineHeight: 1.6,
                minHeight: 110,
              }}
            />
          </div>
          <div
            style={{
              padding: "12px 16px",
              borderTop: `1px solid ${A.hair}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", gap: 10 }}>
              <div
                style={{
                  padding: "5px 10px",
                  ...glass(false),
                  borderRadius: 999,
                  fontSize: 11,
                  color: A.sub,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <span style={{ fontSize: 12 }}>📓</span> Notebook
              </div>
              <div
                style={{
                  padding: "5px 10px",
                  ...glass(false),
                  borderRadius: 999,
                  fontSize: 11,
                  color: A.sub,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <span style={{ fontSize: 12 }}>⚙️</span> Depth: Deep
              </div>
            </div>
            <button
              onClick={onSubmit}
              disabled={!canSubmit}
              aria-label="Generate plan"
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "none",
                background: canSubmit
                  ? `linear-gradient(135deg,${A.h1},${A.h2})`
                  : `linear-gradient(135deg,${A.h1}66,${A.h2}66)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: canSubmit ? `0 4px 14px ${A.h1}55` : "none",
                fontSize: 18,
                color: "#1D1842",
                fontWeight: 700,
                cursor: canSubmit ? "pointer" : "not-allowed",
              }}
            >
              {isLoading ? (
                <span
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    border: "2px solid #1D1842",
                    borderTopColor: "transparent",
                    animation: "lumen-spin 0.9s linear infinite",
                    display: "inline-block",
                  }}
                />
              ) : (
                "↑"
              )}
            </button>
          </div>
        </div>

        <div style={{ marginTop: 28 }}>
          <div
            style={{
              fontSize: 11,
              color: A.sub,
              letterSpacing: 0.8,
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Recent
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {recentSessions.length === 0 && (
              <div
                style={{
                  ...glass(true),
                  borderRadius: 14,
                  padding: "14px 16px",
                  fontSize: 13,
                  color: A.sub,
                }}
              >
                No sessions yet. Your generated courses will appear here.
              </div>
            )}
            {recentSessions.slice(0, 5).map((s, i) => {
              const done = s.status === "completed";
              return (
                <button
                  key={s.session_id}
                  onClick={() => onOpenSession(s.session_id)}
                  style={{
                    ...glass(true),
                    borderRadius: 14,
                    padding: "12px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    textAlign: "left",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: `linear-gradient(135deg,${colorFor(i)}44,${colorFor(i + 1)}44)`,
                      border: `1px solid ${colorFor(i)}44`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      flexShrink: 0,
                    }}
                  >
                    {iconFor(i)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13.5,
                        fontWeight: 500,
                        color: A.ink,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {s.topic || "Untitled session"}
                    </div>
                    <div
                      style={{ fontSize: 11, color: A.sub, marginTop: 2 }}
                    >
                      {s.total_points} topics ·{" "}
                      {done ? "completed" : "in progress"}
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: A.dim }}>›</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <BottomTabBar active={2} />
    </div>
  );
}

// ─── SCREEN: Plan Generated ────────────────────────────────────
function ScreenPlan({
  topic,
  knowledgePoints,
  onStart,
  onBack,
  isLoading,
}: {
  topic: string;
  knowledgePoints: KnowledgePoint[];
  onStart: () => void;
  onBack: () => void;
  isLoading: boolean;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: A.bg,
        overflow: "hidden",
      }}
    >
      <MobileHalo />
      <div style={{ height: 60 }} />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "0 18px",
          height: "calc(100% - 142px)",
          overflowY: "auto",
        }}
      >
        <div style={{ paddingTop: 16, paddingBottom: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 20,
            }}
          >
            <button
              onClick={onBack}
              style={{
                background: "none",
                border: "none",
                fontSize: 18,
                color: A.sub,
                cursor: "pointer",
                padding: 4,
              }}
              aria-label="Back"
            >
              ←
            </button>
            <div
              style={{ fontSize: 15, fontWeight: 600, color: A.ink, flex: 1 }}
            >
              Learning Plan
            </div>
            <div
              style={{
                padding: "4px 10px",
                background: `${A.h1}22`,
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 600,
                color: A.violet,
                border: `1px solid ${A.h1}44`,
              }}
            >
              Ready
            </div>
          </div>

          <div
            style={{
              ...glass(true),
              borderRadius: 16,
              padding: "14px 16px",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: A.sub,
                letterSpacing: 0.5,
                marginBottom: 6,
              }}
            >
              YOUR TOPIC
            </div>
            <div
              style={{
                fontFamily: SERIF_STACK,
                fontSize: 18,
                fontStyle: "italic",
                color: A.ink,
                lineHeight: 1.3,
              }}
            >
              {topic}
            </div>
          </div>

          <div
            style={{
              ...glass(false),
              borderRadius: 16,
              padding: "14px 16px",
              marginBottom: 16,
              background: `${A.h1}12`,
              border: `1px solid ${A.h1}33`,
            }}
          >
            <div style={{ fontSize: 12.5, color: A.ink, lineHeight: 1.6 }}>
              📚{" "}
              <b>
                Learning plan ready with {knowledgePoints.length} knowledge
                points.
              </b>
              <br />
              Each is an interactive module with visuals, examples and a chat
              assistant.
            </div>
          </div>

          <div
            style={{
              fontSize: 11,
              color: A.sub,
              letterSpacing: 0.8,
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            {knowledgePoints.length} Modules
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginBottom: 24,
            }}
          >
            {knowledgePoints.map((kp, i) => {
              const color = colorFor(i);
              return (
                <div
                  key={`${kp.knowledge_title}-${i}`}
                  style={{
                    ...glass(true),
                    borderRadius: 14,
                    padding: "12px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 11,
                      background: `linear-gradient(135deg,${color}44,${color}22)`,
                      border: `1px solid ${color}55`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                      flexShrink: 0,
                    }}
                  >
                    {iconFor(i)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginBottom: 2,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          fontFamily: MONO_STACK,
                          color: A.dim,
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <div
                        style={{
                          width: 3,
                          height: 3,
                          borderRadius: "50%",
                          background: A.dim,
                        }}
                      />
                      <div style={{ fontSize: 10, color: A.sub }}>~5 min</div>
                    </div>
                    <div
                      style={{
                        fontSize: 13.5,
                        fontWeight: 500,
                        color: A.ink,
                      }}
                    >
                      {kp.knowledge_title}
                    </div>
                  </div>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: A.dim,
                      opacity: 0.4,
                    }}
                  />
                </div>
              );
            })}
          </div>

          <button
            onClick={onStart}
            disabled={isLoading || knowledgePoints.length === 0}
            style={{
              width: "100%",
              padding: 15,
              background: A.ink,
              color: "white",
              border: "none",
              borderRadius: 16,
              fontSize: 15,
              fontWeight: 600,
              fontFamily: "inherit",
              cursor: isLoading ? "wait" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: "0 6px 20px rgba(19,17,28,0.2)",
              opacity: isLoading ? 0.75 : 1,
            }}
          >
            ✦ {isLoading ? "Starting…" : "Start Learning"}
          </button>
          <div
            style={{
              textAlign: "center",
              fontSize: 11.5,
              color: A.sub,
              marginTop: 10,
            }}
          >
            All {knowledgePoints.length} pages generate simultaneously
          </div>
        </div>
      </div>

      <BottomTabBar active={2} />
    </div>
  );
}

// ─── SCREEN: Learning ──────────────────────────────────────────
function ScreenLearning({
  knowledgePoints,
  pageStatuses,
  htmlPages,
  currentIndex,
  progress,
  readyCount,
  allReady,
  onSelect,
  onOpenChat,
  onComplete,
  onBack,
  loadingMessage,
}: {
  knowledgePoints: KnowledgePoint[];
  pageStatuses: Record<number, "pending" | "generating" | "ready" | "failed">;
  htmlPages: Record<number, string>;
  currentIndex: number;
  progress: number;
  readyCount: number;
  allReady: boolean;
  onSelect: (index: number) => void;
  onOpenChat: () => void;
  onComplete: () => void;
  onBack: () => void;
  loadingMessage: string;
}) {
  const activeHtml =
    currentIndex >= 0 ? htmlPages[currentIndex] || "" : "";
  const activeStatus =
    currentIndex >= 0 ? pageStatuses[currentIndex] || "pending" : "pending";
  const progressDisplay = Math.max(
    0,
    Math.min(100, Math.round(progress || 0)),
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: A.bg,
        overflow: "hidden",
      }}
    >
      <MobileHalo />
      <div style={{ height: 60 }} />

      <div
        style={{ position: "relative", zIndex: 5, padding: "10px 18px 0" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <button
            onClick={onBack}
            style={{
              background: "none",
              border: "none",
              fontSize: 13,
              color: A.sub,
              cursor: "pointer",
              padding: 0,
              fontFamily: "inherit",
            }}
          >
            ← Sessions
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            <div
              style={{
                padding: "5px 10px",
                ...glass(true),
                borderRadius: 999,
                fontSize: 11,
                color: A.sub,
              }}
            >
              Save
            </div>
            <button
              onClick={onComplete}
              disabled={!allReady}
              style={{
                padding: "5px 10px",
                background: A.ink,
                borderRadius: 999,
                fontSize: 11,
                color: "white",
                fontWeight: 500,
                border: "none",
                cursor: allReady ? "pointer" : "not-allowed",
                opacity: allReady ? 1 : 0.6,
                fontFamily: "inherit",
              }}
            >
              {allReady ? "Finish" : `${readyCount}/${knowledgePoints.length}`}
            </button>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              flex: 1,
              height: 3,
              background: "rgba(19,17,28,0.08)",
              borderRadius: 999,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progressDisplay}%`,
                background: `linear-gradient(90deg,${A.h1},${A.h2})`,
                transition: "width 0.5s ease",
              }}
            />
          </div>
          <div
            style={{
              fontSize: 10.5,
              color: A.sub,
              fontFamily: MONO_STACK,
            }}
          >
            {progressDisplay}%
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 6,
            overflowX: "auto",
            paddingBottom: 10,
            scrollbarWidth: "none",
            marginLeft: -18,
            paddingLeft: 18,
            marginRight: -18,
            paddingRight: 18,
          }}
        >
          {knowledgePoints.map((kp, i) => {
            const s = pageStatuses[i] || "pending";
            const act = currentIndex === i;
            const disabled = s === "pending";
            const short = kp.knowledge_title
              .split(" ")
              .slice(0, 2)
              .join(" ");
            return (
              <button
                key={`${kp.knowledge_title}-${i}`}
                onClick={() => !disabled && onSelect(i)}
                style={{
                  flexShrink: 0,
                  padding: "6px 12px",
                  borderRadius: 999,
                  border: `1px solid ${act ? A.h1 : A.hair}`,
                  background: act
                    ? `linear-gradient(135deg,${A.h1}33,${A.h2}33)`
                    : glass(false).background,
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  color: act
                    ? A.ink
                    : s === "pending"
                      ? A.dim
                      : A.sub,
                  fontSize: 12,
                  fontWeight: act ? 600 : 400,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  cursor: disabled ? "default" : "pointer",
                  fontFamily: "inherit",
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: STATUS_COLORS[s],
                    animation:
                      s === "generating"
                        ? "lumen-shimmer 1s infinite"
                        : undefined,
                    flexShrink: 0,
                  }}
                />
                {i + 1}. {short}
              </button>
            );
          })}
        </div>
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 2,
          margin: "0 12px",
          height: "calc(100% - 280px)",
          overflow: "hidden",
          borderRadius: 20,
          ...glass(true),
        }}
      >
        <LearningFrame
          html={activeHtml}
          status={activeStatus}
          loadingMessage={loadingMessage}
        />
      </div>

      <button
        onClick={onOpenChat}
        aria-label="Open chat"
        style={{
          position: "absolute",
          bottom: 100,
          right: 18,
          zIndex: 10,
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: `linear-gradient(135deg,${A.h1},${A.h2})`,
          boxShadow: `0 4px 16px ${A.h1}66`,
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          cursor: "pointer",
        }}
      >
        💬
      </button>

      <BottomTabBar active={2} />
    </div>
  );
}

function sanitizeHtml(raw: string) {
  return raw
    .replace(/<script(?![^>]*katex)[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, (match) => {
      if (/onload\s*=\s*(['"])renderMathInElement/i.test(match)) return match;
      return "";
    })
    .replace(/\s(href|src)\s*=\s*(['"])javascript:[\s\S]*?\2/gi, "");
}

function LearningFrame({
  html,
  status,
  loadingMessage,
}: {
  html: string;
  status: "pending" | "generating" | "ready" | "failed";
  loadingMessage: string;
}) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const lastWrittenRef = useRef<string>("");
  const { injectKaTeX } = useKaTeXInjection();

  useEffect(() => {
    if (!html || status !== "ready") return;

    const processed = sanitizeHtml(injectKaTeX(html));
    if (lastWrittenRef.current === processed) return;

    const timer = setTimeout(() => {
      if (!frameRef.current) return;
      frameRef.current.srcdoc = processed;
      lastWrittenRef.current = processed;

      const delays = [1500, 3000];
      const fallbackTimers = delays.map((delay) =>
        setTimeout(() => {
          try {
            const doc = frameRef.current?.contentDocument;
            if (!doc?.body) return;
            const win = doc.defaultView as Window & {
              renderMathInElement?: (el: HTMLElement, opts: Record<string, unknown>) => void;
            };
            if (typeof win?.renderMathInElement !== "function") return;
            win.renderMathInElement(doc.body, {
              delimiters: [
                { left: "$$", right: "$$", display: true },
                { left: "$", right: "$", display: false },
                { left: "\\(", right: "\\)", display: false },
                { left: "\\[", right: "\\]", display: true },
              ],
              throwOnError: false,
            });
          } catch {
            // ignore
          }
        }, delay),
      );
      (frameRef.current as unknown as Record<string, unknown>).__fallbackTimers = fallbackTimers;
    }, 100);

    return () => {
      clearTimeout(timer);
      const prev = frameRef.current as unknown as Record<string, unknown> | null;
      if (prev?.__fallbackTimers) {
        (prev.__fallbackTimers as ReturnType<typeof setTimeout>[]).forEach(clearTimeout);
      }
    };
  }, [html, status, injectKaTeX]);

  if (!html || status !== "ready") {
    const label =
      status === "failed"
        ? "This page failed to generate. Retry from the tab bar."
        : loadingMessage || "Preparing your interactive module…";
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          padding: 24,
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: `3px solid ${A.h1}55`,
            borderTopColor: A.violet,
            animation: "lumen-spin 1s linear infinite",
          }}
        />
        <div
          style={{
            fontFamily: SERIF_STACK,
            fontSize: 17,
            color: A.ink,
            fontStyle: "italic",
          }}
        >
          {label}
        </div>
      </div>
    );
  }

  return (
    <iframe
      ref={frameRef}
      title="Learning page"
      sandbox="allow-scripts allow-same-origin"
      style={{
        width: "100%",
        height: "100%",
        border: "none",
        background: "transparent",
      }}
    />
  );
}

// ─── SCREEN: Chat bottom sheet ─────────────────────────────────
function ChatSheet({
  open,
  onClose,
  messages,
  isLearning,
  currentTitle,
  currentIndex,
  onSend,
}: {
  open: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  isLearning: boolean;
  currentTitle?: string;
  currentIndex?: number;
  onSend: (m: string) => void;
}) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  if (!open) return null;

  const moduleLabel =
    typeof currentIndex === "number" && currentIndex >= 0
      ? `Module ${currentIndex + 1}${currentTitle ? ` · ${currentTitle}` : ""}`
      : "Guided Learning";

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInput("");
  };

  return (
    <div
      role="dialog"
      aria-modal
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 30,
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(246,245,251,0.4)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "76%",
          borderRadius: "24px 24px 0 0",
          ...glass(true),
          display: "flex",
          flexDirection: "column",
          animation: "lumen-slide-up 0.35s cubic-bezier(.25,.46,.45,.94)",
        }}
      >
        <div
          style={{
            padding: "12px 18px 10px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 36,
              height: 4,
              borderRadius: 999,
              background: A.hair,
              margin: "0 auto",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 8,
                background: `linear-gradient(135deg,${A.h1},${A.h2})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
              }}
            >
              💬
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: A.ink }}>
              Chat
            </div>
            <div style={{ flex: 1 }} />
            <div
              style={{
                fontSize: 12,
                color: A.sub,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "55%",
              }}
            >
              {moduleLabel}
            </div>
            <button
              onClick={onClose}
              aria-label="Close chat"
              style={{
                fontSize: 16,
                color: A.sub,
                cursor: "pointer",
                background: "none",
                border: "none",
                padding: 4,
              }}
            >
              ×
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          style={{
            borderTop: `1px solid ${A.hair}`,
            flex: 1,
            overflowY: "auto",
            padding: "12px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {messages.length === 0 && (
            <div
              style={{
                fontSize: 12.5,
                color: A.sub,
                textAlign: "center",
                padding: "24px 12px",
                lineHeight: 1.5,
              }}
            >
              Ask anything about this module. Your questions are grounded in
              the current page.
            </div>
          )}
          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: m.role === "user" ? "flex-end" : "flex-start",
                animation: "lumen-fade-up 0.3s",
              }}
            >
              {m.role === "system" ? (
                <div
                  style={{
                    padding: "8px 12px",
                    background: `${A.h1}18`,
                    border: `1px solid ${A.h1}33`,
                    borderRadius: 12,
                    fontSize: 12.5,
                    color: A.ink,
                    lineHeight: 1.55,
                    maxWidth: "92%",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {m.content}
                </div>
              ) : m.role === "user" ? (
                <div
                  style={{
                    padding: "9px 13px",
                    background: A.ink,
                    borderRadius: "14px 14px 4px 14px",
                    fontSize: 13,
                    color: "white",
                    lineHeight: 1.55,
                    maxWidth: "82%",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {m.content}
                </div>
              ) : (
                <div
                  style={{
                    padding: "9px 13px",
                    ...glass(true),
                    borderRadius: "4px 14px 14px 14px",
                    fontSize: 13,
                    color: A.ink,
                    lineHeight: 1.6,
                    maxWidth: "88%",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {m.content}
                </div>
              )}
            </div>
          ))}
        </div>

        <div
          style={{
            padding: "10px 14px 28px",
            borderTop: `1px solid ${A.hair}`,
            display: "flex",
            gap: 8,
            flexShrink: 0,
          }}
        >
          <input
            placeholder={
              isLearning
                ? "Ask about this module…"
                : "Load a ready module to start chatting…"
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            disabled={!isLearning}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: 12,
              border: `1px solid ${A.hair}`,
              background: "rgba(255,255,255,0.7)",
              fontSize: 13.5,
              color: A.ink,
              outline: "none",
              fontFamily: "inherit",
              opacity: isLearning ? 1 : 0.6,
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={!isLearning || !input.trim()}
            aria-label="Send message"
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: A.ink,
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 16,
              cursor: isLearning && input.trim() ? "pointer" : "not-allowed",
              opacity: isLearning && input.trim() ? 1 : 0.55,
              flexShrink: 0,
            }}
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN: Completion ───────────────────────────────────────
function ScreenDone({
  topic,
  knowledgePoints,
  summary,
  onSave,
  onNewSession,
  onRevisit,
}: {
  topic: string;
  knowledgePoints: KnowledgePoint[];
  summary: string;
  onSave: () => void;
  onNewSession: () => void;
  onRevisit: () => void;
}) {
  const conceptCount = knowledgePoints.reduce((acc, kp) => {
    const words = kp.knowledge_summary?.trim().split(/\s+/).filter(Boolean);
    return acc + Math.max(1, Math.min(8, Math.ceil((words?.length || 6) / 4)));
  }, 0);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: A.bg,
        overflow: "hidden",
      }}
    >
      <MobileHalo />
      <div style={{ height: 60 }} />
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "0 18px",
          height: "calc(100% - 142px)",
          overflowY: "auto",
        }}
      >
        <div style={{ paddingTop: 16, paddingBottom: 24 }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 22,
                margin: "0 auto 14px",
                background: `linear-gradient(135deg,${A.h1},${A.h2},${A.h4})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                boxShadow: `0 8px 24px ${A.h1}55`,
              }}
            >
              ✦
            </div>
            <div
              style={{
                fontFamily: SERIF_STACK,
                fontSize: 28,
                fontWeight: 400,
                letterSpacing: -0.8,
                color: A.ink,
              }}
            >
              Session Complete
            </div>
            <div style={{ fontSize: 13, color: A.sub, marginTop: 4 }}>
              {topic} · {knowledgePoints.length} modules
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 10,
              marginBottom: 18,
            }}
          >
            {[
              [String(knowledgePoints.length), "Modules"],
              ["100%", "Progress"],
              [String(conceptCount || knowledgePoints.length * 6), "Concepts"],
            ].map(([n, l]) => (
              <div
                key={l}
                style={{
                  ...glass(true),
                  borderRadius: 14,
                  padding: "14px 10px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: SERIF_STACK,
                    fontSize: 28,
                    color: A.ink,
                    letterSpacing: -1,
                  }}
                >
                  {n}
                </div>
                <div style={{ fontSize: 11, color: A.sub, marginTop: 2 }}>
                  {l}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              fontSize: 11,
              color: A.sub,
              letterSpacing: 0.8,
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            What you&apos;ve mastered
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              marginBottom: 18,
            }}
          >
            {knowledgePoints.map((kp, i) => {
              const color = colorFor(i);
              return (
                <div
                  key={`${kp.knowledge_title}-done-${i}`}
                  style={{
                    ...glass(true),
                    borderRadius: 12,
                    padding: "10px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 9,
                      background: `${color}33`,
                      border: `1px solid ${color}55`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 15,
                      flexShrink: 0,
                    }}
                  >
                    {iconFor(i)}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      fontSize: 13,
                      fontWeight: 500,
                      color: A.ink,
                    }}
                  >
                    {kp.knowledge_title}
                  </div>
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: A.green,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 9,
                      color: "white",
                      fontWeight: 700,
                    }}
                  >
                    ✓
                  </div>
                </div>
              );
            })}
          </div>

          {summary ? (
            <div
              style={{
                ...glass(true),
                borderRadius: 16,
                padding: 16,
                marginBottom: 16,
                background: `linear-gradient(135deg,${A.h1}15,${A.h4}15)`,
                border: `1px solid ${A.h1}44`,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: A.violet,
                  letterSpacing: 0.5,
                  marginBottom: 8,
                }}
              >
                AI STUDY NOTES
              </div>
              <div
                style={{
                  fontSize: 13.5,
                  fontFamily: SERIF_STACK,
                  fontStyle: "italic",
                  color: A.ink,
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                }}
              >
                {summary}
              </div>
            </div>
          ) : null}

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button
              onClick={onSave}
              style={{
                padding: 14,
                background: A.ink,
                color: "white",
                border: "none",
                borderRadius: 14,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Save to Notebook
            </button>
            <button
              onClick={onRevisit}
              style={{
                padding: 14,
                ...glass(true),
                border: `1px solid ${A.hair}`,
                borderRadius: 14,
                fontSize: 14,
                color: A.ink,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Revisit modules →
            </button>
            <button
              onClick={onNewSession}
              style={{
                padding: 14,
                background: "transparent",
                border: `1px solid ${A.hair}`,
                borderRadius: 14,
                fontSize: 14,
                color: A.sub,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Start a new topic
            </button>
          </div>
        </div>
      </div>
      <BottomTabBar active={2} />
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────
export default function GuideMobilePage() {
  const {
    sessionState,
    chatMessages,
    isLoading,
    loadingMessage,
    readyCount,
    allPagesReady,
    currentPageReady,
    createSession,
    startLearning,
    navigateTo,
    completeLearning,
    sendMessage,
    resetSession,
    clearLocalSession,
    loadSession,
  } = useGuideSession();
  const { sessions, refresh: refreshHistory } = useGuideHistory();

  const [topicInput, setTopicInput] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [revisitBySession, setRevisitBySession] = useState<
    Record<string, boolean>
  >({});
  const sessionKey = sessionState.session_id || "__none__";
  const revisitingModules = Boolean(revisitBySession[sessionKey]);
  const showingSummary =
    sessionState.status === "completed" &&
    Boolean(sessionState.summary) &&
    !revisitingModules;

  const currentTitle = useMemo(() => {
    if (sessionState.current_index < 0) return undefined;
    return sessionState.knowledge_points[sessionState.current_index]
      ?.knowledge_title;
  }, [sessionState.current_index, sessionState.knowledge_points]);

  const handleCreate = async () => {
    if (!topicInput.trim() || isLoading) return;
    await createSession(topicInput);
    refreshHistory();
  };

  const handleReset = async () => {
    await resetSession();
    setChatOpen(false);
    setRevisitBySession({});
    setTopicInput("");
    refreshHistory();
  };

  const handleGoBack = () => {
    clearLocalSession();
    setChatOpen(false);
    setRevisitBySession({});
    refreshHistory();
  };

  const handleOpen = async (id: string) => {
    await loadSession(id);
  };

  const handleComplete = async () => {
    await completeLearning();
    refreshHistory();
  };

  let screen: React.ReactNode;
  if (showingSummary) {
    screen = (
      <ScreenDone
        topic={sessionState.topic}
        knowledgePoints={sessionState.knowledge_points}
        summary={sessionState.summary}
        onSave={() => {
          /* Save-to-notebook modal could be wired here; placeholder. */
        }}
        onNewSession={handleReset}
        onRevisit={() =>
          setRevisitBySession((prev) => ({ ...prev, [sessionKey]: true }))
        }
      />
    );
  } else if (
    sessionState.status === "learning" ||
    sessionState.status === "completed"
  ) {
    screen = (
      <ScreenLearning
        knowledgePoints={sessionState.knowledge_points}
        pageStatuses={sessionState.page_statuses}
        htmlPages={sessionState.html_pages}
        currentIndex={sessionState.current_index}
        progress={sessionState.progress}
        readyCount={readyCount}
        allReady={allPagesReady}
        onSelect={navigateTo}
        onOpenChat={() => setChatOpen(true)}
        onComplete={handleComplete}
        onBack={handleGoBack}
        loadingMessage={loadingMessage}
      />
    );
  } else if (sessionState.status === "initialized") {
    screen = (
      <ScreenPlan
        topic={sessionState.topic}
        knowledgePoints={sessionState.knowledge_points}
        onStart={startLearning}
        onBack={handleGoBack}
        isLoading={isLoading}
      />
    );
  } else {
    screen = (
      <ScreenIdle
        topicInput={topicInput}
        setTopicInput={setTopicInput}
        onSubmit={handleCreate}
        isLoading={isLoading}
        recentSessions={sessions}
        onOpenSession={handleOpen}
      />
    );
  }

  return (
    <Fragment>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
      />
      <style>{`
        @keyframes lumen-spin { to { transform: rotate(360deg); } }
        @keyframes lumen-shimmer { 0%,100% { opacity:.4 } 50% { opacity:1 } }
        @keyframes lumen-slide-up { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        @keyframes lumen-fade-up { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        .lumen-stage *, .lumen-stage *::before, .lumen-stage *::after { box-sizing: border-box; }
        .lumen-scroll-hide::-webkit-scrollbar { display: none; }
      `}</style>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#e9e7e1",
          padding: 16,
          overflow: "auto",
          fontFamily: FONT_STACK,
          color: A.ink,
        }}
        className="lumen-stage"
      >
        <div
          style={{
            position: "relative",
            width: 393,
            maxWidth: "100%",
            height: 852,
            maxHeight: "calc(100vh - 32px)",
            borderRadius: 48,
            overflow: "hidden",
            background: A.bg,
            boxShadow:
              "0 30px 80px rgba(19,17,28,0.18), 0 8px 24px rgba(19,17,28,0.08)",
            border: "8px solid #0b0b10",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              overflow: "auto",
              background: A.bg,
            }}
          >
            {screen}
          </div>

          <ChatSheet
            open={chatOpen}
            onClose={() => setChatOpen(false)}
            messages={chatMessages}
            isLearning={
              sessionState.status === "learning" && currentPageReady
            }
            currentTitle={currentTitle}
            currentIndex={
              sessionState.current_index >= 0
                ? sessionState.current_index
                : undefined
            }
            onSend={sendMessage}
          />
        </div>
      </div>
    </Fragment>
  );
}
