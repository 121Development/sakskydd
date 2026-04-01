import { useState } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────
const C = {
  bg: "#0b0f14",
  surface: "rgba(255,255,255,0.025)",
  border: "rgba(255,255,255,0.07)",
  borderHover: "rgba(255,255,255,0.12)",
  gold: "#c8a84b",
  goldDim: "rgba(200,168,75,0.15)",
  goldBorder: "rgba(200,168,75,0.3)",
  red: "#c0392b",
  orange: "#e67e22",
  green: "#27ae60",
  text: "#f0ece4",
  textMid: "rgba(240,236,228,0.7)",
  textDim: "rgba(240,236,228,0.45)",
  mono: "'DM Mono', monospace",
  serif: "'EB Garamond', Georgia, serif",
};

// ─── DATA ──────────────────────────────────────────────────────────────────

interface Question {
  id: string;
  text: string;
  detail: string;
}

interface Category {
  id: string;
  label: string;
  icon: string;
  desc: string;
}

interface Level {
  id: string;
  label: string;
  detail: string;
}

interface ProtectionType {
  id: string;
  label: string;
  icon: string;
  desc: string;
  levels: Level[];
}

interface Perspective {
  id: string;
  label: string;
  icon: string;
  desc: string;
}

const SCREENING_A: Question[] = [
  { id: "classified", text: "Hanterar ni säkerhetsskyddsklassificerade uppgifter?", detail: "Uppgifter med sekretess enligt OSL kopplade till Sveriges säkerhet – t.ex. försvars-, utrikes- eller underrättelsesekretess. (1 kap. 2 §)" },
  { id: "international", text: "Omfattas ni av ett internationellt åtagande om säkerhetsskydd?", detail: "T.ex. EU- eller NATO-förpliktelser om hantering av klassificerade uppgifter. (1 kap. 1 §)" },
  { id: "signal", text: "Förfogar ni över signalskyddsmaterial eller signalskyddsbefattningar?", detail: "Försvarsmaktens godkända kryptosystem för skydd av säkerhetskänslig information." },
  { id: "secclass", text: "Är befattningar i er organisation placerade i säkerhetsklass 1, 2 eller 3?", detail: "Krävs när personal kan ta del av hemliga/konfidentiella uppgifter eller orsaka allvarlig skada. (3 kap. 5–8 §§)" },
  { id: "exposure", text: "Ger ni externa aktörer tillgång till konfidentiell eller högre klassificerad information via upphandling, avtal eller samverkan?", detail: "Utlöser krav på säkerhetsskyddsavtal innan tillgång ges. Gäller även underleverantörer. (4 kap. 1 §)" },
];

const SCREENING_B: Question[] = [
  { id: "totaldefense", text: "Ingår er verksamhet i totalförsvaret?", detail: "Militärt eller civilt försvar. Totalförsvarsroll innebär inte automatiskt säkerhetskänslighet." },
  { id: "societal", text: "Bedriver ni samhällsviktig verksamhet?", detail: "Energi, vatten, livsmedel, elektronisk kommunikation, transporter, finansiella tjänster eller liknande." },
  { id: "beredskap", text: "Är ni en beredskapsmyndighet eller sektorsansvarig myndighet?", detail: "Statlig myndighet med ansvar inom viktiga samhällsfunktioner för krisberedskap och totalförsvar." },
  { id: "central_role", text: "Är ni en central nod i en samhällsfunktion som Sverige är nationellt beroende av?", detail: "T.ex. transmissionsnät, nationell kommunikationsinfrastruktur, centrala betalningssystem." },
  { id: "damage_generating", text: "Kan er anläggning vid ett angrepp generera skada på andra säkerhetskänsliga verksamheter – via påverkan på liv, hälsa eller infrastruktur?", detail: "T.ex. kärntekniska verksamheter, stora dammar, kemiska industrier. (Skadegenererande verksamhet)" },
  { id: "economy", text: "Är er verksamhet väsentlig för Sveriges betalningsförmåga eller finansiella stabilitet på nationell nivå?", detail: "T.ex. centrala system kopplade till det nationella betalningssystemet. (Verksamhet av betydelse för Sveriges ekonomi)" },
  { id: "secclass_decides", text: "Är ni en statlig myndighet med mandat att besluta om placering i säkerhetsklass?", detail: "Enligt bilagan till säkerhetsskyddsförordningen. Kan inte göras utan att bedriva säkerhetskänslig verksamhet. (3 kap. 12 §)" },
  { id: "multiple_contracts", text: "Är ni leverantör med flera kunder som var och ett kräver säkerhetsskyddsavtal?", detail: "Samlade uppdrag kan i sig konstituera säkerhetskänslig verksamhet, t.ex. driftstjänster till flera myndigheter." },
  { id: "protected_obj", text: "Har ni fått beslut om skyddsobjekt?", detail: "Stark indikator – innebär inte automatiskt säkerhetskänslighet men motiverar analys." },
  { id: "transfer", text: "Planerar ni att överlåta hela eller delar av er verksamhet, eller egendom av betydelse för Sveriges säkerhet?", detail: "Kräver säkerhetsskyddsbedömning och samråd. Överlåtelse utan samråd kan förklaras ogiltig. (4 kap. 13–18 §§)" },
];

