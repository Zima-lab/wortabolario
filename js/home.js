/* Wortabolario — js/home.js  (9/14)
   Schermata Casa: data di oggi in tedesco, carte del giorno, ripasso e progressi.
   Tutti i file di js/ condividono le stesse variabili: l'ordine di caricamento è in index.html. */

/* ---------- DATA DI OGGI, IN TEDESCO ---------- */

const WEEKDAYS_IT = ["Domenica","Lunedì","Martedì","Mercoledì","Giovedì","Venerdì","Sabato"];
const WEEKDAYS_EN = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const WEEKDAYS_DE = ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"];
const MONTHS_IT = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
const MONTHS_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTHS_DE = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];

const DE_UNITS = ["", "ein", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun"];
const DE_UNITS_STANDALONE = ["null","eins","zwei","drei","vier","fünf","sechs","sieben","acht","neun"];
const DE_TEENS = ["zehn","elf","zwölf","dreizehn","vierzehn","fünfzehn","sechzehn","siebzehn","achtzehn","neunzehn"];
const DE_TENS = ["", "", "zwanzig","dreißig","vierzig","fünfzig","sechzig","siebzig","achtzig","neunzig"];

function deTwoDigits(n){
  if(n < 10) return DE_UNITS_STANDALONE[n];
  if(n < 20) return DE_TEENS[n-10];
  const t = Math.floor(n/10), u = n%10;
  return u === 0 ? DE_TENS[t] : DE_UNITS[u] + "und" + DE_TENS[t];
}
function deThreeDigits(n){
  const h = Math.floor(n/100), rest = n%100;
  let s = h > 0 ? (h===1 ? "" : DE_UNITS[h]) + "hundert" : "";
  if(rest > 0) s += deTwoDigits(rest);
  return s || "null";
}
function germanNumberWord(n){
  if(n === 0) return "null";
  if(n < 100) return deTwoDigits(n);
  if(n < 1000) return deThreeDigits(n);
  const th = Math.floor(n/1000), rest = n%1000;
  let s = (th===1 ? "" : DE_UNITS[th]) + "tausend";
  if(rest > 0) s += deThreeDigits(rest);
  return s;
}
function capitalize(w){ return w.charAt(0).toUpperCase() + w.slice(1); }

function renderDateStrip(){
  const now = new Date();
  const wd = now.getDay(), day = now.getDate(), month = now.getMonth(), year = now.getFullYear();
  const WD = lang === "en" ? WEEKDAYS_EN : WEEKDAYS_IT;
  const MO = lang === "en" ? MONTHS_EN : MONTHS_IT;
  return `
    <div class="date-strip">
      <div class="date-cell">
        <div class="date-it">${WD[wd]}</div>
        <div class="date-de">${WEEKDAYS_DE[wd]}</div>
      </div>
      <div class="date-cell">
        <div class="date-it">${day}</div>
        <div class="date-de">${capitalize(germanNumberWord(day))}</div>
      </div>
      <div class="date-cell">
        <div class="date-it">${MO[month]}</div>
        <div class="date-de">${MONTHS_DE[month]}</div>
      </div>
      <div class="date-cell">
        <div class="date-it">${year}</div>
        <div class="date-de">${capitalize(germanNumberWord(year))}</div>
      </div>
    </div>
  `;
}

/* ---------- DASHBOARD "OGGI" ---------- */

function dayIndex(){ return Math.floor(Date.now() / 86400000); }

function pickOfDay(type, offset){
  const pool = ENTRIES.filter(e => e.type === type);
  if(pool.length === 0) return null;
  return pool[(dayIndex() + offset) % pool.length];
}

function renderHome(){
  const s = UI_STRINGS[lang];
  const verbo = pickOfDay("verbo", 0);
  const parolaPool = ENTRIES.filter(e => e.type === "sostantivo" || e.type === "aggettivo");
  const parola = parolaPool.length ? parolaPool[(dayIndex() + 17) % parolaPool.length] : null;
  const frase = pickOfDay("frase", 5);
  const detto = pickOfDay("detto", 11);

  const cards = [
    { label: s.cardVerbo, e: verbo },
    { label: s.cardParola, e: parola },
    { label: s.cardFrase, e: frase },
    { label: s.cardDetto, e: detto }
  ].filter(c => c.e);

  const host = document.getElementById("home");

  const nLearned = learnedIds.size, nTot = ENTRIES.length;
  const pct = nTot ? Math.round(nLearned / nTot * 100) : 0;
  const nDue = dueEntries().length;
  const nExDue = exDueItems().length;
  /* Card "Oggi": un unico pannello con ripasso del giorno, serie e "riprendi" —
     tutto ciò che serve per la sessione quotidiana in un posto solo. */
  const recents = recentIds.map(id => ENTRIES.find(e => e.id === id)).filter(Boolean);
  const progressHtml = `
    <div class="progress-card today-panel">
      <div class="progress-top">
        <span class="today-panel-title">${ic("sun","ic-sm")}${s.today}</span>
        <div class="today-panel-chips">
          <span class="streak-chip" title="${s.streakTitle}">${ic("flame","ic-sm")}${streakCount() > 0 ? s.streakLabel(streakCount()) : s.streakStart}</span>
          <button type="button" class="xp-chip" id="xpChipBtn" title="${s.xpChipTitle}" aria-label="${s.xpChipTitle}">${ic("trophy","ic-sm")}${xpTotal} XP</button>
        </div>
      </div>
      <div class="progress-track" role="progressbar" aria-valuenow="${nLearned}" aria-valuemin="0" aria-valuemax="${nTot}">
        <div class="progress-fill" style="width:${Math.max(pct, nLearned > 0 ? 2 : 0)}%"></div>
      </div>
      <span class="progress-label">${s.progressLabel(nLearned, nTot)}</span>
      <div class="progress-actions">
        ${nDue > 0
          ? `<button type="button" class="review-btn due-btn" id="dueBtn">${ic("clock","ic-sm")}${s.dueBtn(nDue)}</button>`
          : `<span class="due-done">${ic("check","ic-sm")}${s.dueAllDone}</span>`}
        ${nExDue > 0 ? `<button type="button" class="review-btn due-btn" id="exDueBtn">${ic("pencil","ic-sm")}${s.exReviewBtn(nExDue)}</button>` : ""}
      </div>
      ${recents.length ? `
      <div class="resume-row">
        <span class="resume-label">${s.recentTitle}</span>
        <div class="recent-strip">
          ${recents.map(e => `<button type="button" class="recent-chip" data-id="${e.id}"><span class="rc-de">${e.de}</span><span class="rc-it">${L(e).it}</span></button>`).join("")}
        </div>
      </div>` : ""}
    </div>`;

  host.innerHTML = `
    ${renderDateStrip()}
    ${progressHtml}
    <p class="eyebrow">${s.cardsOfDay}</p>
    <div class="today-grid">
      ${cards.map(c => {
        const t = L(c.e);
        return `
        <div class="today-card" data-id="${c.e.id}" tabindex="0" role="button" aria-label="${c.label}: ${c.e.de}">
          <div class="cardlabel">${c.label}</div>
          <span class="badge ${c.e.type}">${TL(c.e.type)}</span>
          <h3>${c.e.de}</h3>
          <div class="it">${t.it}</div>
          ${t.ex.length ? `<div class="extra">"${t.ex[0][0]}"</div>` : ""}
        </div>
      `;}).join("")}
    </div>
    <div class="backup-card">
      <div class="backup-info"><b>${s.backupTitle}</b><span>${s.backupHint}</span></div>
      <div class="backup-btns">
        <button type="button" id="expBtn">${ic("export","ic-sm")}${s.backupExport}</button>
        <button type="button" id="impBtn">${ic("import","ic-sm")}${s.backupImport}</button>
      </div>
    </div>
    <input type="file" id="impFile" accept=".json,application/json" hidden>
  `;
  host.querySelectorAll(".today-card").forEach(card => {
    const open = () => selectEntry(card.dataset.id);
    card.addEventListener("click", open);
    card.addEventListener("keydown", (ev) => { if(ev.key === "Enter" || ev.key === " "){ ev.preventDefault(); open(); } });
  });
  host.querySelectorAll(".recent-chip").forEach(ch => {
    ch.addEventListener("click", () => selectEntry(ch.dataset.id));
  });
  const rb = document.getElementById("reviewBtn");
  if(rb) rb.addEventListener("click", () => openFlashcards());
  const db = document.getElementById("dueBtn");
  if(db) db.addEventListener("click", () => openFlashcards("due"));
  const edb = document.getElementById("exDueBtn");
  if(edb) edb.addEventListener("click", openExReview);
  const gb = document.getElementById("genusBtn");
  if(gb) gb.addEventListener("click", () => openGenusQuiz());
  const xpChip = document.getElementById("xpChipBtn");
  if(xpChip) xpChip.addEventListener("click", openXpPanel);
  const eb = document.getElementById("expBtn");
  if(eb) eb.addEventListener("click", exportProgress);
  const ib = document.getElementById("impBtn"), inFile = document.getElementById("impFile");
  if(ib && inFile){
    ib.addEventListener("click", () => inFile.click());
    inFile.addEventListener("change", () => { if(inFile.files[0]) importProgress(inFile.files[0]); });
  }
}
