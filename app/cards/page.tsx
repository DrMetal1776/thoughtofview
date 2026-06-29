'use client'
import { useState, useRef, useEffect } from "react";

const ANGLE_COLORS: Record<string, { bg: string; label: string }> = {
  "Hot Take": { bg: "#e85d3a", label: "🔥 HOT TAKE" },
  "Balanced": { bg: "#3a7bd5", label: "⚖️ BALANCED" },
  "Devil's Advocate": { bg: "#7c3aed", label: "😈 DEVIL'S ADVOCATE" },
  "Contrarian": { bg: "#d97706", label: "↩️ CONTRARIAN" },
  "Expert Analysis": { bg: "#059669", label: "🎓 EXPERT ANALYSIS" },
};

export default function TakeCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [topic, setTopic] = useState("");
  const [angle, setAngle] = useState("Hot Take");
  const [headline, setHeadline] = useState("");
  const [body, setBody] = useState("");
  const [generating, setGenerating] = useState(false);
  const [cardReady, setCardReady] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [photoCredit, setPhotoCredit] = useState<{ name: string; link: string } | null>(null);
  const [bgStyle, setBgStyle] = useState<'photo' | 'dark'>('photo');
  const [step, setStep] = useState<'input' | 'preview'>('input');
  const [error, setError] = useState<string | null>(null);

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number): number => {
    const words = text.split(" ");
    let line = "";
    let currentY = y;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      if (ctx.measureText(testLine).width > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + " ";
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
    return currentY;
  };

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const drawCard = async (h: string, b: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const size = 1080;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const angleData = ANGLE_COLORS[angle] || ANGLE_COLORS["Hot Take"];
    const pad = 72;

    // Background
    let photoLoaded = false;
    if (bgStyle === 'photo' && topic) {
      try {
        const photoRes = await fetch(`/api/photo?query=${encodeURIComponent(topic)}`);
        const photoData = await photoRes.json();
        if (photoData.url) {
          const photo = await loadImage(photoData.url);
          const scale = Math.max(size / photo.width, size / photo.height);
          const w = photo.width * scale;
          const h2 = photo.height * scale;
          ctx.drawImage(photo, (size - w) / 2, (size - h2) / 2, w, h2);
          const gradient = ctx.createLinearGradient(0, 0, 0, size);
          gradient.addColorStop(0, 'rgba(0,0,0,0.6)');
          gradient.addColorStop(0.5, 'rgba(0,0,0,0.5)');
          gradient.addColorStop(1, 'rgba(0,0,0,0.88)');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, size, size);
          photoLoaded = true;
          if (photoData.credit) setPhotoCredit({ name: photoData.credit, link: photoData.creditLink });
        }
      } catch (e) { console.error(e); }
    }
    if (!photoLoaded) {
      ctx.fillStyle = "#0d1117";
      ctx.fillRect(0, 0, size, size);
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 1;
      for (let i = 0; i < size; i += 48) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, size); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(size, i); ctx.stroke();
      }
    }

    ctx.fillStyle = "#4dd9c0"; ctx.fillRect(0, 0, size, 6);
    ctx.fillStyle = "#4dd9c0"; ctx.fillRect(0, size - 6, size, 6);

    const badgeY = pad + 20;
    ctx.fillStyle = angleData.bg;
    ctx.beginPath(); ctx.roundRect(pad, badgeY, 320, 52, 26); ctx.fill();
    ctx.fillStyle = "#ffffff"; ctx.font = "bold 22px system-ui, sans-serif"; ctx.textAlign = "left";
    ctx.fillText(angleData.label, pad + 20, badgeY + 34);

    ctx.fillStyle = "rgba(77,217,192,0.2)";
    ctx.beginPath(); ctx.roundRect(pad + 336, badgeY, 200, 52, 26); ctx.fill();
    ctx.fillStyle = "#4dd9c0"; ctx.font = "bold 20px system-ui, sans-serif";
    ctx.fillText(topic.toUpperCase().slice(0, 16), pad + 356, badgeY + 34);

    ctx.fillStyle = "#ffffff"; ctx.font = `bold 56px Georgia, serif`; ctx.textAlign = "left";
    ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 12;
    const headlineY = wrapText(ctx, h, pad, badgeY + 120, size - pad * 2, 70);
    ctx.shadowBlur = 0;

    const dividerY = headlineY + 44;
    ctx.fillStyle = "#4dd9c0"; ctx.fillRect(pad, dividerY, 80, 3);

    ctx.fillStyle = "rgba(255,255,255,0.82)"; ctx.font = "30px Georgia, serif";
    ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 8;
    const bodyMaxY = size - 180;
    const availH = bodyMaxY - (dividerY + 48);
    const maxLines = Math.floor(availH / 46);
    const truncBody = b.length > maxLines * 38 ? b.slice(0, maxLines * 38) + "..." : b;
    wrapText(ctx, truncBody, pad, dividerY + 52, size - pad * 2, 46);
    ctx.shadowBlur = 0;

    ctx.fillStyle = "rgba(0,0,0,0.75)"; ctx.fillRect(0, size - 120, size, 114);

    try {
      const logo = await loadImage("/icon.png");
      const logoSize = 72;
      ctx.save();
      ctx.beginPath();
      ctx.arc(pad - 8 + logoSize / 2, size - 110 + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(logo, pad - 8, size - 110, logoSize, logoSize);
      ctx.restore();
    } catch {
      ctx.fillStyle = "#4dd9c0";
      ctx.beginPath(); ctx.arc(pad + 28, size - 63, 28, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#0d1117"; ctx.font = "bold 24px Georgia, serif"; ctx.textAlign = "center";
      ctx.fillText("TOV", pad + 28, size - 55);
    }

    ctx.fillStyle = "#ffffff"; ctx.font = "bold 36px Georgia, serif"; ctx.textAlign = "left";
    ctx.fillText("Thought ", pad + 92, size - 72);
    ctx.fillStyle = "#4dd9c0";
    ctx.fillText("of View", pad + 92 + ctx.measureText("Thought ").width, size - 72);

    ctx.fillStyle = "#8b949e"; ctx.font = "24px system-ui, sans-serif"; ctx.textAlign = "right";
    ctx.fillText("thoughtofview.com", size - pad, size - 55);
    ctx.font = "italic 22px Georgia, serif";
    ctx.fillText("Got a thought? Get a view.", size - pad, size - 80);
  };

  const generateAll = async () => {
    if (!topic.trim()) return;
    setGenerating(true);
    setError(null);
    setCardReady(false);
    setPhotoCredit(null);

    try {
      // Step 1: Generate the take
      const takeRes = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, angle }),
      });
      const takeData = await takeRes.json();

      if (!takeRes.ok || takeData.error) {
        setError(takeData.error || 'Failed to generate take. Try again.');
        setGenerating(false);
        return;
      }

      setHeadline(takeData.headline);
      setBody(takeData.body);

      // Step 2: Draw the card
      await drawCard(takeData.headline, takeData.body);

      setCardReady(true);
      setStep('preview');
      setDownloaded(false);
    } catch (e) {
      console.error(e);
      setError('Something went wrong. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const regenerateCard = async () => {
    if (!headline) return;
    setGenerating(true);
    setPhotoCredit(null);
    await drawCard(headline, body);
    setCardReady(true);
    setGenerating(false);
  };

  const downloadCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `thoughtofview-${topic.toLowerCase().replace(/\s+/g, "-")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    setDownloaded(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", color: "#e6edf3", fontFamily: "system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #1a2a3a", padding: "32px 24px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <p style={{ color: "#4dd9c0", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Content Tool</p>
          <h1 style={{ fontSize: 36, fontWeight: 700, color: "#ffffff", margin: "0 0 8px" }}>Take Card Generator</h1>
          <p style={{ color: "#8b949e", fontSize: 16, margin: 0 }}>Enter a topic, pick an angle, and get a shareable card in one click.</p>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>

          {/* Left: Controls */}
          <div>
            {/* Topic */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#4dd9c0", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                Topic
              </label>
              <input
                value={topic}
                onChange={e => { setTopic(e.target.value); setCardReady(false); setStep('input'); }}
                onKeyDown={e => e.key === 'Enter' && generateAll()}
                placeholder="e.g. Bitcoin, Remote Work, AI, Climate..."
                style={{ width: "100%", padding: "14px 16px", background: "#161b22", border: "1px solid #21262d", borderRadius: 10, color: "#ffffff", fontSize: 16, outline: "none", boxSizing: "border-box" }}
              />
            </div>

            {/* Angle */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#4dd9c0", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                Angle
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {Object.keys(ANGLE_COLORS).map(a => (
                  <button key={a} onClick={() => { setAngle(a); setCardReady(false); }}
                    style={{
                      padding: "8px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: "pointer",
                      background: angle === a ? ANGLE_COLORS[a].bg : "#161b22",
                      color: angle === a ? "#fff" : "#8b949e",
                      border: `1px solid ${angle === a ? ANGLE_COLORS[a].bg : "#21262d"}`,
                    }}>
                    {ANGLE_COLORS[a].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Background */}
            <div style={{ marginBottom: 32 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#4dd9c0", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                Background
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                {(['photo', 'dark'] as const).map(s => (
                  <button key={s} onClick={() => { setBgStyle(s); setCardReady(false); }}
                    style={{
                      padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer",
                      background: bgStyle === s ? "#4dd9c0" : "#161b22",
                      color: bgStyle === s ? "#0d1117" : "#8b949e",
                      border: `1px solid ${bgStyle === s ? "#4dd9c0" : "#21262d"}`,
                    }}>
                    {s === 'photo' ? '📸 Auto Photo' : '🌑 Dark Grid'}
                  </button>
                ))}
              </div>
              {bgStyle === 'photo' && <p style={{ fontSize: 12, color: "#445566", marginTop: 8 }}>Finds a photo matching your topic from Unsplash.</p>}
            </div>

            {/* Main CTA */}
            <button
              onClick={generateAll}
              disabled={!topic.trim() || generating}
              style={{
                width: "100%", padding: "16px", background: generating ? "#2a2a2a" : "#e85d3a",
                color: "#ffffff", fontWeight: 700, fontSize: 16, border: "none", borderRadius: 12,
                cursor: topic.trim() && !generating ? "pointer" : "not-allowed",
                opacity: topic.trim() ? 1 : 0.5, textTransform: "uppercase", letterSpacing: "0.08em",
                marginBottom: 12,
              }}
            >
              {generating ? "✨ Generating take + card..." : "✨ Generate Take & Card"}
            </button>

            {error && <p style={{ fontSize: 13, color: "#e85d3a", marginBottom: 12 }}>⚠️ {error}</p>}

            {/* Secondary actions */}
            {cardReady && (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
                <button onClick={downloadCard}
                  style={{
                    flex: 1, padding: "12px", background: downloaded ? "#059669" : "#4dd9c0",
                    color: "#0d1117", fontWeight: 700, fontSize: 14, border: "none", borderRadius: 10, cursor: "pointer",
                    textTransform: "uppercase", letterSpacing: "0.08em",
                  }}>
                  {downloaded ? "✓ Downloaded!" : "⬇️ Download PNG"}
                </button>
                <button onClick={regenerateCard}
                  style={{ padding: "12px 16px", background: "#161b22", color: "#8b949e", fontWeight: 600, fontSize: 13, border: "1px solid #21262d", borderRadius: 10, cursor: "pointer" }}>
                  🔄 New photo
                </button>
              </div>
            )}

            {/* Editable take (shown after generation) */}
            {step === 'preview' && headline && (
              <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#4dd9c0", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
                  ✦ Edit & regenerate
                </p>
                <label style={{ display: "block", fontSize: 12, color: "#8b949e", marginBottom: 6 }}>Headline</label>
                <textarea value={headline} onChange={e => { setHeadline(e.target.value); setCardReady(false); }} rows={2}
                  style={{ width: "100%", padding: "10px 12px", background: "#0d1117", border: "1px solid #21262d", borderRadius: 8, color: "#ffffff", fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "Georgia, serif", marginBottom: 12 }} />
                <label style={{ display: "block", fontSize: 12, color: "#8b949e", marginBottom: 6 }}>Body</label>
                <textarea value={body} onChange={e => { setBody(e.target.value); setCardReady(false); }} rows={3}
                  style={{ width: "100%", padding: "10px 12px", background: "#0d1117", border: "1px solid #21262d", borderRadius: 8, color: "#ffffff", fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "Georgia, serif", marginBottom: 12 }} />
                <button onClick={() => drawCard(headline, body).then(() => setCardReady(true))}
                  style={{ padding: "10px 20px", background: "#e85d3a", color: "#fff", fontWeight: 700, fontSize: 13, border: "none", borderRadius: 8, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Update Card
                </button>
              </div>
            )}

            {photoCredit && (
              <p style={{ fontSize: 12, color: "#445566", marginTop: 8 }}>
                Photo by{" "}
                <a href={`${photoCredit.link}?utm_source=thoughtofview&utm_medium=referral`} target="_blank" rel="noopener noreferrer" style={{ color: "#4dd9c0" }}>{photoCredit.name}</a>
                {" "}on{" "}
                <a href="https://unsplash.com?utm_source=thoughtofview&utm_medium=referral" target="_blank" rel="noopener noreferrer" style={{ color: "#4dd9c0" }}>Unsplash</a>
              </p>
            )}

            {cardReady && (
              <div style={{ marginTop: 16, padding: "16px", background: "#161b22", borderRadius: 10, border: "1px solid #1a2a3a" }}>
                <p style={{ fontSize: 13, color: "#4dd9c0", fontWeight: 700, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.08em" }}>✦ Instagram tips</p>
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
              <canvas ref={canvasRef} style={{ width: "100%", height: "auto", display: "block" }} />
              {!cardReady && (
                <div style={{ position: "absolute", inset: 0, background: "#0d1117", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
                  {generating ? (
                    <>
                      <div style={{ fontSize: 48 }}>✨</div>
                      <p style={{ color: "#4dd9c0", fontSize: 15, textAlign: "center", margin: 0, fontWeight: 600 }}>
                        Generating your take<br />and finding a photo...
                      </p>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: 48 }}>🎨</div>
                      <p style={{ color: "#445566", fontSize: 15, textAlign: "center", margin: 0 }}>
                        Enter a topic and click<br />"Generate Take & Card"
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