const NATIONAL_Q: Question = {
  id: "national",
  text: "Kan ett antagonistiskt angrepp mot er verksamhet medföra skadekonsekvenser på nationell nivå?",
  detail: "Störningar i leveranser, tjänster eller funktioner nödvändiga för samhällets funktionalitet nationellt – eller följdverkningar som påverkar Sveriges suveränitet, ekonomi eller andra säkerhetskänsliga verksamheter. Lokal anläggning kan ha nationell räckvidd.",
};

const CATEGORIES: Category[] = [
  { id: "yttre", label: "Sveriges yttre säkerhet", icon: "🛡", desc: "Territoriell suveränitet, nationellt försvar, Försvarsmaktens förmåga, försvarsindustri, internationella försvarssamarbeten." },
  { id: "inre", label: "Sveriges inre säkerhet", icon: "⚖", desc: "Demokratiskt statsskick, rättsväsende, brottsbekämpande förmåga, skydd mot subversiv verksamhet. T.ex. Valmyndigheten, domstolar, polisen." },
  { id: "samhall", label: "Nationellt samhällsviktig verksamhet", icon: "⚡", desc: "Tjänster, leveranser, funktioner nödvändiga för samhällets funktionalitet nationellt. T.ex. el, vatten, telecom, betalningssystem, livsmedel, transporter." },
  { id: "ekonomi", label: "Verksamhet av betydelse för Sveriges ekonomi", icon: "🏦", desc: "Nationell betalningsförmåga och finansiell stabilitet. Centrala system i betalningsinfrastrukturen." },
  { id: "skadegen", label: "Skadegenererande verksamhet", icon: "☢", desc: "Verksamhet som vid antagonistisk handling kan generera skada på andra säkerhetskänsliga verksamheter via påverkan på liv, hälsa eller infrastruktur. T.ex. kärnkraft, dammar, kemisk industri." },
];

const PROTECTION_TYPES: ProtectionType[] = [
  {
    id: "uppgifter", label: "Säkerhetsskyddsklassificerade uppgifter", icon: "📄",
    desc: "Uppgifter med sekretess kopplad till Sveriges säkerhet. Delas in i säkerhetsskyddsklass utifrån skada vid röjande.",
    levels: [
      { id: "kval_hemlig", label: "Kvalificerat hemlig", detail: "Synnerligen allvarlig skada" },
      { id: "hemlig", label: "Hemlig", detail: "Allvarlig skada" },
      { id: "konfidentiell", label: "Konfidentiell", detail: "Inte obetydlig skada" },
      { id: "begransat", label: "Begränsat hemlig", detail: "Ringa skada" },
    ],
  },
  {
    id: "anlaggningar", label: "Anläggningar, objekt, system, egendom och andra tillgångar", icon: "🏗",
    desc: "Fysiska och digitala tillgångar av betydelse för Sveriges säkerhet. Delas in i konsekvensnivå A–D.",
    levels: [
      { id: "niva_a", label: "Nivå A – Synnerligen allvarlig", detail: "Kritiska funktioner slås ut, svårt att återgå" },
      { id: "niva_b", label: "Nivå B – Allvarlig", detail: "Allvarliga begränsningar i Sveriges handlingsfrihet" },
      { id: "niva_c", label: "Nivå C – Inte obetydlig", detail: "Påtaglig påverkan, möjligt att återgå inom rimlig tid" },
      { id: "niva_d", label: "Nivå D – Ringa", detail: "Liten påverkan, relativt snabb återgång möjlig" },
    ],
  },
  {
    id: "internationellt", label: "Verksamhet som omfattas av internationellt åtagande", icon: "🌐",
    desc: "EU- eller NATO-klassificerade uppgifter behandlas enligt respektive åtagande. T.ex. EU CONFIDENTIAL, NATO SECRET.",
    levels: [],
  },
];

const PERSPECTIVES: Perspective[] = [
  { id: "konfidentialitet", label: "Konfidentialitet", icon: "🔒", desc: "Skada uppstår om uppgifter obehörigen röjs. Gäller alltid för säkerhetsskyddsklassificerade uppgifter." },
  { id: "riktighet", label: "Riktighet", icon: "✓", desc: "Skada uppstår om uppgifter obehörigen ändras eller manipuleras, t.ex. positionsdata eller beslutsstöd." },
  { id: "tillgänglighet", label: "Tillgänglighet", icon: "⏱", desc: "Skada uppstår om skyddsvärden görs otillgängliga. Centralt är efter hur lång tid avbrott riskerar medföra skada." },
];

