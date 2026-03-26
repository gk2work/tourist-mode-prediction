import { jsPDF } from "jspdf";

/* ── colour palette ──────────────────────────────────────────── */
const C = {
  bg:       [8,  11, 20],
  surface:  [14, 17, 32],
  surface2: [20, 24, 41],
  border:   [26, 30, 50],
  text1:    [238, 240, 247],
  text2:    [136, 146, 176],
  text3:    [74,  84, 112],
  accent:   [99,  102, 241],
  accentLt: [165, 180, 252],
  amber:    [245, 158, 11],
  green:    [34,  197, 94],
  purple:   [167, 139, 250],
  pink:     [244, 114, 182],
  red:      [239, 68,  68],
  white:    [255, 255, 255],
};

function hex(rgb) { return rgb; }

/* ── helpers ─────────────────────────────────────────────────── */
function setFill(doc, rgb)   { doc.setFillColor(...rgb); }
function setDraw(doc, rgb)   { doc.setDrawColor(...rgb); }
function setTxt(doc, rgb)    { doc.setTextColor(...rgb); }
function setFont(doc, size, style = "normal") {
  doc.setFontSize(size);
  doc.setFont("helvetica", style);
}

function rect(doc, x, y, w, h, fill, draw) {
  if (fill) setFill(doc, fill);
  if (draw) setDraw(doc, draw); else setDraw(doc, fill || C.bg);
  doc.rect(x, y, w, h, fill && draw ? "FD" : fill ? "F" : "D");
}

/* Draws a horizontal rule */
function hr(doc, y, margin) {
  setDraw(doc, C.border);
  doc.setLineWidth(0.3);
  doc.line(margin, y, 210 - margin, y);
}

/* Section header with coloured left bar */
function sectionHeader(doc, y, label, accent, margin) {
  rect(doc, margin, y, 3, 7, accent);
  setFont(doc, 9, "bold");
  setTxt(doc, accent);
  doc.text(label.toUpperCase(), margin + 6, y + 5.5);
  return y + 12;
}

/* Two-column data row */
function dataRow(doc, y, label, value, margin, colW, isAlt) {
  if (isAlt) rect(doc, margin, y, colW * 2 + 4, 8, C.surface2);
  setFont(doc, 8, "normal");
  setTxt(doc, C.text3);
  doc.text(label, margin + 2, y + 5.5);
  setTxt(doc, C.text1);
  doc.text(String(value || "—"), margin + colW + 4, y + 5.5, { maxWidth: colW - 4 });
  return y + 8;
}

/* Satisfaction bar row */
function ratingRow(doc, y, label, value, margin, pageW) {
  const trackX  = margin + 90;
  const trackW  = pageW - margin - 90 - margin - 20;
  const fillW   = (value / 5) * trackW;
  const tier    = value >= 3.5 ? C.green : value >= 2.5 ? C.amber : C.red;

  setFont(doc, 8, "normal");
  setTxt(doc, C.text2);
  doc.text(label, margin, y + 4);

  // track
  rect(doc, trackX, y, trackW, 4, C.surface2);
  // fill
  if (fillW > 0) rect(doc, trackX, y, fillW, 4, tier);

  // score
  setFont(doc, 8, "bold");
  setTxt(doc, tier);
  doc.text(String(value.toFixed(1)), trackX + trackW + 3, y + 4);

  return y + 9;
}

/* Badge pill */
function badge(doc, x, y, text, variant) {
  const colors = {
    yes:     { bg: [34,197,94,0.15], fg: [74,222,128], border: [34,197,94] },
    no:      { bg: [239,68,68,0.15], fg: [248,113,113], border: [239,68,68] },
    neutral: { bg: [245,158,11,0.15], fg: [251,191,36], border: [245,158,11] },
  };
  const c = colors[variant] || colors.neutral;
  const tw = doc.getStringUnitWidth(text) * 8 / doc.internal.scaleFactor;
  const pw = tw + 8, ph = 6;
  setFill(doc, c.border); // use solid border color at low opacity — jspdf no RGBA so approximate
  setDraw(doc, c.border);
  doc.roundedRect(x, y - 4, pw, ph, 2, 2, "FD");
  setFill(doc, C.surface2);
  setDraw(doc, C.surface2);
  doc.roundedRect(x + 0.6, y - 3.4, pw - 1.2, ph - 1.2, 1.5, 1.5, "F");
  setFont(doc, 7.5, "bold");
  setTxt(doc, c.fg);
  doc.text(text, x + 4, y + 0.2);
  return pw;
}

