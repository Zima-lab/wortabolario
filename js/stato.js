/* Wortabolario — js/stato.js  (4/14)
   Tema chiaro/scuro, preferiti, parole imparate, ripasso a intervalli (SRS), serie di giorni, punti XP e backup dei progressi.
   Tutti i file di js/ condividono le stesse variabili: l'ordine di caricamento è in index.html. */

/* ---------- TEMA (chiaro / scuro) ---------- */

/* Default: segue il tema del sistema (chiaro/scuro); la scelta manuale lo sovrascrive. */
let theme = localStorage.getItem("wortabolario_theme") ||
  (typeof window.matchMedia === "function" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

function applyTheme(){
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if(meta) meta.setAttribute("content", theme === "dark" ? "#10141c" : "#1b2340");
  document.querySelectorAll(".theme-toggle .lang-opt").forEach(el=>{
    el.classList.toggle("active", el.dataset.theme === theme);
  });
}

/* ---------- STATO UI ---------- */

let activeType = "tutti";
const TYPE_LABELS_IT = { tutti:"Tutti", verbo:"Verbi", sostantivo:"Sostantivi", aggettivo:"Aggettivi", grammatica:"Grammatica", frase:"Frasi", detto:"Detti" };
const TYPE_LABELS_EN = { tutti:"All", verbo:"Verbs", sostantivo:"Nouns", aggettivo:"Adjectives", grammatica:"Grammar", frase:"Phrases", detto:"Sayings" };
function TL(t){ return (lang === "en" ? TYPE_LABELS_EN : TYPE_LABELS_IT)[t]; }
const openIds = new Set();
let activeSuggestion = -1;
let sortMode = localStorage.getItem("wortabolario_sort") || "orig";

/* ---------- PREFERITI, IMPARATE, RECENTI (persistenti) ---------- */

function loadIdSet(key){
  try { return new Set(JSON.parse(localStorage.getItem(key) || "[]")); }
  catch(e){ return new Set(); }
}
const favIds = loadIdSet("wortabolario_favs");
const learnedIds = loadIdSet("wortabolario_learned");
function saveIdSet(key, set){ localStorage.setItem(key, JSON.stringify([...set])); }

let recentIds = [];
try { recentIds = JSON.parse(localStorage.getItem("wortabolario_recent") || "[]"); } catch(e){}
function pushRecent(id){
  recentIds = [id, ...recentIds.filter(x => x !== id)].slice(0, 8);
  localStorage.setItem("wortabolario_recent", JSON.stringify(recentIds));
}

function toggleFav(id){
  if(favIds.has(id)) favIds.delete(id); else favIds.add(id);
  saveIdSet("wortabolario_favs", favIds);
}
function setLearned(id, on){
  if(on) learnedIds.add(id); else learnedIds.delete(id);
  saveIdSet("wortabolario_learned", learnedIds);
}

/* ---------- SRS (ripetizione spaziata, sistema Leitner) ----------
   Ogni parola ha un livello 1-5. Se la sai, sale di livello e la rivedi
   più in là (1→3→7→21→60 giorni); se la sbagli torna a livello 0 e
   riappare subito tra le "da ripassare oggi". */

const SRS_INTERVALS = [1, 3, 7, 21, 60];
let srsData = {};
try { srsData = JSON.parse(localStorage.getItem("wortabolario_srs") || "{}"); } catch(e){}
function saveSrs(){ localStorage.setItem("wortabolario_srs", JSON.stringify(srsData)); }
function todayIdx(){ return Math.floor(Date.now() / 86400000); }

// migrazione: le parole già "imparate" prima dell'SRS partono da livello 1
let srsMigrated = false;
learnedIds.forEach(id => {
  if(!srsData[id]){ srsData[id] = { lv: 1, due: todayIdx() + 1 }; srsMigrated = true; }
});
if(srsMigrated) saveSrs();

function srsAnswer(id, ok){
  bumpStreak();   // ogni risposta conta come studio del giorno
  const cur = srsData[id] || { lv: 0, due: todayIdx() };
  if(ok){
    cur.lv = Math.min(cur.lv + 1, 5);
    cur.due = todayIdx() + SRS_INTERVALS[cur.lv - 1];
  } else {
    cur.lv = 0;
    cur.due = todayIdx();
  }
  srsData[id] = cur;
  saveSrs();
  setLearned(id, ok);
}
function dueEntries(){
  const t = todayIdx();
  return ENTRIES.filter(e => srsData[e.id] && srsData[e.id].due <= t);
}

/* ---------- STREAK (giorni di studio consecutivi) ----------
   Si incrementa al primo esercizio del giorno; se salti un giorno riparte da 1.
   È il meccanismo "non rompere la catena": motiva ad aprire l'app ogni giorno. */

let streak = { last: 0, count: 0 };
try { streak = JSON.parse(localStorage.getItem("wortabolario_streak") || '{"last":0,"count":0}'); } catch(e){}
function bumpStreak(){
  const t = todayIdx();
  if(streak.last === t) return;
  streak.count = (streak.last === t - 1) ? streak.count + 1 : 1;
  streak.last = t;
  localStorage.setItem("wortabolario_streak", JSON.stringify(streak));
}
function streakCount(){
  const t = todayIdx();
  // la serie è "viva" se hai studiato oggi o ieri; altrimenti è azzerata
  return (streak.last === t || streak.last === t - 1) ? streak.count : 0;
}

/* ---------- XP, MESSAGGI DI INCORAGGIAMENTO, TROFEI ----------
   Ricompensa per gli esercizi: ogni risposta CORRETTA vale XP secondo la
   difficoltà (flashcard "La sapevo" = facile, quiz a scelta multipla =
   medio, quiz di coniugazione a scrittura libera = difficile — è l'unico
   che chiede produzione attiva, non riconoscimento). Ogni 50 XP accumulati
   compare un messaggio di incoraggiamento; ogni 200 XP si vince un trofeo.
   200 è anche un multiplo di 50: in quel caso vince il trofeo e il
   messaggio non appare, per non doppiare la festa. Tutto persistente in
   localStorage e incluso nel backup. */

const XP_EASY = 1, XP_MED = 2, XP_HARD = 5;
const XP_MSG_STEP = 50, XP_TROPHY_STEP = 200;

let xpTotal = 0;
try { xpTotal = parseInt(localStorage.getItem("wortabolario_xp") || "0", 10) || 0; } catch(e){}
function saveXp(){ localStorage.setItem("wortabolario_xp", String(xpTotal)); }

let xpTrophies = [];   // [{n, date}] — n = numero progressivo del trofeo (1, 2, 3…)
try { xpTrophies = JSON.parse(localStorage.getItem("wortabolario_xp_trophies") || "[]"); } catch(e){}
function saveXpTrophies(){ localStorage.setItem("wortabolario_xp_trophies", JSON.stringify(xpTrophies)); }

let xpMessages = [];   // storico dei messaggi già mostrati, il più recente in testa
try { xpMessages = JSON.parse(localStorage.getItem("wortabolario_xp_messages") || "[]"); } catch(e){}
function saveXpMessages(){ localStorage.setItem("wortabolario_xp_messages", JSON.stringify(xpMessages)); }

const ENCOURAGEMENTS = {
  it: [
    "Ogni parola imparata è un mattone in più. Weiter so!",
    "Il tuo tedesco cresce un po' di più ogni giorno.",
    "Bravo! La costanza batte il talento.",
    "Un altro passo verso il B1. Continua così!",
    "Der, die, das ti temono sempre un po' meno.",
    "I verbi si arrendono uno alla volta. Avanti!",
    "Stai costruendo un vocabolario solido. Gut gemacht!",
    "Ogni errore corretto è una regola che non dimenticherai più.",
    "La tua memoria tedesca si sta allenando bene.",
    "Sempre più vicino a parlare senza pensarci due volte.",
    "Ottimo ritmo di studio! Klasse!",
    "Le coniugazioni iniziano a sembrarti familiari.",
    "Un piccolo sforzo oggi, un grande progresso domani.",
    "Il tedesco si impara così: un po' alla volta, ogni giorno."
  ],
  en: [
    "Every word learned is one more brick. Weiter so!",
    "Your German grows a little more every day.",
    "Well done! Consistency beats talent.",
    "One more step toward B1. Keep going!",
    "Der, die, das fear you a little less now.",
    "The verbs are surrendering one by one. Onward!",
    "You're building a solid vocabulary. Gut gemacht!",
    "Every corrected mistake is a rule you'll never forget.",
    "Your German memory is training well.",
    "Getting closer to speaking without a second thought.",
    "Great study pace! Klasse!",
    "The conjugations are starting to feel familiar.",
    "A small effort today, a big step forward tomorrow.",
    "This is how German is learned: a little at a time, every day."
  ]
};
function pickEncouragement(){
  const list = ENCOURAGEMENTS[lang] || ENCOURAGEMENTS.it;
  return list[Math.floor(Math.random() * list.length)];
}

/* Trofei ciclici su 4 livelli (colore diverso a ogni giro): bronzo → argento →
   oro → platino → di nuovo bronzo (trofeo #5), e così via all'infinito. */
const TROPHY_TIERS = ["bronzo","argento","oro","platino"];
const TROPHY_TIER_EN = ["bronze","silver","gold","platinum"];
function trophyTier(n){ return TROPHY_TIERS[(n - 1) % TROPHY_TIERS.length]; }
function trophyTierLabel(n){
  const idx = (n - 1) % TROPHY_TIERS.length;
  return lang === "en" ? TROPHY_TIER_EN[idx] : TROPHY_TIERS[idx];
}

let xpToastTimer = null;
function showXpToast(kind, payload){
  const el = document.getElementById("xpToast");
  if(!el) return;
  el.className = "xp-toast " + (kind === "trophy" ? "xp-toast-trophy" : "xp-toast-msg");
  el.innerHTML = kind === "trophy"
    ? `${ic("trophy","ic-sm")}<span>${payload}</span>`
    : `${ic("sun","ic-sm")}<span>${payload}</span>`;
  el.hidden = false;
  requestAnimationFrame(() => el.classList.add("show"));
  clearTimeout(xpToastTimer);
  xpToastTimer = setTimeout(hideXpToast, 4200);
}
function hideXpToast(){
  const el = document.getElementById("xpToast");
  if(!el) return;
  el.classList.remove("show");
  setTimeout(() => { el.hidden = true; }, 250);
}

/* Chiamata su ogni risposta CORRETTA di un esercizio (le sbagliate non danno
   XP: è una ricompensa, non una partecipazione). Confronta le soglie prima e
   dopo per capire se si è appena superato un multiplo di 50 o di 200. */
function awardXp(points){
  if(!points) return;
  const s = UI_STRINGS[lang];
  const prevMsgCount = Math.floor(xpTotal / XP_MSG_STEP);
  const prevTrophyCount = Math.floor(xpTotal / XP_TROPHY_STEP);
  xpTotal += points;
  saveXp();
  const newTrophyCount = Math.floor(xpTotal / XP_TROPHY_STEP);
  const newMsgCount = Math.floor(xpTotal / XP_MSG_STEP);
  if(newTrophyCount > prevTrophyCount){
    for(let n = prevTrophyCount + 1; n <= newTrophyCount; n++){
      xpTrophies.push({ n, date: new Date().toISOString() });
    }
    saveXpTrophies();
    showXpToast("trophy", s.xpTrophyToast(newTrophyCount));
  } else if(newMsgCount > prevMsgCount){
    const text = pickEncouragement();
    xpMessages = [{ text, date: new Date().toISOString() }, ...xpMessages].slice(0, 20);
    saveXpMessages();
    showXpToast("msg", text);
  }
}

/* ---------- BACKUP: ESPORTA / IMPORTA PROGRESSI ----------
   Tutto lo stato vive in localStorage, che il browser può cancellare:
   il backup JSON protegge mesi di studio e permette il passaggio di dispositivo. */

const BACKUP_KEYS = ["wortabolario_favs","wortabolario_learned","wortabolario_recent","wortabolario_srs",
  "wortabolario_streak","wortabolario_lang","wortabolario_theme","wortabolario_sort","wortabolario_flashdir",
  "wortabolario_xp","wortabolario_xp_trophies","wortabolario_xp_messages","wortabolario_ex","wortabolario_telc"];

function exportProgress(){
  const data = { app: "wortabolario", version: 3, date: new Date().toISOString() };
  BACKUP_KEYS.forEach(k => { const v = localStorage.getItem(k); if(v !== null) data[k] = v; });
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "wortabolario-progressi-" + new Date().toISOString().slice(0, 10) + ".json";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

function importProgress(file){
  const s = UI_STRINGS[lang];
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if(data.app !== "wortabolario") throw new Error("not a wortabolario backup");
      BACKUP_KEYS.forEach(k => { if(typeof data[k] === "string") localStorage.setItem(k, data[k]); });
      alert(s.importOk);
      location.reload();
    } catch(err){
      alert(s.importErr);
    }
  };
  reader.readAsText(file);
}