const ANALYSIS_STEPS = [
  { num: 1, title: "Verksamhetsbeskrivning", ref: "2 kap. 2 § PMFS 2022:1", desc: "Beskriv hela verksamheten övergripande. Specificera vilka delar som är av betydelse för Sveriges säkerhet och utifrån vilken kategori. Motivera bedömningarna." },
  { num: 2, title: "Identifiera och bedöma skyddsvärden", ref: "2 kap. 3–5 §§ PMFS 2022:1", desc: "Identifiera: (1) klassificerade uppgifter och deras klass, (2) anläggningar/system och deras konsekvensnivå A–D, (3) verksamhet under internationellt åtagande. Bedöm perspektiv: konfidentialitet, riktighet, tillgänglighet." },
  { num: 3, title: "Säkerhetshot och dimensionerande antagonistiska förmågor", ref: "2 kap. 6–7 §§ PMFS 2022:1", desc: "Identifiera hot kopplade till skyddsvärdena. Begär beskrivning av dimensionerande antagonistiska förmågor från Säkerhetspolisen (via tillsynsmyndigheten). Beakta cyberangrepp, spionage, sabotage, terroristbrott och gråzonshandlingar." },
  { num: 4, title: "Sårbarhetsbedömning", ref: "2 kap. 8 § PMFS 2022:1", desc: "Identifiera luckor i befintligt skydd i förhållande till författningskrav och antagonistiska förmågor. Tänk som en antagonist. Kan innefatta penetrationstester, granskning av rutiner och incidentanalys." },
  { num: 5, title: "Säkerhetsskyddsåtgärder och plan", ref: "2 kap. 9 §, 12 § PMFS 2022:1", desc: "Bestäm åtgärder inom informationssäkerhet, fysisk säkerhet och personalsäkerhet. Sammanställ i en säkerhetsskyddsplan med ansvariga funktioner och tidplan. Fastställs av säkerhetsskyddschefen." },
];

// ─── COMPONENTS ───────────────────────────────────────────────────────────

const Tag = ({ children, color = C.gold, bg }: { children: React.ReactNode; color?: string; bg?: string }) => (
  <span style={{
    display: "inline-block", padding: "2px 9px",
    background: bg || `${color}18`,
    border: `1px solid ${color}44`,
    borderRadius: 3, fontSize: 10.5, letterSpacing: "0.12em",
    textTransform: "uppercase", color, fontFamily: C.mono,
  }}>{children}</span>
);

const Divider = ({ label }: { label?: string }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "28px 0" }}>
    <div style={{ flex: 1, height: 1, background: C.border }} />
    {label && <span style={{ fontSize: 10.5, letterSpacing: "0.1em", color: C.textDim, fontFamily: C.mono, textTransform: "uppercase", whiteSpace: "nowrap" }}>{label}</span>}
    <div style={{ flex: 1, height: 1, background: C.border }} />
  </div>
);

const YesNoBtn = ({ active, yes, onClick }: { active: boolean; yes: boolean; onClick: () => void }) => (
  <button onClick={onClick} style={{
    padding: "5px 18px", borderRadius: 3, cursor: "pointer", transition: "all 0.14s",
    border: `1px solid ${active ? (yes ? C.goldBorder : "rgba(90,110,130,0.5)") : C.border}`,
    background: active ? (yes ? C.goldDim : "rgba(80,100,120,0.2)") : "transparent",
    color: active ? (yes ? C.gold : "#7a9ab8") : C.textDim,
    fontSize: 12, fontWeight: 600, letterSpacing: "0.09em",
    textTransform: "uppercase", fontFamily: C.mono,
  }}>{yes ? "Ja" : "Nej"}</button>
);

const QCard = ({ q, answers, onChange }: { q: Question; answers: Record<string, string>; onChange: (id: string, v: string) => void }) => {
  const v = answers[q.id];
  return (
    <div style={{
      background: v ? "rgba(255,255,255,0.03)" : C.surface,
      border: `1px solid ${v === "yes" ? C.goldBorder : C.border}`,
      borderRadius: 7, padding: "16px 18px", marginBottom: 8, transition: "all 0.18s",
    }}>
      <p style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 500, color: C.text, lineHeight: 1.5, fontFamily: C.serif }}>{q.text}</p>
      <p style={{ margin: "0 0 11px", fontSize: 12.5, color: C.textDim, lineHeight: 1.5, fontFamily: C.mono }}>{q.detail}</p>
      <div style={{ display: "flex", gap: 6 }}>
        <YesNoBtn active={v === "yes"} yes onClick={() => onChange(q.id, "yes")} />
        <YesNoBtn active={v === "no"} yes={false} onClick={() => onChange(q.id, "no")} />
      </div>
    </div>
  );
};

const CheckCard = ({ item, selected, onToggle }: { item: { icon?: string; label: string; desc?: string; detail?: string }; selected: boolean; onToggle: () => void }) => (
  <div onClick={onToggle} style={{
    background: selected ? C.goldDim : C.surface,
    border: `1px solid ${selected ? C.goldBorder : C.border}`,
    borderRadius: 7, padding: "14px 16px", marginBottom: 7,
    cursor: "pointer", transition: "all 0.16s",
    display: "flex", alignItems: "flex-start", gap: 12,
  }}>
    <div style={{
      width: 18, height: 18, borderRadius: 3, flexShrink: 0, marginTop: 2,
      border: `1px solid ${selected ? C.gold : "rgba(255,255,255,0.2)"}`,
      background: selected ? C.gold : "transparent",
      display: "flex", alignItems: "center", justifyContent: "center",
      transition: "all 0.14s",
    }}>
      {selected && <span style={{ color: "#0b0f14", fontSize: 12, fontWeight: 800 }}>✓</span>}
    </div>
    <div style={{ flex: 1 }}>
      <p style={{ margin: "0 0 3px", fontSize: 15, fontWeight: 500, color: C.text, fontFamily: C.serif }}>
        {item.icon && <span style={{ marginRight: 6 }}>{item.icon}</span>}{item.label}
      </p>
      <p style={{ margin: 0, fontSize: 12.5, color: C.textDim, lineHeight: 1.5, fontFamily: C.mono }}>{item.desc || item.detail}</p>
    </div>
  </div>
);

