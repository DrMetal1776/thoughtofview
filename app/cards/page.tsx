'use client'
import { useState, useRef, useEffect } from "react";

const ANGLE_COLORS = {
  "Hot Take": { bg: "#e85d3a", label: "🔥 HOT TAKE" },
  "Balanced": { bg: "#3a7bd5", label: "⚖️ BALANCED" },
  "Devil's Advocate": { bg: "#7c3aed", label: "😈 DEVIL'S ADVOCATE" },
  "Contrarian": { bg: "#d97706", label: "↩️ CONTRARIAN" },
  "Expert Analysis": { bg: "#059669", label: "🎓 EXPERT ANALYSIS" },
};

const SAMPLE_TAKES = [
  {
    topic: "Remote Work",
    angle: "Hot Take",
    headline: "Remote Work Didn't Kill Productivity — It Killed the Illusion That Butts in Seats = Results",
    body: "Companies demanding RTO aren't protecting culture. They're protecting middle management jobs that only exist to supervise people.",
  },
  {
    topic: "AI & Jobs",
    angle: "Devil's Advocate",
    headline: "Maybe AI Should Replace Most Jobs",
    body: "We built a society where humans must work to deserve to live. AI could free us from that. The question isn't 'will AI take jobs' — it's 'why are we so attached to having them?'",
  },
  {
    topic: "Bitcoin",
    angle: "Contrarian",
    headline: "Bitcoin Is the Most Successful Marketing Campaign in Financial History",
    body: "It has no cash flows, no intrinsic value, and its 'store of value' thesis requires everyone to keep believing in it. That's not a currency. That's a religion.",
  },
];

