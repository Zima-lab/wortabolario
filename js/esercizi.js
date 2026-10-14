/* Wortabolario — js/esercizi.js  (13/14)
   Lettore degli esercizi di grammatica (la banca delle domande è in dati/esercizi.js).
   Tutti i file di js/ condividono le stesse variabili: l'ordine di caricamento è in index.html. */

/* ---------- ESERCIZI DI GRAMMATICA (v38) ----------
   Banca in dati/esercizi.js (EX_TOPICS). Qui c'è il lettore: un solo "player" per
   quattro tipi di esercizio (choice · order · gap · fix), con spiegazione dopo
   ogni risposta e ripasso a intervalli (stesso schema Leitner delle parole).
   Lo stato vive in localStorage "wortabolario_ex": { idEsercizio: {lv, due} }.
   Stati mostrati all'utente: nuovo · da ripassare (due oggi o sbagliato) ·
   più avanti (lv 1-2) · padroneggiato (lv 3+). */

const EX_KEY = "wortabolario_ex";
let exData = {};
try { exData = JSON.parse(localStorage.getItem(EX_KEY) || "{}"); } catch(e){}
function saveEx(){ try { localStorage.setItem(EX_KEY, JSON.stringify(exData)); } catch(e){} }

function exTopics(){ return typeof EX_TOPICS !== "undefined" ? EX_TOPICS : []; }
function exEsc(t){ return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
function exShuffle(a){
  for(let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function exStatus(id){
  const d = exData[id];
  if(!d) return "new";
  if(d.due <= todayIdx()) return "now";
  return d.lv >= 3 ? "mastered" : "later";
}
function exRecord(id, ok){
  bumpStreak();
  const cur = exData[id] || { lv: 0, due: todayIdx() };
  if(ok){
    cur.lv = Math.min(cur.lv + 1, 5);
    cur.due = todayIdx() + SRS_INTERVALS[cur.lv - 1];
  } else {
    cur.lv = 0;
    cur.due = todayIdx();
  }
  exData[id] = cur;
  saveEx();
}
function exDueItems(){
  const out = [];
  exTopics().forEach(t => t.items.forEach(it => { if(exStatus(it.id) === "now") out.push({ topic: t, item: it }); }));
  return out;
}
function exTopicName(t){ return lang === "en" ? t.en : t.it; }
function exTopicEntry(t){ return ENTRIES.find(e => e.type === "grammatica" && e.de === t.cards[0]); }
function exTopicByCard(de){ return exTopics().find(t => t.cards.includes(de)); }
/* v40: un argomento può dichiarare la propria sezione (es. sec: "TELC" per gli esercizi d'esame) */
function exTopicSection(t){ if(t.sec) return t.sec; const e = exTopicEntry(t); return (e && bignamiSection(e)) || "AP"; }
function exTopicStats(t){
  const st = { new: 0, now: 0, later: 0, mastered: 0 };
  t.items.forEach(it => st[exStatus(it.id)]++);
  return st;
}
function exBignamiLink(t){
  const s = UI_STRINGS[lang], de = t.cards[0];
  const p2 = BIGNAMI_B2_PAGES[de];
  if(p2) return `<a class="bignami-link" href="${bignamiB2Pdf()}#page=${p2}" target="_blank" rel="noopener">${ic("book","ic-sm")}${s.bignamiB2Link(p2)}</a>`;
  const p = BIGNAMI_PAGES[de];
  return p ? `<a class="bignami-link" href="${bignamiPdf()}#page=${p}" target="_blank" rel="noopener">${ic("book","ic-sm")}${s.bignamiLink(p)}</a>` : "";
}
/* Le risposte scritte accettano ae/oe/ue/ss al posto di ä/ö/ü/ß e ignorano le maiuscole */
function exNorm(t){
  return String(t).trim().toLowerCase().replace(/\s+/g, " ")
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss");
}
function exFullSentence(it){
  if(it.t === "choice") return it.q.includes("___") ? it.q.replace("___", it.a) : it.a;
  if(it.t === "order") return (it.pre ? it.pre + " " : "") + it.a.join(" ") + it.post;
  if(it.t === "gap") return it.q.replace("___", it.a);
  return it.fix;
}

/* --- sessione --- */
let exDeck = [], exIdx = 0, exOk = 0, exCtx = { mode: "topic", topicId: null };

function exMakeDeck(pairs){
  return pairs.map(p => {
    const it = p.item, d = { topic: p.topic, item: it, res: null, given: "" };
    if(it.t === "choice") d.opts = exShuffle(it.opts.slice());
    if(it.t === "order"){
      const idx = it.a.map((w, i) => i);
      let tries = 0;
      do { exShuffle(idx); tries++; } while(tries < 10 && it.a.length > 1 && idx.every((v, i) => v === i));
      d.tiles = idx; d.placed = [];
    }
    if(it.t === "fix") d.sel = [];
    return d;
  });
}
function exStartTopic(id, size){
  const t = exTopics().find(x => x.id === id);
  if(!t) return;
  const prio = { now: 0, new: 1, later: 2, mastered: 3 };
  const pool = exShuffle(t.items.map(it => ({ topic: t, item: it }))).sort((a, b) => prio[exStatus(a.item.id)] - prio[exStatus(b.item.id)]);
  exDeck = exMakeDeck(exShuffle(pool.slice(0, size || 10)));
  exIdx = 0; exOk = 0; exCtx = { mode: "topic", topicId: id };
  renderExPlay();
}
function exStartReview(){
  const pairs = exShuffle(exDueItems()).slice(0, 15);
  if(!pairs.length){ renderExPicker(); return; }
  exDeck = exMakeDeck(pairs);
  exIdx = 0; exOk = 0; exCtx = { mode: "review", topicId: null };
  renderExPlay();
}
function exOpenOverlay(){
  document.getElementById("exOverlay").classList.add("open");
  document.body.classList.add("conj-lock");
}
function openExPicker(){ exOpenOverlay(); renderExPicker(); }
function openExTopic(id){ exOpenOverlay(); exStartTopic(id); }
function openExReview(){ exOpenOverlay(); exStartReview(); }
function closeEx(){
  document.getElementById("exOverlay").classList.remove("open");
  document.body.classList.remove("conj-lock");
  updateView();
}

/* --- elenco argomenti, raggruppati come le sezioni del Bignami --- */
function renderExPicker(){
  const s = UI_STRINGS[lang];
  document.getElementById("exTitle").textContent = s.exPickTitle;
  const body = document.getElementById("exBody");
  const nDue = exDueItems().length;
  const groups = {};
  exTopics().forEach(t => { (groups[exTopicSection(t)] = groups[exTopicSection(t)] || []).push(t); });
  const secHtml = SEC_ORDER.filter(k => groups[k]).map(k => {
    const ts = groups[k];
    let tot = 0, mas = 0;
    ts.forEach(t => { const st = exTopicStats(t); tot += t.items.length; mas += st.mastered; });
    return `<div class="ex-sec">
      <div class="gsec gsec-${SEC_COLOR[k]}"><span class="gsec-code">${SEC_CODE[k] || k}</span><span class="gsec-title">${SEC_LABELS[k][lang === "en" ? "en" : "it"]}</span><span class="gsec-n">${mas}/${tot}</span></div>
      ${ts.map(t => {
        const st = exTopicStats(t), n = t.items.length;
        return `<button type="button" class="ex-topic" data-t="${t.id}">
          <span class="ex-topic-main">
            <span class="ex-topic-name">${exEsc(exTopicName(t))}</span>
            <span class="ex-topic-meta">${s.exItems(n, st.mastered)}</span>
            <span class="ex-bar"><span class="ex-bar-fill" style="width:${Math.round(st.mastered / n * 100)}%"></span></span>
          </span>
          ${st.now > 0 ? `<span class="ex-chip-now">${s.exNowChip(st.now)}</span>` : ""}
        </button>`;
      }).join("")}
    </div>`;
  }).join("");
  body.innerHTML = `
    <p class="ex-pick-hint">${s.exPickHint}</p>
    ${nDue > 0 ? `<button type="button" class="conj-btn ex-review-go" id="exReviewGo">${ic("clock","ic-sm")}${s.exReviewBtn(nDue)}</button>` : ""}
    ${secHtml}`;
  body.querySelectorAll(".ex-topic").forEach(b => b.addEventListener("click", () => exStartTopic(b.dataset.t)));
  const rg = document.getElementById("exReviewGo");
  if(rg) rg.addEventListener("click", exStartReview);
  body.scrollTop = 0;
}

/* --- giudizio e invio risposta --- */
function exJudge(d){
  const it = d.item;
  if(it.t === "choice") return d.given === it.a;
  if(it.t === "order"){
    const got = d.placed.map(i => it.a[i]).join(" ");
    return got === it.a.join(" ") || it.alt.some(a => a.join(" ") === got);
  }
  if(it.t === "gap"){
    const g = exNorm(d.given);
    return !!g && [it.a].concat(it.alt).some(a => exNorm(a) === g);
  }
  return d.sel.length > 0 && d.sel.every(i => it.bad.includes(i));
}
function exSubmit(skip){
  const d = exDeck[exIdx];
  if(!d || d.res) return;
  const ok = skip ? false : exJudge(d);
  d.res = { ok, skip: !!skip };
  exRecord(d.item.id, ok);
  if(ok){
    exOk++;
    awardXp({ choice: XP_EASY, order: XP_MED, fix: XP_MED, gap: XP_HARD }[d.item.t]);
  }
  renderExPlay();
}

/* --- schermata di un esercizio --- */
function renderExPlay(){
  const s = UI_STRINGS[lang];
  const body = document.getElementById("exBody");
  const n = exDeck.length;
  const modeTitle = exCtx.mode === "review" ? s.exReviewTitle
    : exTopicName(exTopics().find(t => t.id === exCtx.topicId) || { it: "", en: "" });
  document.getElementById("exTitle").textContent = exIdx < n ? `${s.exPickTitle} · ${exIdx + 1} / ${n}` : s.exPickTitle;
  if(exIdx >= n){ renderExDone(modeTitle); return; }

  const d = exDeck[exIdx], it = d.item, done = !!d.res;
  const gapSpan = (txt) => `<span class="ww-gap">${txt}</span>`;
  let main = "", actions = "";

  if(it.t === "choice"){
    const hasGap = it.q.includes("___");
    const sentence = hasGap
      ? exEsc(it.q).replace("___", done ? `<span class="ex-filled">${exEsc(it.a)}</span>` : gapSpan("___"))
      : exEsc(it.q);
    main = `${it.ctx ? `<div class="ex-ctx">${exEsc(it.ctx)}</div>` : ""}
      <div class="ww-sentence">${sentence}</div>
      <div class="ex-opts">${d.opts.map((o, i) => {
        let cls = "ww-navy";
        if(done){
          if(o === it.a) cls += " right";
          else if(o === d.given) cls += " picked-wrong";
          else cls += " wrong";
        }
        return `<button type="button" class="genus-opt ww-opt ex-opt ${cls}" data-i="${i}"${done ? " disabled" : ""}>${exEsc(o)}</button>`;
      }).join("")}</div>`;
  } else if(it.t === "order"){
    const tile = (i, cls) => `<button type="button" class="ex-tile ${cls}" data-i="${i}"${done ? " disabled" : ""}>${exEsc(it.a[i])}</button>`;
    const free = d.tiles.filter(i => !d.placed.includes(i));
    main = `${it.pre ? `<div class="ex-pre">${exEsc(it.pre)}</div>` : ""}
      <div class="ex-line ${done ? (d.res.ok ? "ok" : "bad") : ""}" id="exLine">${d.placed.map(i => tile(i, "placed")).join("")}${it.post ? `<span class="ex-post">${exEsc(it.post)}</span>` : ""}</div>
      <div class="ex-bank" id="exBank">${done ? "" : free.map(i => tile(i, "")).join("")}</div>`;
    if(!done){
      actions = `<button type="button" class="conj-btn ex-go" id="exCheck"${d.placed.length === d.tiles.length ? "" : " disabled"}>${s.exCheck}</button>
        <button type="button" class="flash-secondary" id="exSkip">${s.cqSkip}</button>`;
    }
  } else if(it.t === "gap"){
    const sentence = exEsc(it.q).replace("___", done ? `<span class="ex-filled">${exEsc(it.a)}</span>` : gapSpan("___"));
    main = `<div class="ww-sentence">${sentence}</div>
      <div class="genus-hint">${s.exHint}: ${exEsc(it.hint)}</div>
      <div class="ex-field">
        <input type="text" class="ex-input ${done ? (d.res.ok ? "ok" : "bad") : ""}" id="exInput" value="${exEsc(d.given)}" lang="de"
          placeholder="${s.exPlaceholder}" aria-label="${s.exPlaceholder}"
          autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" inputmode="text"${done ? " disabled" : ""}>
        ${done ? "" : `<div class="ex-keys-box">
          <div class="ex-keys-label">${s.exKeysLabel}</div>
          <div class="ex-keys" role="group" aria-label="${s.exKeysAria}">${["ä","ö","ü","ß"].map(c => `<button type="button" class="ex-key" data-c="${c}" tabindex="-1">${c}</button>`).join("")}</div>
          <div class="ex-keys-alt">${s.exKeysAlt}</div>
        </div>`}
      </div>`;
    if(!done){
      actions = `<button type="button" class="conj-btn ex-go" id="exCheck">${s.exCheck}</button>
        <button type="button" class="flash-secondary" id="exSkip">${s.cqSkip}</button>`;
    }
  } else {   // fix
    const words = it.q.split(" ");
    main = `<div class="ex-words">${words.map((w, i) => {
      let cls = d.sel.includes(i) ? "sel" : "";
      if(done){
        if(it.bad.includes(i)) cls += " is-bad";
        else if(d.sel.includes(i)) cls += " pick-wrong";
      }
      return `<button type="button" class="ex-word ${cls}" data-i="${i}"${done ? " disabled" : ""}>${exEsc(w)}</button>`;
    }).join(" ")}</div>
    <div class="genus-hint">${s.exFixHint}</div>`;
    if(!done){
      actions = `<button type="button" class="conj-btn ex-go" id="exCheck"${d.sel.length ? "" : " disabled"}>${s.exCheck}</button>
        <button type="button" class="flash-secondary" id="exSkip">${s.cqSkip}</button>`;
    }
  }

  let fb = "";
  if(done){
    const full = exFullSentence(it);
    fb = `<div class="ex-fb ${d.res.ok ? "ex-fb-ok" : "ex-fb-bad"}" id="exFb">
      <div class="ex-fb-title">${d.res.ok ? s.exRight : s.exWrong}</div>
      <div class="ex-fb-ans">${d.res.ok ? "" : `<span class="ex-fb-lbl">${s.exCorrectIs}</span> `}<b>${exEsc(full)}</b>${speakBtnHtml(full, "quiz-speak")}</div>
      <div class="ww-why">${exEsc(it.why[lang === "en" ? "en" : "it"])}</div>
      ${exBignamiLink(d.topic)}
    </div>`;
  }
  const last = exIdx === n - 1;
  body.innerHTML = `
    <div class="flash-progress"><div class="flash-progress-fill" style="width:${(exIdx / n) * 100}%"></div></div>
    <div class="ex-topic-tag">${exEsc(exCtx.mode === "review" ? exTopicName(d.topic) : modeTitle)}</div>
    <div class="ex-instr">${s.exInstr[it.t]}</div>
    ${main}
    ${actions ? `<div class="ex-actions">${actions}</div>` : ""}
    ${fb}
    <div class="genus-nav">
      <button type="button" class="flash-secondary" id="exToPick">${s.exTopics}</button>
      ${done ? `<button type="button" class="conj-btn genus-next" id="exNext">${last ? s.exFinish : s.cqNext}</button>` : ""}
    </div>`;

  /* collegamento degli eventi */
  document.getElementById("exToPick").addEventListener("click", renderExPicker);
  const nx = document.getElementById("exNext");
  if(nx) nx.addEventListener("click", () => { exIdx++; renderExPlay(); });
  if(done){
    bindSpeakBtns(document.getElementById("exFb"));
    const fbEl = document.getElementById("exFb");
    if(fbEl && fbEl.scrollIntoView) fbEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
    return;
  }
  const chk = document.getElementById("exCheck");
  if(chk) chk.addEventListener("click", () => exSubmit(false));
  const sk = document.getElementById("exSkip");
  if(sk) sk.addEventListener("click", () => exSubmit(true));

  if(it.t === "choice"){
    body.querySelectorAll(".ex-opt").forEach(b => b.addEventListener("click", () => {
      d.given = d.opts[+b.dataset.i];
      exSubmit(false);
    }));
  } else if(it.t === "order"){
    body.querySelectorAll(".ex-tile").forEach(b => b.addEventListener("click", () => {
      const i = +b.dataset.i, at = d.placed.indexOf(i);
      if(at >= 0) d.placed.splice(at, 1); else d.placed.push(i);
      renderExPlay();
    }));
  } else if(it.t === "gap"){
    const inp = document.getElementById("exInput");
    inp.addEventListener("input", () => { d.given = inp.value; });
    inp.addEventListener("keydown", (ev) => { if(ev.key === "Enter"){ ev.preventDefault(); d.given = inp.value; exSubmit(false); } });
    /* mousedown/pointerdown senza default: il campo resta attivo, quindi i tasti non spariscono prima del tocco */
    body.querySelectorAll(".ex-key").forEach(k => ["mousedown","pointerdown"].forEach(t => k.addEventListener(t, ev => ev.preventDefault())));
    body.querySelectorAll(".ex-key").forEach(k => k.addEventListener("click", () => {
      const a = inp.selectionStart == null ? inp.value.length : inp.selectionStart;
      const b = inp.selectionEnd == null ? a : inp.selectionEnd;
      inp.value = inp.value.slice(0, a) + k.dataset.c + inp.value.slice(b);
      d.given = inp.value;
      inp.focus();
      try { inp.setSelectionRange(a + 1, a + 1); } catch(e){}
    }));
    try { inp.focus({ preventScroll: true }); } catch(e){}
  } else {
    body.querySelectorAll(".ex-word").forEach(b => b.addEventListener("click", () => {
      const i = +b.dataset.i, at = d.sel.indexOf(i);
      if(at >= 0) d.sel.splice(at, 1); else d.sel.push(i);
      renderExPlay();
    }));
  }
}

/* --- fine sessione --- */
function renderExDone(modeTitle){
  const s = UI_STRINGS[lang];
  const body = document.getElementById("exBody");
  const n = exDeck.length;
  const t = exCtx.mode === "topic" ? exTopics().find(x => x.id === exCtx.topicId) : null;
  const st = t ? exTopicStats(t) : null;
  const msg = exOk === n ? s.exPerfect : (exOk >= n * 0.7 ? s.exGood : s.exMeh);
  const nDue = exDueItems().length;
  body.innerHTML = `
    <div class="flash-done">
      <div class="flash-done-ic">${ic(exOk === n ? "checkSeal" : "book")}</div>
      <h3>${s.exDoneTitle}</h3>
      <p>${s.cqDoneMsg(exOk, n)}<br>${msg}</p>
      ${st ? `<p class="ex-done-stat">${s.exMasteredOf(st.mastered, t.items.length)}</p>` : ""}
      <div class="flash-actions">
        ${t ? `<button type="button" class="conj-btn" id="exAgain">${s.exAgain}</button>` : (nDue > 0 ? `<button type="button" class="conj-btn" id="exAgain">${s.exReviewBtn(nDue)}</button>` : "")}
        <button type="button" class="flash-secondary" id="exTopicsBtn">${s.exTopics}</button>
        <button type="button" class="flash-secondary" id="exEnd">${s.flashCloseBtn}</button>
      </div>
    </div>`;
  const ag = document.getElementById("exAgain");
  if(ag) ag.addEventListener("click", () => { if(t) exStartTopic(t.id); else exStartReview(); });
  document.getElementById("exTopicsBtn").addEventListener("click", renderExPicker);
  document.getElementById("exEnd").addEventListener("click", closeEx);
}

document.getElementById("exClose").addEventListener("click", closeEx);
document.getElementById("exOverlay").addEventListener("click", (ev) => {
  if(ev.target.id === "exOverlay") closeEx();
});
document.addEventListener("keydown", (ev) => {
  if(ev.key === "Escape" && document.getElementById("exOverlay").classList.contains("open")) closeEx();
});