const ProgressBar = ({ step, labels }: { step: number; total: number; labels: string[] }) => (
  <div style={{ marginBottom: 28 }}>
    <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
      {labels.map((l, i) => (
        <div key={i} style={{ flex: 1, textAlign: "center" }}>
          <div style={{
            height: 3, borderRadius: 2, marginBottom: 5,
            background: i < step ? "linear-gradient(90deg,#c8a84b,#9a6820)" : i === step ? C.goldBorder : C.border,
            transition: "background 0.3s",
          }} />
          <span style={{
            fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase",
            color: i <= step ? C.gold : C.textDim, fontFamily: C.mono,
            display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>{l}</span>
        </div>
      ))}
    </div>
  </div>
);

const PrimaryBtn = ({ onClick, children, disabled }: { onClick: () => void; children: React.ReactNode; disabled?: boolean }) => (
  <button onClick={onClick} disabled={disabled} style={{
    padding: "11px 32px",
    background: disabled ? "rgba(200,168,75,0.08)" : "linear-gradient(135deg,#c8a84b,#9a6820)",
    border: `1px solid ${disabled ? C.goldBorder : "transparent"}`,
    borderRadius: 4, color: disabled ? C.gold : "#0b0f14",
    fontSize: 12.5, fontWeight: 700, letterSpacing: "0.1em",
    textTransform: "uppercase", cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: C.mono, boxShadow: disabled ? "none" : "0 4px 16px rgba(200,168,75,0.18)",
    transition: "all 0.16s", opacity: disabled ? 0.5 : 1,
  }}>{children}</button>
);

const GhostBtn = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick} style={{
    padding: "9px 22px", background: "transparent",
    border: `1px solid ${C.border}`, borderRadius: 3,
    color: C.textDim, fontSize: 12, letterSpacing: "0.07em",
    textTransform: "uppercase", cursor: "pointer", fontFamily: C.mono,
  }}>{children}</button>
);

// ─── MAIN ──────────────────────────────────────────────────────────────────

const STEPS = ["Screening", "Kategori", "Skyddsvärden", "Analys"];

