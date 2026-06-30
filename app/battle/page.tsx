'use client'
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const ANGLE_COLORS: Record<string, { bg: string; text: string; label: string; emoji: string }> = {
  "Hot Take": { bg: "#e85d3a", text: "#ffffff", label: "Hot Take", emoji: "🔥" },
  "Balanced": { bg: "#3a7bd5", text: "#ffffff", label: "Balanced", emoji: "⚖️" },
  "Devil's Advocate": { bg: "#7c3aed", text: "#ffffff", label: "Devil's Advocate", emoji: "😈" },
  "Contrarian": { bg: "#d97706", text: "#ffffff", label: "Contrarian", emoji: "↩️" },
  "Expert Analysis": { bg: "#059669", text: "#ffffff", label: "Expert Analysis", emoji: "🎓" },
};

type Message = { speaker: "A" | "B"; angle: string; text: string };

export default function TakeBattle() {
  const [topic, setTopic] = useState("");
  const [angleA, setAngleA] = useState("Hot Take");
  const [angleB, setAngleB] = useState("Devil's Advocate");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [visibleCount, setVisibleCount] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [showWinner, setShowWinner] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [battleStarted, setBattleStarted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const startBattle = async () => {
    if (!topic.trim() || angleA === angleB) return;
    setLoading(true);
    setError(null);
    setMessages([]);
    setVisibleCount(0);
    setWinner(null);
    setReason(null);
    setShowWinner(false);
    setBattleStarted(true);

    try {
      const res = await fetch('/api/battle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, angleA, angleB }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || 'Battle failed to generate. Try again.');
        if (data.partialMessages?.length) setMessages(data.partialMessages);
        setLoading(false);
        return;
      }

      setMessages(data.messages || []);
      setWinner(data.winner);
      setReason(data.reason);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  // Reveal messages one at a time with animation
  useEffect(() => {
    if (messages.length === 0 || visibleCount >= messages.length) return;
    const timer = setTimeout(() => {
      setVisibleCount(c => c + 1);
    }, 1400);
    return () => clearTimeout(timer);
  }, [messages, visibleCount]);

  // Show winner after all messages revealed
  useEffect(() => {
    if (messages.length > 0 && visibleCount === messages.length && winner) {
      const timer = setTimeout(() => setShowWinner(true), 800);
      return () => clearTimeout(timer);
    }
  }, [visibleCount, messages, winner]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [visibleCount, showWinner]);

  const reset = () => {
    setBattleStarted(false);
    setMessages([]);
    setVisibleCount(0);
    setWinner(null);
    setReason(null);
    setShowWinner(false);
    setError(null);
  };

  const angleAData = ANGLE_COLORS[angleA];
  const angleBData = ANGLE_COLORS[angleB];

  return (
    <div style={{
      minHeight: "100vh",
      color: "#e6edf3", fontFamily: "system-ui, sans-serif",
      position: "relative", overflow: "hidden",
      background: "#0a0d12",
    }}>
      {/* Arena background photo */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: `url('/arena-bg.png')`,
        backgroundSize: "cover", backgroundPosition: "center",
        opacity: 0.45, filter: "blur(1px)",
      }} />

      {/* Dark overlay for readability */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 1000px 700px at 15% -10%, rgba(232,93,58,0.2), transparent 55%),
          radial-gradient(ellipse 1000px 700px at 85% -10%, rgba(124,58,237,0.2), transparent 55%),
          linear-gradient(180deg, rgba(10,13,18,0.75) 0%, rgba(10,13,18,0.92) 40%, rgba(10,13,18,0.97) 100%)
        `,
      }} />

      {/* Content layer */}
      <div style={{ position: "relative", zIndex: 1 }}>

      {/* Arena floor lines — concentric rings like a coliseum */}
      <div style={{
        position: "absolute", left: "50%", top: "45%", transform: "translate(-50%, -50%)",
        width: 1400, height: 1400, borderRadius: "50%",
        border: "1px solid rgba(77,217,192,0.06)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", left: "50%", top: "45%", transform: "translate(-50%, -50%)",
        width: 1000, height: 1000, borderRadius: "50%",
        border: "1px solid rgba(77,217,192,0.08)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", left: "50%", top: "45%", transform: "translate(-50%, -50%)",
        width: 650, height: 650, borderRadius: "50%",
        border: "1px solid rgba(77,217,192,0.1)", pointerEvents: "none",
      }} />

      {/* Torch glows — left (orange) */}
      <div style={{
        position: "absolute", top: "10%", left: "8%", width: 220, height: 220,
        background: "radial-gradient(circle, rgba(232,93,58,0.35), transparent 70%)",
        filter: "blur(30px)", pointerEvents: "none", animation: "flicker 3s ease-in-out infinite",
      }} />
      {/* Torch glows — right (purple) */}
      <div style={{
        position: "absolute", top: "10%", right: "8%", width: 220, height: 220,
        background: "radial-gradient(circle, rgba(124,58,237,0.35), transparent 70%)",
        filter: "blur(30px)", pointerEvents: "none", animation: "flicker 3s ease-in-out infinite 1.5s",
      }} />

      {/* Header */}
      <div style={{ borderBottom: "1px solid #1a2a3a", padding: "32px 24px 24px", position: "relative" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ color: "#e85d3a", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
            ⚔️ New — Live AI Debate
          </p>
          <h1 style={{ fontSize: 36, fontWeight: 700, color: "#ffffff", margin: "0 0 8px" }}>
            Take Battle
          </h1>
          <p style={{ color: "#8b949e", fontSize: 16, margin: 0 }}>
            Watch two AI perspectives go head-to-head on any topic. Winner takes all.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px", position: "relative" }}>

        {!battleStarted && (
          <div>
            {/* Topic input */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#4dd9c0", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                Topic
              </label>
              <input
                value={topic}
                onChange={e => setTopic(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && startBattle()}
                placeholder="e.g. Remote Work, Bitcoin, AI taking jobs..."
                style={{ width: "100%", padding: "14px 16px", background: "#161b22", border: "1px solid #21262d", borderRadius: 10, color: "#ffffff", fontSize: 16, outline: "none", boxSizing: "border-box" }}
              />
            </div>

            {/* Fighter selection */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 16, alignItems: "center", marginBottom: 32 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#e85d3a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                  Fighter A
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {Object.keys(ANGLE_COLORS).map(a => (
                    <button key={a} onClick={() => setAngleA(a)}
                      disabled={a === angleB}
                      style={{
                        padding: "10px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                        cursor: a === angleB ? "not-allowed" : "pointer",
                        opacity: a === angleB ? 0.3 : 1,
                        background: angleA === a ? ANGLE_COLORS[a].bg : "#161b22",
                        color: angleA === a ? "#fff" : "#8b949e",
                        border: `1px solid ${angleA === a ? ANGLE_COLORS[a].bg : "#21262d"}`,
                        textAlign: "left",
                      }}>
                      {ANGLE_COLORS[a].emoji} {a}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ textAlign: "center", position: "relative" }}>
                <div style={{
                  fontSize: 32, fontWeight: 900, color: "#fff",
                  textShadow: "0 0 20px rgba(232,93,58,0.6), 0 0 40px rgba(124,58,237,0.4)",
                  animation: "pulseVs 2s ease-in-out infinite",
                }}>⚔️</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#445566", marginTop: 4 }}>VS</div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                  Fighter B
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {Object.keys(ANGLE_COLORS).map(a => (
                    <button key={a} onClick={() => setAngleB(a)}
                      disabled={a === angleA}
                      style={{
                        padding: "10px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                        cursor: a === angleA ? "not-allowed" : "pointer",
                        opacity: a === angleA ? 0.3 : 1,
                        background: angleB === a ? ANGLE_COLORS[a].bg : "#161b22",
                        color: angleB === a ? "#fff" : "#8b949e",
                        border: `1px solid ${angleB === a ? ANGLE_COLORS[a].bg : "#21262d"}`,
                        textAlign: "left",
                      }}>
                      {ANGLE_COLORS[a].emoji} {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={startBattle}
              disabled={!topic.trim()}
              style={{
                width: "100%", padding: "18px", background: "#e85d3a", color: "#ffffff",
                fontWeight: 800, fontSize: 16, border: "none", borderRadius: 12,
                cursor: topic.trim() ? "pointer" : "not-allowed", opacity: topic.trim() ? 1 : 0.5,
                textTransform: "uppercase", letterSpacing: "0.08em",
              }}
            >
              ⚔️ Start the Battle
            </button>
          </div>
        )}

        {battleStarted && (
          <div>
            {/* Battle header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 24,
              padding: "20px", borderRadius: 12, position: "relative", overflow: "hidden",
              background: "linear-gradient(90deg, rgba(232,93,58,0.1), rgba(13,17,23,0.9) 50%, rgba(124,58,237,0.1))",
              border: "1px solid #21262d",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 22 }}>{angleAData.emoji}</span>
                <span style={{ fontWeight: 800, color: angleAData.bg, fontSize: 15, textShadow: `0 0 12px ${angleAData.bg}88` }}>{angleA}</span>
              </div>
              <span style={{ fontSize: 18, fontWeight: 900, color: "#fff", animation: "pulseVs 2s ease-in-out infinite" }}>⚔️</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontWeight: 800, color: angleBData.bg, fontSize: 15, textShadow: `0 0 12px ${angleBData.bg}88` }}>{angleB}</span>
                <span style={{ fontSize: 22 }}>{angleBData.emoji}</span>
              </div>
            </div>
            <p style={{ textAlign: "center", color: "#4dd9c0", fontSize: 13, marginBottom: 24, fontWeight: 600 }}>
              "{topic}"
            </p>

            {/* Chat transcript */}
            <div ref={scrollRef} style={{ maxHeight: 520, overflowY: "auto", marginBottom: 24, paddingRight: 4 }}>
              {messages.slice(0, visibleCount).map((m, i) => {
                const data = ANGLE_COLORS[m.angle];
                const isA = m.speaker === "A";
                return (
                  <div key={i} style={{
                    display: "flex", justifyContent: isA ? "flex-start" : "flex-end",
                    marginBottom: 14, animation: "fadeIn 0.4s ease",
                  }}>
                    <div style={{ maxWidth: "78%" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexDirection: isA ? "row" : "row-reverse" }}>
                        <span style={{ fontSize: 14 }}>{data.emoji}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: data.bg, textTransform: "uppercase", letterSpacing: "0.05em" }}>{m.angle}</span>
                      </div>
                      <div style={{
                        padding: "12px 16px", borderRadius: 16,
                        borderTopLeftRadius: isA ? 4 : 16,
                        borderTopRightRadius: isA ? 16 : 4,
                        background: data.bg + "22",
                        border: `1px solid ${data.bg}55`,
                        color: "#e6edf3", fontSize: 15, lineHeight: 1.5,
                      }}>
                        {m.text}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {loading && visibleCount === 0 && (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#4dd9c0", fontSize: 14, fontWeight: 600 }}>
                  ⚔️ The debate is starting...
                </div>
              )}
              {(loading || visibleCount < messages.length) && messages.length > 0 && visibleCount < messages.length && (
                <div style={{ display: "flex", justifyContent: visibleCount % 2 === 0 ? "flex-start" : "flex-end", marginBottom: 14 }}>
                  <div style={{ padding: "12px 16px", borderRadius: 16, background: "#21262d", color: "#445566", fontSize: 14 }}>
                    typing...
                  </div>
                </div>
              )}

              {/* Winner reveal */}
              {showWinner && winner && (
                <div style={{
                  textAlign: "center", padding: "24px", marginTop: 16,
                  background: "linear-gradient(135deg, rgba(232,93,58,0.15), rgba(77,217,192,0.15))",
                  border: "1px solid #4dd9c0", borderRadius: 16, animation: "fadeIn 0.6s ease",
                }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#4dd9c0", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                    🏆 Winner
                  </p>
                  <p style={{ fontSize: 24, fontWeight: 800, color: "#ffffff", margin: "0 0 8px" }}>
                    {winner}
                  </p>
                  {reason && <p style={{ fontSize: 14, color: "#8b949e", margin: 0, fontStyle: "italic" }}>"{reason}"</p>}
                </div>
              )}
            </div>

            {error && (
              <p style={{ textAlign: "center", color: "#e85d3a", fontSize: 14, marginBottom: 16 }}>⚠️ {error}</p>
            )}

            {/* Actions */}
            {(showWinner || error) && (
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <button onClick={reset}
                  style={{ padding: "12px 24px", background: "#e85d3a", color: "#fff", fontWeight: 700, fontSize: 14, border: "none", borderRadius: 10, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  ⚔️ New Battle
                </button>
                <Link href="/cards"
                  style={{ padding: "12px 24px", background: "#161b22", color: "#8b949e", fontWeight: 600, fontSize: 14, border: "1px solid #21262d", borderRadius: 10, textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
                  🎨 Make a card instead
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseVs {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        @keyframes flicker {
          0%, 100% { opacity: 1; transform: scale(1); }
          25% { opacity: 0.7; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.05); }
          75% { opacity: 0.85; transform: scale(0.98); }
        }
      `}</style>
      </div>
    </div>
  );
}