/* Scenario row */
function scenarioRow(doc, y, text, val, margin, pageW, isAlt) {
  if (isAlt) rect(doc, margin, y, pageW - 2 * margin, 9, C.surface2);
  setFont(doc, 8, "normal");
  setTxt(doc, C.text2);
  doc.text(text, margin + 2, y + 5.8, { maxWidth: pageW - 2 * margin - 28 });
  const label = val === "yes" ? "Yes" : val === "No" ? "No" : val || "—";
  const variant = val === "yes" ? "yes" : val === "No" ? "no" : "neutral";
  badge(doc, pageW - margin - 22, y + 5.5, label, variant);
  return y + 9;
}

/* ── main export ──────────────────────────────────────────────── */
export function generateReport({ gender, age, income, result }) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const PW = 210, PH = 297;
  const M  = 14;   // margin
  const CW = (PW - 2 * M - 4) / 2;  // column width for two-col grids

  let y = 0;

  /* ── PAGE BACKGROUND ──────────────────────────────────────── */
  rect(doc, 0, 0, PW, PH, C.bg);

  /* ── HEADER BAND ──────────────────────────────────────────── */
  rect(doc, 0, 0, PW, 42, C.surface);
  // accent top stripe
  rect(doc, 0, 0, PW, 2, C.accent);

  // eyebrow
  setFont(doc, 7.5, "bold");
  setTxt(doc, C.accentLt);
  doc.text("TOURIST TRANSPORT ANALYTICS", M, 12);

  // title
  setFont(doc, 18, "bold");
  setTxt(doc, C.text1);
  doc.text("Mode Choice Predictor", M, 24);

  // subtitle
  setFont(doc, 8.5, "normal");
  setTxt(doc, C.text3);
  doc.text("Predictive report based on 107 tourist survey responses", M, 32);

  // date right-aligned
  const now = new Date().toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
  setFont(doc, 7.5, "normal");
  setTxt(doc, C.text3);
  doc.text(`Generated: ${now}`, PW - M, 32, { align: "right" });

  // match pill
  const matchLabel = `Match: ${result.match}  ·  ${result.n} respondent${result.n > 1 ? "s" : ""}`;
  setFont(doc, 8, "bold");
  setTxt(doc, C.accentLt);
  doc.text(matchLabel, PW - M, 12, { align: "right" });

  y = 50;

  /* ── SECTION A: INPUT PARAMETERS ─────────────────────────── */
  y = sectionHeader(doc, y, "Input Parameters", C.accent, M);

  const inputs = [
    ["Gender",         gender],
    ["Age Group",      age + " yrs"],
    ["Monthly Income", income === "<25k" ? "< ₹25,000" : income === "25k-50k" ? "₹25,000 – ₹50,000" : income === "50k-1L" ? "₹50,000 – ₹1,00,000" : "> ₹1,00,000"],
  ];
  inputs.forEach(([lbl, val], i) => {
    y = dataRow(doc, y, lbl, val, M, CW, i % 2 === 0);
  });
  y += 6;
  hr(doc, y, M);
  y += 8;

  /* ── SECTION B: MODE CHOICE BEHAVIOR ─────────────────────── */
  y = sectionHeader(doc, y, "Mode Choice Behavior", C.amber, M);
  const d = result.data;
  const modeRows = [
    ["Primary Mode (City)",   d.primary_mode],
    ["Most Frequent Mode",    d.freq_mode?.includes("Public") ? "Public Transport" : d.freq_mode?.includes("Private") ? "Private Transport" : d.freq_mode || "—"],
    ["Arrival Mode",          d.arrival_mode],
    ["Travel Time / Trip",    d.travel_time],
    ["Travel Cost / Trip",    d.travel_cost ? `₹${d.travel_cost}` : "—"],
    ["Reason for Choice",     d.reason],
  ];
  modeRows.forEach(([lbl, val], i) => {
    y = dataRow(doc, y, lbl, val, M, CW, i % 2 === 0);
  });
  y += 6;
  hr(doc, y, M);
  y += 8;

  /* ── SECTION C: SATISFACTION ──────────────────────────────── */
  y = sectionHeader(doc, y, "Public Transport Satisfaction", C.green, M);

  // PT usage
  const usageColor = d.use_pt === "Regularly" ? C.green : d.use_pt === "Not Prefers" ? C.red : C.amber;
  dataRow(doc, y, "PT Usage Frequency", d.use_pt, M, CW, true);
  // override value color
  setTxt(doc, usageColor);
  setFont(doc, 8, "bold");
  doc.text(d.use_pt, M + CW + 4, y + 5.5);
  y += 10;

  setFont(doc, 7.5, "bold");
  setTxt(doc, C.text3);
  doc.text("SATISFACTION RATINGS  (1 – 5 SCALE)", M, y);
  y += 6;

  const ratings = [
    ["Availability",    d.sat_availability],
    ["Affordability",   d.sat_affordability],
    ["Comfort",         d.sat_comfort],
    ["Safety",          d.sat_safety],
    ["Accessibility",   d.sat_accessibility],
    ["Cleanliness",     d.sat_cleanliness],
    ["Staff Behavior",  d.sat_staff],
    ["Language / Signage", d.sat_language],
  ];
  ratings.forEach(([lbl, val]) => {
    y = ratingRow(doc, y, lbl, val, M, PW);
  });

  // overall with divider
  doc.setLineWidth(0.3);
  setDraw(doc, C.border);
  doc.line(M, y, PW - M, y);
  y += 4;
  y = ratingRow(doc, y, "Overall", d.sat_overall, M, PW);

  y += 6;
  hr(doc, y, M);
  y += 8;

  /* ── SECTION D: GENDER BEHAVIOR ───────────────────────────── */
  y = sectionHeader(doc, y, "Gender-Based Travel Behavior", C.purple, M);

  const genRows = [
    ["Gender influences mode choice?", d.gender_influence === "yes" ? "Yes" : d.gender_influence === "no" ? "No" : "Maybe"],
    ["PT safe for this gender?",       d.pt_safe_gender],
  ];
  genRows.forEach(([lbl, val], i) => {
    y = dataRow(doc, y, lbl, val, M, CW, i % 2 === 0);
  });

  y += 6;
  hr(doc, y, M);
  y += 8;

  /* ── NEW PAGE if running low ─────────────────────────────── */
  if (y > 220) {
    doc.addPage();
    rect(doc, 0, 0, PW, PH, C.bg);
    y = 16;
  }

  /* ── SECTION E: SCENARIO RESPONSES ───────────────────────── */
  y = sectionHeader(doc, y, "Scenario Responses", C.pink, M);

  setFont(doc, 7.5, "bold");
  setTxt(doc, C.text3);
  doc.text("WOULD YOU PREFER PUBLIC TRANSPORT IF…", M, y);
  y += 8;

  const scenarios = [
    ["Tourist attractions connected by single route", d.sc_single_route],
    ["₹100–150 daily unlimited pass available",       d.sc_daily_pass],
    ["Frequency increased by 50%",                    d.sc_freq_increase],
    ["Fares +20% but comfort improved",               d.sc_fare_comfort],
    ["Mobile app with live tracking",                 d.sc_mobile_app],
    ["Stops within 5 min walking distance",           d.sc_5min_stops],
    ["Clear tourist info (routes / maps / schedules)",d.sc_clear_info],
    ["Promoted as eco-friendly option",               d.sc_env_friendly],
  ];
  scenarios.forEach(([text, val], i) => {
    y = scenarioRow(doc, y, text, val, M, PW, i % 2 === 0);
  });

  y += 6;
  hr(doc, y, M);
  y += 8;

  /* ── SECTION F: SUGGESTIONS ───────────────────────────────── */
  y = sectionHeader(doc, y, "Improvement Suggestions", C.accentLt, M);

  // suggestions passed via result
  const suggestions = result.suggestions || [];
  suggestions.forEach((s, i) => {
    // left accent bar
    rect(doc, M, y, 2.5, 8, C.accent);
    // alt bg
    if (i % 2 === 0) rect(doc, M + 2.5, y, PW - 2 * M - 2.5, 8, C.surface2);
    setFont(doc, 8, "normal");
    setTxt(doc, C.text2);
    doc.text(s, M + 6, y + 5.5, { maxWidth: PW - 2 * M - 10 });
    y += 10;
  });

  y += 6;

  /* ── FOOTER ───────────────────────────────────────────────── */
  if (y > 265) {
    doc.addPage();
    rect(doc, 0, 0, PW, PH, C.bg);
    y = PH - 20;
  } else {
    y = PH - 16;
  }
  rect(doc, 0, PH - 14, PW, 14, C.surface);
  setFont(doc, 7, "normal");
  setTxt(doc, C.text3);
  doc.text("Tourist Mode Predictor  ·  Based on 107 survey respondents  ·  tourist-mode-predictor.vercel.app", PW / 2, PH - 5, { align: "center" });

  /* ── SAVE ─────────────────────────────────────────────────── */
  const fileName = `tourist-report-${gender}-${age}-${income}-${Date.now()}.pdf`.toLowerCase().replace(/[^a-z0-9.\-]/g, "-");
  doc.save(fileName);
}