export default function TakeCard() {
  const canvasRef = useRef(null);
  const [topic, setTopic] = useState("");
  const [angle, setAngle] = useState("Hot Take");
  const [headline, setHeadline] = useState("");
  const [body, setBody] = useState("");
  const [generating, setGenerating] = useState(false);
  const [cardReady, setCardReady] = useState(false);
  const [sampleIndex, setSampleIndex] = useState(0);
  const [downloaded, setDownloaded] = useState(false);

  const loadSample = () => {
    const s = SAMPLE_TAKES[sampleIndex % SAMPLE_TAKES.length];
    setTopic(s.topic);
    setAngle(s.angle);
    setHeadline(s.headline);
    setBody(s.body);
    setSampleIndex(i => i + 1);
    setCardReady(false);
    setDownloaded(false);
  };

  useEffect(() => {
    loadSample();
  }, []);

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number): number => {
    const words = text.split(" ");
    let line = "";
    let lines = [];
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        lines.push({ text: line, x, y });
        line = words[n] + " ";
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    lines.push({ text: line, x, y });
    lines.forEach(l => ctx.fillText(l.text, l.x, l.y));
    return y;
  };

  const generateCard = () => {
    if (!headline) return;
    setGenerating(true);

    const canvas = canvasRef.current;
    const size = 1080;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    const angleData = ANGLE_COLORS[angle] || ANGLE_COLORS["Hot Take"];
    const pad = 72;

    // Background
    ctx.fillStyle = "#0d1117";
    ctx.fillRect(0, 0, size, size);

    // Subtle grid
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    for (let i = 0; i < size; i += 48) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, size); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(size, i); ctx.stroke();
    }

    // Top accent bar
    ctx.fillStyle = "#4dd9c0";
    ctx.fillRect(0, 0, size, 6);

    // Bottom accent bar
    ctx.fillStyle = "#4dd9c0";
    ctx.fillRect(0, size - 6, size, 6);

    // Angle badge
    const badgeY = pad + 20;
    ctx.fillStyle = angleData.bg;
    ctx.beginPath();
    ctx.roundRect(pad, badgeY, 320, 52, 26);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(angleData.label, pad + 20, badgeY + 34);

    // Topic pill
    ctx.fillStyle = "rgba(77,217,192,0.15)";
    ctx.beginPath();
    ctx.roundRect(pad + 336, badgeY, 200, 52, 26);
    ctx.fill();
    ctx.fillStyle = "#4dd9c0";
    ctx.font = "bold 20px system-ui, sans-serif";
    ctx.fillText(topic.toUpperCase(), pad + 356, badgeY + 34);

    // Headline
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold 58px Georgia, serif`;
    ctx.textAlign = "left";
    const headlineY = wrapText(ctx, headline, pad, badgeY + 120, size - pad * 2, 72);

    // Divider
    const dividerY = headlineY + 48;
    ctx.fillStyle = "#4dd9c0";
    ctx.fillRect(pad, dividerY, 80, 3);

    // Body text
    ctx.fillStyle = "#8b949e";
    ctx.font = "32px Georgia, serif";
    const bodyMaxY = size - 180;
    const bodyAvailableHeight = bodyMaxY - (dividerY + 48);
    const bodyLines = Math.floor(bodyAvailableHeight / 48);
    const truncatedBody = body.length > bodyLines * 40 ? body.slice(0, bodyLines * 40) + "..." : body;
    wrapText(ctx, truncatedBody, pad, dividerY + 56, size - pad * 2, 48);

    // Bottom branding bar
    ctx.fillStyle = "rgba(13,17,23,0.95)";
    ctx.fillRect(0, size - 120, size, 114);

    // Eye logo placeholder (circle with teal)
    ctx.fillStyle = "#4dd9c0";
    ctx.beginPath();
    ctx.arc(pad + 28, size - 63, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#0d1117";
    ctx.font = "bold 24px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("TOV", pad + 28, size - 55);

    // Brand name
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 36px Georgia, serif";
    ctx.textAlign = "left";
    ctx.fillText("Thought", pad + 72, size - 72);
    ctx.fillStyle = "#4dd9c0";
    ctx.fillText("of View", pad + 72 + 148, size - 72);

    // URL
    ctx.fillStyle = "#445566";
    ctx.font = "24px system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("thoughtofview.com", size - pad, size - 55);

    // Tagline
    ctx.fillStyle = "#445566";
    ctx.font = "italic 22px Georgia, serif";
    ctx.textAlign = "right";
    ctx.fillText("Got a thought? Get a view.", size - pad, size - 80);

    setGenerating(false);
    setCardReady(true);
    setDownloaded(false);
  };

  const downloadCard = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = `thoughtofview-${topic.toLowerCase().replace(/\s+/g, "-")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    setDownloaded(true);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0d1117",
      color: "#e6edf3",
      fontFamily: "system-ui, sans-serif",
      padding: "0",
    }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid #1a2a3a", padding: "32px 24px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <p style={{ color: "#4dd9c0", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
            Content Tool
          </p>
          <h1 style={{ fontSize: 36, fontWeight: 700, color: "#ffffff", margin: "0 0 8px" }}>
            Take Card Generator
          </h1>
          <p style={{ color: "#8b949e", fontSize: 16, margin: 0 }}>
            Create shareable 1080×1080 cards for Instagram, X, and beyond.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>

        {/* Left: Controls */}
        <div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#4dd9c0", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
              Topic
            </label>
            <input
              value={topic}
              onChange={e => { setTopic(e.target.value); setCardReady(false); }}
              placeholder="e.g. Remote Work, Bitcoin, AI..."
              style={{
                width: "100%", padding: "12px 16px", background: "#161b22", border: "1px solid #21262d",
                borderRadius: 10, color: "#ffffff", fontSize: 15, outline: "none", boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#4dd9c0", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
              Angle
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {Object.keys(ANGLE_COLORS).map(a => (
                <button
                  key={a}
                  onClick={() => { setAngle(a); setCardReady(false); }}
                  style={{
                    padding: "8px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: "pointer",
                    background: angle === a ? ANGLE_COLORS[a].bg : "#161b22",
                    color: angle === a ? "#fff" : "#8b949e",
                    border: `1px solid ${angle === a ? ANGLE_COLORS[a].bg : "#21262d"}`,
                    transition: "all 0.15s",
                  }}
                >
                  {ANGLE_COLORS[a].label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#4dd9c0", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
              Headline
            </label>
            <textarea
              value={headline}
              onChange={e => { setHeadline(e.target.value); setCardReady(false); }}
              placeholder="Your punchy headline..."
              rows={3}
              style={{
                width: "100%", padding: "12px 16px", background: "#161b22", border: "1px solid #21262d",
                borderRadius: 10, color: "#ffffff", fontSize: 15, outline: "none", resize: "vertical",
                boxSizing: "border-box", fontFamily: "Georgia, serif",
              }}
            />
          </div>

          <div style={{ marginBottom: 32 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#4dd9c0", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
              Body (2-3 sentences)
            </label>
            <textarea
              value={body}
              onChange={e => { setBody(e.target.value); setCardReady(false); }}
              placeholder="The supporting argument..."
              rows={4}
              style={{
                width: "100%", padding: "12px 16px", background: "#161b22", border: "1px solid #21262d",
                borderRadius: 10, color: "#ffffff", fontSize: 15, outline: "none", resize: "vertical",
                boxSizing: "border-box", fontFamily: "Georgia, serif",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              onClick={generateCard}
              disabled={!headline || generating}
              style={{
                padding: "14px 28px", background: "#e85d3a", color: "#ffffff", fontWeight: 700,
                fontSize: 14, border: "none", borderRadius: 10, cursor: headline ? "pointer" : "not-allowed",
                opacity: headline ? 1 : 0.5, textTransform: "uppercase", letterSpacing: "0.08em",
              }}
            >
              {generating ? "Generating..." : "Generate Card"}
            </button>

            {cardReady && (
              <button
                onClick={downloadCard}
                style={{
                  padding: "14px 28px", background: downloaded ? "#059669" : "#4dd9c0",
                  color: "#0d1117", fontWeight: 700, fontSize: 14, border: "none",
                  borderRadius: 10, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.08em",
                }}
              >
                {downloaded ? "✓ Downloaded!" : "Download PNG"}
              </button>
            )}

            <button
              onClick={loadSample}
              style={{
                padding: "14px 20px", background: "transparent", color: "#8b949e",
                fontWeight: 600, fontSize: 14, border: "1px solid #21262d",
                borderRadius: 10, cursor: "pointer",
              }}
            >
              Try example →
            </button>
          </div>

          {cardReady && (
            <div style={{ marginTop: 20, padding: "16px", background: "#161b22", borderRadius: 10, border: "1px solid #1a2a3a" }}>
              <p style={{ fontSize: 13, color: "#4dd9c0", fontWeight: 700, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                ✦ Instagram tips
              </p>
              <p style={{ fontSize: 13, color: "#8b949e", margin: "0 0 4px" }}>• Post at 9am, 12pm, or 6pm for best reach</p>
              <p style={{ fontSize: 13, color: "#8b949e", margin: "0 0 4px" }}>• Add hashtags: #HotTakes #AI #ThoughtOfView</p>
              <p style={{ fontSize: 13, color: "#8b949e", margin: 0 }}>• Tag @thoughtofview in the caption</p>
            </div>
          )}
        </div>

        {/* Right: Preview */}
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#4dd9c0", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
            Preview (1080×1080)
          </p>
          <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", border: "1px solid #21262d" }}>
            <canvas
              ref={canvasRef}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
            {!cardReady && (
              <div style={{
                position: "absolute", inset: 0, background: "#0d1117",
                display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12,
              }}>
                <div style={{ fontSize: 48 }}>🎨</div>
                <p style={{ color: "#445566", fontSize: 15, textAlign: "center", margin: 0 }}>
                  Fill in the details and click<br />"Generate Card" to preview
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