export default function App() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selectedProtTypes, setSelectedProtTypes] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<Record<string, string>>({});
  const [selectedPersp, setSelectedPersp] = useState<string[]>([]);

  const setAns = (id: string, v: string) => setAnswers(p => ({ ...p, [id]: v }));
  const toggleSet = (setter: React.Dispatch<React.SetStateAction<string[]>>, val: string) => setter(p => p.includes(val) ? p.filter(x => x !== val) : [...p, val]);

  const directYes = SCREENING_A.some(q => answers[q.id] === "yes");
  const indicatorYes = SCREENING_B.filter(q => answers[q.id] === "yes");
  const allADone = SCREENING_A.every(q => answers[q.id]);
  const allBDone = SCREENING_B.every(q => answers[q.id]);
  const needsNational = !directYes && indicatorYes.length > 0;
  const nationalAnswered = answers["national"] !== undefined;
  const screeningDone = allADone && allBDone && (!needsNational || nationalAnswered);

  const isApplicable = directYes || (indicatorYes.length > 0 && answers["national"] === "yes");
  const isUnclear = !directYes && indicatorYes.length > 0 && answers["national"] === "no";
  const isNotApplicable = allADone && allBDone && !directYes && indicatorYes.length === 0;

  const getVerdict = () => {
    if (directYes) return { level: "TRÄFFAS", color: C.red };
    if (indicatorYes.length > 0 && answers["national"] === "yes") return { level: "SANNOLIKT TRÄFFAS", color: C.orange };
    if (isUnclear) return { level: "OSÄKERT", color: C.gold };
    return { level: "TRÄFFAS EJ", color: C.green };
  };

  const canProceedToAnalysis = isApplicable && screeningDone;

  const verdict = getVerdict();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box} body{margin:0;background:${C.bg}}
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:${C.bg}}
        ::-webkit-scrollbar-thumb{background:#1e2a38;border-radius:2px}
        details>summary{list-style:none} details>summary::-webkit-details-marker{display:none}
        .hover-card:hover{border-color:rgba(255,255,255,0.12)!important;background:rgba(255,255,255,0.04)!important}
      `}</style>

      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: C.serif, paddingBottom: 80 }}>

        {/* HEADER */}
        <div style={{ borderBottom: `1px solid ${C.border}`, padding: "32px 20px 24px", textAlign: "center" }}>
          <Tag>Säkerhetspolisen · Säkerhetsskyddslagen 2018:585 · Vägledning jan. 2023</Tag>
          <h1 style={{ margin: "12px 0 6px", fontSize: "clamp(20px,4vw,27px)", fontWeight: 500, letterSpacing: "-0.01em" }}>
            Guide: Säkerhetsskyddsanalys för er verksamhet
          </h1>
          <p style={{ margin: 0, fontSize: 15, color: C.textMid, lineHeight: 1.6, maxWidth: 480, marginInline: "auto", padding: "0 10px" }}>
            En stegvis genomgång – från att avgöra om lagen träffar er, till vad en säkerhetsskyddsanalys ska innehålla
          </p>
        </div>

        <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 18px" }}>
          <div style={{ marginTop: 28 }}>
            <ProgressBar step={step} total={STEPS.length} labels={STEPS} />
          </div>

          {/* ═══ STEP 0: SCREENING ═══ */}
          {step === 0 && (
            <div>
              {/* Section A */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ marginBottom: 14 }}>
                  <Tag color={C.red}>Direkta omständigheter — Del A</Tag>
                  <h2 style={{ margin: "8px 0 4px", fontSize: 18, fontWeight: 500 }}>Lagen träffar er om något av följande stämmer</h2>
                  <p style={{ margin: 0, fontSize: 14, color: C.textDim, lineHeight: 1.5 }}>
                    Ett Ja räcker – ni bedriver per definition säkerhetskänslig verksamhet.
                  </p>
                </div>
                {SCREENING_A.map(q => <QCard key={q.id} q={q} answers={answers} onChange={setAns} />)}
              </div>

              <Divider label="Om inte Del A träffar er" />

              {/* Section B */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ marginBottom: 14 }}>
                  <Tag color={C.orange}>Indikatorer — Del B</Tag>
                  <h2 style={{ margin: "8px 0 4px", fontSize: 18, fontWeight: 500 }}>Ni kan bedriva säkerhetskänslig verksamhet om…</h2>
                  <p style={{ margin: 0, fontSize: 14, color: C.textDim, lineHeight: 1.5 }}>
                    Lagen träffar er inte automatiskt – avgörande är om ett angrepp kan medföra nationella skadekonsekvenser.
                  </p>
                </div>
                {SCREENING_B.map(q => <QCard key={q.id} q={q} answers={answers} onChange={setAns} />)}
              </div>

              {/* National follow-up */}
              {needsNational && (
                <div style={{ padding: "20px 18px", background: C.goldDim, border: `1px solid ${C.goldBorder}`, borderRadius: 7, marginBottom: 24 }}>
                  <Tag>Avgörande följdfråga — prop. 2017/18:89</Tag>
                  <p style={{ margin: "10px 0 4px", fontSize: 16, fontWeight: 500, lineHeight: 1.5 }}>{NATIONAL_Q.text}</p>
                  <p style={{ margin: "0 0 12px", fontSize: 12.5, color: C.textDim, lineHeight: 1.55, fontFamily: C.mono }}>{NATIONAL_Q.detail}</p>
                  <div style={{ display: "flex", gap: 6 }}>
                    <YesNoBtn active={answers["national"] === "yes"} yes onClick={() => setAns("national", "yes")} />
                    <YesNoBtn active={answers["national"] === "no"} yes={false} onClick={() => setAns("national", "no")} />
                  </div>
                </div>
              )}

              {/* Intermediate verdict */}
              {screeningDone && (
                <div style={{ padding: "18px 18px", background: `${verdict.color}10`, border: `1px solid ${verdict.color}40`, borderRadius: 7, marginBottom: 22, textAlign: "center" }}>
                  <Tag color={verdict.color}>{verdict.level}</Tag>
                  <p style={{ margin: "10px 0 4px", fontSize: 17, fontWeight: 500 }}>
                    {directYes && "Er verksamhet träffas av säkerhetsskyddslagen"}
                    {!directYes && answers["national"] === "yes" && "Er verksamhet träffas sannolikt av lagen"}
                    {isUnclear && "Oklart – fördjupad analys rekommenderas"}
                    {isNotApplicable && "Er verksamhet bedöms inte träffas av lagen"}
                  </p>
                  <p style={{ margin: 0, fontSize: 14, color: C.textMid, lineHeight: 1.55, maxWidth: 480, marginInline: "auto" }}>
                    {directYes && "Direkta omständigheter föreligger. Gå vidare för att kartlägga er verksamhets säkerhetsskyddsbehov."}
                    {!directYes && answers["national"] === "yes" && "Indikatorer finns och ett angrepp kan ge nationella konsekvenser. Gå vidare för att strukturera er analys."}
                    {isUnclear && "Indikatorer finns men nationella konsekvenser bedöms inte föreligga. Säkerhetspolisens vägledning ger ytterligare stöd."}
                    {isNotApplicable && "Inga omständigheter eller indikatorer identifierades. Observera att situationen kan förändras."}
                  </p>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                {canProceedToAnalysis && (
                  <PrimaryBtn onClick={() => setStep(1)}>Kategorisera er verksamhet →</PrimaryBtn>
                )}
                {(isUnclear || isNotApplicable) && screeningDone && (
                  <GhostBtn onClick={() => { setAnswers({}); }}>Börja om</GhostBtn>
                )}
              </div>
            </div>
          )}

          {/* ═══ STEP 1: CATEGORIES ═══ */}
          {step === 1 && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <Tag>Steg 2 av 5 i säkerhetsskyddsanalysen</Tag>
                <h2 style={{ margin: "10px 0 5px", fontSize: 19, fontWeight: 500 }}>Verksamhetsbeskrivning – välj kategorier</h2>
                <p style={{ margin: 0, fontSize: 14.5, color: C.textDim, lineHeight: 1.55 }}>
                  Specificera utifrån vilken eller vilka av de fem kategorierna er verksamhet är av betydelse för Sveriges säkerhet.
                  En verksamhet kan omfattas av flera kategorier. <strong style={{ color: C.textMid }}>Välj alla som stämmer.</strong>
                </p>
              </div>

              {CATEGORIES.map(cat => (
                <CheckCard
                  key={cat.id} item={cat}
                  selected={selectedCats.includes(cat.id)}
                  onToggle={() => toggleSet(setSelectedCats, cat.id)}
                />
              ))}

              {selectedCats.length > 0 && (
                <div style={{ marginTop: 16, padding: "14px 16px", background: C.goldDim, border: `1px solid ${C.goldBorder}`, borderRadius: 6, fontSize: 13.5, color: C.textMid, lineHeight: 1.6, fontFamily: C.mono }}>
                  <strong style={{ color: C.gold }}>Notera:</strong> Kategorin "nationellt samhällsviktig verksamhet" ur säkerhetsskyddsperspektiv är inte detsamma som samhällsviktig verksamhet i allmänhet. Avgörande är om ett antagonistiskt angrepp kan medföra nationella skadekonsekvenser.
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
                <GhostBtn onClick={() => setStep(0)}>← Tillbaka</GhostBtn>
                <PrimaryBtn onClick={() => setStep(2)} disabled={selectedCats.length === 0}>Identifiera skyddsvärden →</PrimaryBtn>
              </div>
            </div>
          )}

          {/* ═══ STEP 2: PROTECTION VALUES ═══ */}
          {step === 2 && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <Tag>Steg 2 av 5 i säkerhetsskyddsanalysen – forts.</Tag>
                <h2 style={{ margin: "10px 0 5px", fontSize: 19, fontWeight: 500 }}>Identifiera och bedöma skyddsvärden</h2>
                <p style={{ margin: 0, fontSize: 14.5, color: C.textDim, lineHeight: 1.55 }}>
                  Tre typer av skyddsvärden ska identifieras. Välj de typer som finns i er verksamhet och ange högsta nivå.
                </p>
              </div>

              {PROTECTION_TYPES.map(pt => {
                const sel = selectedProtTypes.includes(pt.id);
                return (
                  <div key={pt.id} style={{ marginBottom: 12 }}>
                    <CheckCard
                      item={pt} selected={sel}
                      onToggle={() => toggleSet(setSelectedProtTypes, pt.id)}
                    />
                    {sel && pt.levels.length > 0 && (
                      <div style={{ marginLeft: 16, marginTop: -4, marginBottom: 6, padding: "14px 16px", background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, borderRadius: "0 0 6px 6px", borderTop: "none" }}>
                        <p style={{ margin: "0 0 8px", fontSize: 12.5, color: C.textDim, fontFamily: C.mono, letterSpacing: "0.04em" }}>
                          {pt.id === "uppgifter" ? "Högsta säkerhetsskyddsklass i er verksamhet:" : "Högsta konsekvensnivå för era tillgångar:"}
                        </p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {pt.levels.map(lv => {
                            const selLv = selectedLevels[pt.id] === lv.id;
                            return (
                              <button key={lv.id} title={lv.detail}
                                onClick={() => setSelectedLevels(p => ({ ...p, [pt.id]: lv.id }))}
                                style={{
                                  padding: "5px 13px", borderRadius: 3, cursor: "pointer", transition: "all 0.13s",
                                  border: `1px solid ${selLv ? C.goldBorder : C.border}`,
                                  background: selLv ? C.goldDim : "transparent",
                                  color: selLv ? C.gold : C.textDim,
                                  fontSize: 12.5, fontFamily: C.mono,
                                }}>{lv.label}</button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {selectedProtTypes.length > 0 && (
                <>
                  <Divider label="Perspektiv för skyddsvärdena" />
                  <div style={{ marginBottom: 6 }}>
                    <p style={{ margin: "0 0 12px", fontSize: 14.5, color: C.textDim, lineHeight: 1.55 }}>
                      Bedöm från vilket eller vilka perspektiv era skyddsvärden är skyddsvärda. Klassificerade uppgifter är alltid konfidentiella; anläggningar och system kan ha alla tre.
                    </p>
                    {PERSPECTIVES.map(p => (
                      <CheckCard
                        key={p.id} item={p}
                        selected={selectedPersp.includes(p.id)}
                        onToggle={() => toggleSet(setSelectedPersp, p.id)}
                      />
                    ))}
                  </div>

                  {selectedPersp.includes("tillgänglighet") && (
                    <div style={{ marginTop: 10, padding: "13px 16px", background: "rgba(200,168,75,0.05)", border: `1px solid ${C.goldBorder}`, borderRadius: 6, fontSize: 13.5, color: C.textMid, lineHeight: 1.6, fontFamily: C.mono }}>
                      <strong style={{ color: C.gold }}>Tillgänglighet:</strong> Ange i säkerhetsskyddsanalysen den tidsaspekt efter vilken ett bortfall riskerar medföra skada för Sveriges säkerhet (t.ex. "skada uppstår om avbrottet varar längre än 2 timmar").
                    </div>
                  )}
                </>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
                <GhostBtn onClick={() => setStep(1)}>← Tillbaka</GhostBtn>
                <PrimaryBtn onClick={() => setStep(3)} disabled={selectedProtTypes.length === 0}>Visa sammanfattning →</PrimaryBtn>
              </div>
            </div>
          )}

          {/* ═══ STEP 3: ANALYSIS GUIDE + SUMMARY ═══ */}
          {step === 3 && (
            <div>
              {/* Verdict banner */}
              <div style={{ padding: "22px 20px", background: `${verdict.color}10`, border: `1px solid ${verdict.color}40`, borderRadius: 8, marginBottom: 22, textAlign: "center" }}>
                <Tag color={verdict.color}>{verdict.level}</Tag>
                <h2 style={{ margin: "10px 0 6px", fontSize: 20, fontWeight: 500 }}>
                  {directYes ? "Er verksamhet träffas av säkerhetsskyddslagen" : "Er verksamhet träffas sannolikt av säkerhetsskyddslagen"}
                </h2>
                <p style={{ margin: 0, fontSize: 14.5, color: C.textMid, maxWidth: 480, marginInline: "auto", lineHeight: 1.6 }}>
                  Nedan: er kartläggning och Säkerhetspolisens femstegsmetod för säkerhetsskyddsanalys.
                </p>
              </div>

              {/* Summary */}
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 7, overflow: "hidden", marginBottom: 18 }}>
                <div style={{ padding: "10px 16px", borderBottom: `1px solid ${C.border}` }}>
                  <Tag color={C.textDim} bg="transparent">Er kartläggning</Tag>
                </div>

                {/* Categories */}
                <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.border}` }}>
                  <p style={{ margin: "0 0 8px", fontSize: 12.5, color: C.textDim, fontFamily: C.mono, letterSpacing: "0.05em", textTransform: "uppercase" }}>Verksamhetskategorier</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {CATEGORIES.filter(c => selectedCats.includes(c.id)).map(c => (
                      <span key={c.id} style={{ padding: "3px 10px", background: C.goldDim, border: `1px solid ${C.goldBorder}`, borderRadius: 3, fontSize: 13, color: C.gold, fontFamily: C.mono }}>{c.icon} {c.label}</span>
                    ))}
                  </div>
                </div>

                {/* Protection values */}
                <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.border}` }}>
                  <p style={{ margin: "0 0 8px", fontSize: 12.5, color: C.textDim, fontFamily: C.mono, letterSpacing: "0.05em", textTransform: "uppercase" }}>Skyddsvärden</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {PROTECTION_TYPES.filter(pt => selectedProtTypes.includes(pt.id)).map(pt => {
                      const lvId = selectedLevels[pt.id];
                      const lv = pt.levels.find(l => l.id === lvId);
                      return (
                        <div key={pt.id} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                          <span style={{ fontSize: 14.5, color: C.textMid }}>{pt.icon} {pt.label}</span>
                          {lv && <span style={{ fontSize: 12.5, color: C.gold, fontFamily: C.mono, flexShrink: 0 }}>{lv.label}</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Perspectives */}
                {selectedPersp.length > 0 && (
                  <div style={{ padding: "14px 16px" }}>
                    <p style={{ margin: "0 0 8px", fontSize: 12.5, color: C.textDim, fontFamily: C.mono, letterSpacing: "0.05em", textTransform: "uppercase" }}>Skyddsperspektiv</p>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {PERSPECTIVES.filter(p => selectedPersp.includes(p.id)).map(p => (
                        <span key={p.id} style={{ padding: "3px 10px", background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, borderRadius: 3, fontSize: 13, color: C.textMid, fontFamily: C.mono }}>{p.icon} {p.label}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 5-step analysis method */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ marginBottom: 14 }}>
                  <Tag>Säkerhetspolisens metod för säkerhetsskyddsanalys</Tag>
                  <h3 style={{ margin: "8px 0 4px", fontSize: 18, fontWeight: 500 }}>Femstegsmetoden – vad er analys ska innehålla</h3>
                  <p style={{ margin: 0, fontSize: 14, color: C.textDim, lineHeight: 1.5 }}>
                    Analysen ska fastställas av verksamhetens högsta chef och uppdateras <strong style={{ color: C.textMid }}>minst vartannat år</strong>. (2 kap. 10 § PMFS 2022:1)
                  </p>
                </div>
                {ANALYSIS_STEPS.map((s) => (
                  <div key={s.num} style={{
                    display: "grid", gridTemplateColumns: "42px 1fr", gap: 14,
                    padding: "14px 16px", background: C.surface,
                    border: `1px solid ${C.border}`, borderRadius: 7, marginBottom: 8,
                  }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.goldDim, border: `1px solid ${C.goldBorder}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: C.gold, fontFamily: C.mono }}>{s.num}</span>
                      </div>
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                        <span style={{ fontSize: 15.5, fontWeight: 500, color: C.text, fontFamily: C.serif }}>{s.title}</span>
                        <span style={{ fontSize: 12, color: C.textDim, fontFamily: C.mono }}>{s.ref}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: 13.5, color: C.textDim, lineHeight: 1.6 }}>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Key obligations */}
              <div style={{ padding: "16px 18px", background: `${C.red}09`, border: `1px solid rgba(192,57,43,0.2)`, borderRadius: 7, marginBottom: 16 }}>
                <Tag color={C.red}>Omedelbara skyldigheter (2 kap. säkerhetsskyddslagen)</Tag>
                <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
                  {[
                    { ref: "2 kap. 1 §", text: "Genomför och dokumentera säkerhetsskyddsanalys" },
                    { ref: "2 kap. 6 §", text: "Anmäl utan dröjsmål till tillsynsmyndigheten" },
                    { ref: "2 kap. 7 §", text: "Utse säkerhetsskyddschef direkt underställd verksamhetschefen" },
                    { ref: "3 kap. 1 §", text: "Säkerhetspröva all personal innan deltagande i säkerhetskänslig verksamhet" },
                    { ref: "4 kap. 1 §", text: "Ingå säkerhetsskyddsavtal innan externa aktörer ges tillgång" },
                  ].map((o, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 11, color: C.gold, fontFamily: C.mono, paddingTop: 3, flexShrink: 0, opacity: 0.7 }}>{o.ref}</span>
                      <span style={{ fontSize: 14.5, color: C.textMid }}>{o.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sanction */}
              <div style={{ padding: "13px 16px", background: "rgba(255,255,255,0.015)", border: `1px solid ${C.border}`, borderRadius: 6, marginBottom: 18, fontSize: 13, color: C.textDim, lineHeight: 1.6, fontFamily: C.mono }}>
                <strong style={{ color: C.textMid }}>7 kap. sanktionsavgifter:</strong> 25 000 – 50 000 000 kr (statliga myndigheter max 10 mkr) vid åsidosättande av skyldigheter. Sanktionsavgiften tillfaller staten.
              </div>

              {/* Disclaimer */}
              <p style={{ fontSize: 12.5, color: "rgba(240,236,228,0.2)", lineHeight: 1.6, fontFamily: C.mono, marginBottom: 22 }}>
                <strong style={{ color: "rgba(240,236,228,0.3)" }}>Obs:</strong> Stöd för självskattning – ersätter inte formell säkerhetsskyddsanalys. Säkerhetsskyddslagen gäller oavsett beredskapsläge. Vid osäkerhet – kontakta Säkerhetspolisen eller er tillsynsmyndighet. Begär beskrivning av dimensionerande antagonistiska förmågor via tillsynsmyndigheten.
              </p>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <GhostBtn onClick={() => setStep(2)}>← Tillbaka</GhostBtn>
                <GhostBtn onClick={() => { setAnswers({}); setSelectedCats([]); setSelectedProtTypes([]); setSelectedLevels({}); setSelectedPersp([]); setStep(0); }}>Börja om</GhostBtn>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 60, padding: "24px 18px", textAlign: "center" }}>
          <p style={{ margin: "0 auto", fontSize: 12, color: C.textDim, fontFamily: C.mono, lineHeight: 1.6, maxWidth: 520 }}>
            Dataskydd: Ingen data samlas in, lagras eller skickas till någon server – all information stannar lokalt i din webbläsare och försvinner när du stänger sidan.
          </p>
          <p style={{ margin: "10px auto 0", fontSize: 12, color: C.textDim, fontFamily: C.mono, lineHeight: 1.6, maxWidth: 520 }}>
            Disclaimer: Guiden är baserad på öppen data och skall användas som stöd och vägledning, ej som ersättning för en korrekt säkerhetsskyddsanalys.
          </p>
          <p style={{ margin: "16px auto 0", fontSize: 12, color: C.textDim, fontFamily: C.mono, lineHeight: 1.6, maxWidth: 520 }}>
            Källor:{" "}
            <a href="https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/sakerhetsskyddslag-2018585_sfs-2018-585/" target="_blank" rel="noopener noreferrer" style={{ color: C.textDim, textDecoration: "none", borderBottom: `1px solid ${C.border}` }}>Säkerhetsskyddslagen (2018:585)</a>
            {" · "}
            <a href="https://sakerhetspolisen.se/download/18.725e108e18dd2b2650a85/1709631405797/Vad%20%C3%A4r%20s%C3%A4kerhetsk%C3%A4nslig%20verksamhet.pdf" target="_blank" rel="noopener noreferrer" style={{ color: C.textDim, textDecoration: "none", borderBottom: `1px solid ${C.border}` }}>SÄPO PM – Vad är säkerhetskänslig verksamhet?</a>
            {" · "}
            <a href="https://sakerhetspolisen.se/download/18.3baf70bf187108c7cf04b7/1681802201089/Sa%CC%88kerhetskyddsanalys_anpassad.pdf" target="_blank" rel="noopener noreferrer" style={{ color: C.textDim, textDecoration: "none", borderBottom: `1px solid ${C.border}` }}>SÄPO Vägledning – Säkerhetsskyddsanalys</a>
          </p>
          <span style={{ display: "inline-block", marginTop: 16, fontSize: 12, color: C.textDim, fontFamily: C.mono, letterSpacing: "0.04em" }}>
            Erik Eliasson — erikeliasson (a) protonmail.com — 2026
          </span>
        </div>
      </div>
    </>
  );
}
