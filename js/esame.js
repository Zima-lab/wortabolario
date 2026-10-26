/* Wortabolario — js/esame.js
   Simulatore d'esame telc Deutsch B1 (dati in dati/esame-b1.js).
   Moduli: lesen (Lesen + Sprachbausteine, 90') · hoeren (30') · schreiben (30') · sprechen (20' di preparazione).
   "Esame scritto completo" = lesen → hoeren → schreiben, con totale su 225 e soglia 135.
   Il timer si basa sull'ora di fine (endAt): chiudere il pannello non ferma né perde la prova.
   Tutti i file di js/ condividono le stesse variabili: l'ordine di caricamento è in index.html. */

/* I modelli d'esame disponibili (dati/esame-b1*.js). TLD = quello scelto nel menu. */
const TL_TESTS = [TELC_B1, TELC_B1_2];
const TL_PICK_KEY = "wortabolario_telc_m";
let TLD = TL_TESTS.find(t => { try { return t.id === localStorage.getItem(TL_PICK_KEY); } catch(e){ return false; } }) || TL_TESTS[0];
const TL_KEY = "wortabolario_telc";
const TL_FULL = ["lesen", "hoeren", "schreiben"];
const TL_PASS_WRITTEN = 135, TL_PASS_ORAL = 45;

let tl = null;        // prova in corso: { mods, mi, mod, idx, ans, plays, endAt, phase, res, task, text, crit, sp, confirm, prepDone }
let tlTick = null;

function tlS(){ return UI_STRINGS[lang].tl; }
function tlFmt(n){ return n.toLocaleString(lang === "en" ? "en" : "it"); }
function tlEsc(t){ return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function tlParas(t){ return t.split("\n\n").map(p => `<p>${tlEsc(p).replace(/\n/g, "<br>")}</p>`).join(""); }
function tlTip(t){ return t.tip ? `<p class="tl-tip">${ic("book","ic-sm")}${t.tip[lang === "en" ? "en" : "it"]}</p>` : ""; }

/* ---------- storico (ultimo punteggio per modulo) ---------- */
function tlHistory(){ try { return JSON.parse(localStorage.getItem(TL_KEY)) || []; } catch(e){ return []; } }
function tlSave(m, p, max){
  const h = tlHistory();
  h.push({ d: new Date().toISOString().slice(0, 10), t: TLD.id, m, p, max });
  try { localStorage.setItem(TL_KEY, JSON.stringify(h.slice(-30))); } catch(e){}
}
/* le voci senza `t` vengono dalla v48, quando esisteva solo il Modelltest 1 */
function tlLast(m){ return tlHistory().filter(x => x.m === m && (x.t || "b1-1") === TLD.id).pop(); }

/* ---------- audio: voce A e voce B, una frase alla volta ----------
   Frasi brevi = niente interruzioni a metà (alcuni browser tagliano gli enunciati lunghi). */
function tlSay(lines){
  if(!canSpeak) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const voices = synth.getVoices().filter(v => v.lang && v.lang.startsWith("de"));
  lines.forEach(([who, txt]) => {
    txt.split(/(?<=[.!?])\s+/).forEach(part => {
      const u = new SpeechSynthesisUtterance(part);
      u.lang = "de-DE"; u.rate = 0.92;
      const v = voices.length > 1 && who === "B" ? voices[1] : voices[0];
      if(v) u.voice = v;
      if(who === "B" && voices.length < 2) u.pitch = 1.3;   // una sola voce: la B diventa più acuta
      synth.speak(u);
    });
  });
}
function tlTranscript(lines){
  return lines.map(([who, txt]) => `<p><b>${who}:</b> ${tlEsc(txt)}</p>`).join("");
}

/* ---------- apertura, chiusura, timer ---------- */
function openTelc(){
  document.getElementById("tlOverlay").classList.add("open");
  document.body.classList.add("conj-lock");
  clearInterval(tlTick);
  tlTick = setInterval(tlClock, 1000);
  tlRender();
}
function closeTelc(){
  document.getElementById("tlOverlay").classList.remove("open");
  document.body.classList.remove("conj-lock");
  clearInterval(tlTick);
  if(canSpeak) window.speechSynthesis.cancel();
  updateView();
}
function tlClock(){
  const el = document.getElementById("tlClock");
  if(!tl || tl.phase !== "run"){ el.textContent = ""; return; }
  const left = Math.max(0, tl.endAt - Date.now());
  const sec = Math.ceil(left / 1000);
  el.textContent = `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
  el.classList.toggle("warn", sec <= 300);
  if(left > 0) return;
  if(tl.mod === "sprechen"){
    if(!tl.prepDone){ tl.prepDone = true; tlRender(); }
  } else tlSubmit(true);
}

function tlStart(mods){
  tl = { mods, mi: -1, res: {} };
  tlNextModule();
}
function tlNextModule(){
  tl.mi++;
  tl.mod = tl.mods[tl.mi];
  Object.assign(tl, { idx: 0, ans: {}, plays: {}, phase: "run", task: null, text: "", crit: {}, sp: {},
    confirm: false, quit: false, prepDone: false, timeUp: false, endAt: Date.now() + TLD[tl.mod].minutes * 60000 });
  tlRender();
  tlClock();
}

/* ---------- rendering ---------- */
function tlRender(){
  const s = tlS();
  const body = document.getElementById("tlBody");
  const title = document.getElementById("tlTitle");
  if(!tl){ title.textContent = s.title; body.innerHTML = tlMenuHtml(); tlBindMenu(); tlClock(); return; }
  title.textContent = s.mods[tl.mod];
  if(tl.phase === "result"){ body.innerHTML = tlResultHtml(); tlBindResult(); tlClock(); return; }
  if(tl.mod === "schreiben") tlRenderWrite();
  else if(tl.mod === "sprechen") tlRenderSpeak();
  else tlRenderTeile();
  tlClock();
}

function tlMenuHtml(){
  const s = tlS();
  const card = (id, name, desc, m) => {
    const last = m && tlLast(m);
    return `<button type="button" class="ex-topic tl-mod" data-start="${id}">
      <span class="ex-topic-main"><span class="ex-topic-name">${name}</span>
      <span class="ex-topic-meta">${desc}${last ? ` · ${s.last(tlFmt(last.p), last.max)}` : ""}</span></span>${ic("chevron")}</button>`;
  };
  return `
    <p class="ex-pick-hint">${s.intro}</p>
    <p class="tl-box-h">${s.pickTest}</p>
    <div class="tl-tabs">${TL_TESTS.map((t, i) => `<button type="button" class="chip ${t === TLD ? "active" : ""}" data-test="${i}">Modelltest ${i + 1}</button>`).join("")}</div>
    ${card("full", s.full, s.fullDesc)}
    ${["lesen", "hoeren", "schreiben", "sprechen"].map(m => card(m, s.mods[m], s.modDesc[m], m)).join("")}
    <p class="tl-note">${s.pass}</p>
    <p class="tl-note">${s.honest}</p>`;
}
function tlBindMenu(){
  document.querySelectorAll("#tlBody [data-test]").forEach(b => b.addEventListener("click", () => {
    TLD = TL_TESTS[+b.dataset.test];
    try { localStorage.setItem(TL_PICK_KEY, TLD.id); } catch(e){}
    tlRender();
  }));
  document.querySelectorAll("#tlBody [data-start]").forEach(b => b.addEventListener("click", () => {
    const id = b.dataset.start;
    tlStart(id === "full" ? TL_FULL.slice() : [id]);
  }));
}

/* Uscire da una prova: due tocchi, così non si perde tutto per sbaglio */
function tlQuitHtml(){ return `<button type="button" class="tl-quit" id="tlQuit">${tl.quit ? tlS().quitConfirm : tlS().quit}</button>`; }
function tlBindQuit(rerender){
  const q = document.getElementById("tlQuit");
  if(q) q.addEventListener("click", () => {
    if(tl.quit){ if(canSpeak) window.speechSynthesis.cancel(); tl = null; tlRender(); }
    else { tl.quit = true; rerender(); }
  });
}

/* Lesen / Sprachbausteine / Hören: una parte per schermata, con le linguette in alto */
function tlRenderTeile(){
  const s = tlS();
  const teile = TLD[tl.mod].teile;
  const t = teile[tl.idx];
  const body = document.getElementById("tlBody");
  const last = tl.idx === teile.length - 1;
  const empty = teile.reduce((n, x) => n + x.items.filter(i => !tl.ans[i.n]).length, 0);
  body.innerHTML = `
    <div class="tl-tabs">${teile.map((x, i) => `<button type="button" class="chip ${i === tl.idx ? "active" : ""}" data-teil="${i}">${tlShort(x.name)}</button>`).join("")}</div>
    <h3 class="tl-h">${t.name} <span class="tl-pts">${t.points} ${s.pt}</span></h3>
    <p class="tl-instr">${t.instr}</p>
    ${tlTip(t)}
    ${tlTeilHtml(t)}
    <div class="genus-nav">
      ${tl.idx > 0 ? `<button type="button" class="flash-secondary" id="tlPrev">${s.prev}</button>` : ""}
      ${last ? `<button type="button" class="conj-btn genus-next ${tl.confirm ? "tl-confirm" : ""}" id="tlSubmit">${tl.confirm ? s.confirm(empty) : s.submit}</button>`
             : `<button type="button" class="conj-btn genus-next" id="tlNext">${s.next}</button>`}
    </div>${tlQuitHtml()}`;
  tlBindQuit(tlRenderTeile);
  body.querySelectorAll("[data-teil]").forEach(b => b.addEventListener("click", () => tlGo(+b.dataset.teil)));
  const prev = document.getElementById("tlPrev"); if(prev) prev.addEventListener("click", () => tlGo(tl.idx - 1));
  const next = document.getElementById("tlNext"); if(next) next.addEventListener("click", () => tlGo(tl.idx + 1));
  const sub = document.getElementById("tlSubmit");
  if(sub) sub.addEventListener("click", () => { if(tl.confirm) tlSubmit(false); else { tl.confirm = true; tlRenderTeile(); } });
  body.querySelectorAll("[data-q]").forEach(el => el.addEventListener("change", () => {
    tl.ans[el.dataset.q] = el.value;
    tl.confirm = false;
    const g = document.getElementById("tlg-" + el.dataset.q);
    if(g) g.textContent = tlGapWord(t, +el.dataset.q, el.value);
  }));
  body.querySelectorAll("[data-play]").forEach(b => b.addEventListener("click", () => {
    const key = b.dataset.play;
    if((tl.plays[key] || 0) >= t.plays) return;
    tl.plays[key] = (tl.plays[key] || 0) + 1;
    const it = t.items.find(i => String(i.n) === key);
    tlSay(it ? it.audio : t.audio);
    tlRenderTeile();
  }));
}
/* linguette corte: "Leseverstehen · Teil 1" → "Lesen 1" */
function tlShort(n){ return n.replace("Leseverstehen · Teil", "Lesen").replace("Sprachbausteine · Teil", "SB").replace("Hörverstehen · Teil", "Hören"); }
function tlGo(i){ tl.idx = i; tl.confirm = false; tlRenderTeile(); document.getElementById("tlBody").scrollTop = 0; }

/* parola mostrata nel buco del testo: la scelta fatta, oppure il numero */
function tlGapWord(t, n, v){
  if(!v) return String(n);
  if(t.type === "mcgap"){ const it = t.items.find(i => i.n === n); return it.opts["abc".indexOf(v)]; }
  return (t.options.find(o => o[0] === v) || [, n])[1];
}
function tlGapText(t){
  return tlParas(t.text).replace(/\{(\d+)\}/g, (m, n) => `<span class="tl-gap" id="tlg-${n}">${tlEsc(tlGapWord(t, +n, tl.ans[n]))}</span>`);
}
function tlRadios(n, opts, col){
  return `<div class="tl-radios${col ? " col" : ""}">${opts.map(([v, label]) => `
    <label class="tl-radio"><input type="radio" name="tlq${n}" value="${v}" data-q="${n}" ${tl.ans[n] === v ? "checked" : ""}><span>${label}</span></label>`).join("")}</div>`;
}
function tlSelect(n, options, allowX){
  const s = tlS();
  const opts = options.map(([v, txt]) => [v, txt.length < 70 ? `${v} – ${txt}` : v]);
  if(allowX) opts.push(["x", `x – ${s.noAd}`]);
  return `<select class="tl-select" data-q="${n}" aria-label="${n}">
    <option value="">${s.choose}</option>
    ${opts.map(([v, l]) => `<option value="${v}" ${tl.ans[n] === v ? "selected" : ""}>${tlEsc(l)}</option>`).join("")}</select>`;
}
function tlPlayBtn(t, key, lines){
  const s = tlS();
  if(!canSpeak) return `<p class="tl-note">${s.noAudio}</p><details class="tl-details"><summary>${s.transcript}</summary><div class="tl-read">${tlTranscript(lines)}</div></details>`;
  const left = t.plays - (tl.plays[key] || 0);
  return `<button type="button" class="conj-btn tl-play" data-play="${key}" ${left > 0 ? "" : "disabled"}>${ic("speaker","ic-sm")}${s.listen(left)}</button>`;
}

function tlTeilHtml(t){
  const s = tlS();
  const num = n => `<span class="tl-num">${n}</span>`;
  if(t.type === "match"){
    return `<div class="tl-box"><p class="tl-box-h">${t.optionsTitle || s.headlines}</p>
      ${t.options.map(([v, txt]) => `<p class="tl-opt"><b>${v}</b> ${tlEsc(txt)}</p>`).join("")}</div>
      ${t.items.map(i => `<div class="tl-item">${num(i.n)}<div class="tl-item-main"><p class="tl-de">${tlEsc(i.text)}</p>${tlSelect(i.n, t.options, t.allowX)}</div></div>`).join("")}`;
  }
  if(t.type === "mc"){
    return `<div class="tl-box tl-read"><p class="tl-box-h">${t.title}</p>${tlParas(t.text)}</div>
      ${t.items.map(i => `<div class="tl-item">${num(i.n)}<div class="tl-item-main"><p class="tl-de"><b>${tlEsc(i.q)}</b></p>
        ${tlRadios(i.n, i.opts.map((o, k) => ["abc"[k], `${"abc"[k]}) ${tlEsc(o)}`]), true)}</div></div>`).join("")}`;
  }
  if(t.type === "mcgap"){
    return `<div class="tl-box tl-read">${tlGapText(t)}</div>
      ${t.items.map(i => `<div class="tl-item tl-item-row">${num(i.n)}${tlRadios(i.n, i.opts.map((o, k) => ["abc"[k], `${"abc"[k]}) ${tlEsc(o)}`]))}</div>`).join("")}`;
  }
  if(t.type === "bank"){
    return `<div class="tl-box tl-bank">${t.options.map(([v, w]) => `<span><b>${v}</b> ${tlEsc(w)}</span>`).join("")}</div>
      <div class="tl-box tl-read">${tlGapText(t)}</div>
      <div class="tl-grid">${t.items.map(i => `<div class="tl-item tl-item-row">${num(i.n)}${tlSelect(i.n, t.options)}</div>`).join("")}</div>`;
  }
  /* tf: audio comune (intervista) o un audio per ogni item */
  const tf = i => tlRadios(i.n, [["r", s.r], ["f", s.f]]);
  if(t.audio){
    return `<div class="tl-player">${tlPlayBtn(t, t.id, t.audio)}</div>
      ${t.items.map(i => `<div class="tl-item">${num(i.n)}<div class="tl-item-main"><p class="tl-de">${tlEsc(i.q)}</p>${tf(i)}</div></div>`).join("")}`;
  }
  return t.items.map(i => `<div class="tl-item">${num(i.n)}<div class="tl-item-main">
    ${tlPlayBtn(t, String(i.n), i.audio)}<p class="tl-de">${tlEsc(i.q)}</p>${tf(i)}</div></div>`).join("");
}

/* ---------- Schreiben ---------- */
function tlWords(t){ return (t.trim().match(/\S+/g) || []).length; }
function tlRenderWrite(){
  const s = tlS();
  const W = TLD.schreiben;
  const body = document.getElementById("tlBody");
  if(!tl.task){
    body.innerHTML = `<p class="tl-instr">${W.instr}</p><p class="ex-pick-hint">${s.writeChoose}</p>
      ${W.tasks.map(t => `<button type="button" class="ex-topic" data-task="${t.id}"><span class="ex-topic-main">
        <span class="ex-topic-name">Aufgabe ${t.id} · ${t.label[lang === "en" ? "en" : "it"]}</span>
        <span class="ex-topic-meta">${tlEsc(t.points.join(" · "))}</span></span>${ic("chevron")}</button>`).join("")}`;
    body.insertAdjacentHTML("beforeend", tlQuitHtml());
    tlBindQuit(tlRenderWrite);
    body.querySelectorAll("[data-task]").forEach(b => b.addEventListener("click", () => { tl.task = b.dataset.task; tlRenderWrite(); }));
    return;
  }
  const t = W.tasks.find(x => x.id === tl.task);
  if(tl.phase === "assess") return tlRenderAssess(t);
  body.innerHTML = `
    <h3 class="tl-h">Aufgabe ${t.id} <span class="tl-pts">45 ${s.pt}</span></h3>
    <div class="tl-box tl-read">${tlParas(t.input)}</div>
    <p class="tl-box-h">${s.writePoints}</p>
    <ul class="tl-list">${t.points.map(p => `<li>${tlEsc(p)}</li>`).join("")}</ul>
    <textarea id="tlText" class="tl-text" lang="de" spellcheck="false" placeholder="${s.writePh}">${tlEsc(tl.text)}</textarea>
    <p class="tl-note"><b id="tlWords">${s.words(tlWords(tl.text))}</b> · ${s.wordsHint}</p>
    <div class="genus-nav"><button type="button" class="conj-btn genus-next ${tl.confirm ? "tl-confirm" : ""}" id="tlSubmit">${tl.confirm ? s.confirmWrite : s.submit}</button></div>${tlQuitHtml()}`;
  tlBindQuit(tlRenderWrite);
  const ta = document.getElementById("tlText");
  ta.addEventListener("input", () => { tl.text = ta.value; document.getElementById("tlWords").textContent = s.words(tlWords(ta.value)); });
  document.getElementById("tlSubmit").addEventListener("click", () => {
    if(tl.confirm) tlSubmit(false); else { tl.confirm = true; tlRenderWrite(); }
  });
}
function tlCritRadios(name, levels, chosen, pts){
  const L2 = lang === "en" ? "en" : "it";
  return `<div class="tl-radios col">${["A", "B", "C", "D"].map(k => `
    <label class="tl-radio"><input type="radio" name="${name}" value="${k}" ${chosen === k ? "checked" : ""}><span><b>${k}${pts ? ` (${pts[k]})` : ""}</b> ${levels[k][L2]}</span></label>`).join("")}</div>`;
}
function tlRenderAssess(t){
  const s = tlS();
  const W = TLD.schreiben;
  const body = document.getElementById("tlBody");
  body.innerHTML = `
    ${tl.timeUp ? `<p class="tl-alert">${s.timeUp}</p>` : ""}
    <h3 class="tl-h">${s.assessTitle}</h3>
    <p class="ex-pick-hint">${s.assessHint}</p>
    <details class="tl-details" open><summary>${s.yourText} · ${s.words(tlWords(tl.text))}</summary><div class="tl-read">${tlParas(tl.text || "—")}</div></details>
    <details class="tl-details"><summary>${s.model}</summary><div class="tl-read">${tlParas(t.model)}</div></details>
    <p class="tl-box-h">${s.writePoints}</p>
    <ul class="tl-list">${t.points.map(p => `<li>${tlEsc(p)}</li>`).join("")}</ul>
    ${W.criteria.map(c => `<div class="tl-crit"><p class="tl-crit-h"><b>${c.id}. ${c.de}</b> · ${c[lang === "en" ? "en" : "it"]}</p>
      ${tlCritRadios("tlc" + c.id, c.lv, tl.crit[c.id], { A: 15, B: 9, C: 3, D: 0 })}</div>`).join("")}
    <p class="tl-alert" id="tlCritMsg" hidden>${s.pickAll}</p>
    <div class="genus-nav"><button type="button" class="conj-btn genus-next" id="tlCalc">${s.calc}</button></div>${tlQuitHtml()}`;
  tlBindQuit(() => tlRenderAssess(t));
  body.querySelectorAll(".tl-crit input").forEach(r => r.addEventListener("change", () => { tl.crit[r.name.slice(3)] = r.value; }));
  document.getElementById("tlCalc").addEventListener("click", () => {
    if(W.criteria.some(c => !tl.crit[c.id])){ document.getElementById("tlCritMsg").hidden = false; return; }
    /* regola telc: se il contenuto (I) o la correttezza (III) è D, la lettera vale 0 */
    const zero = tl.crit.I === "D" || tl.crit.III === "D";
    const p = zero ? 0 : W.criteria.reduce((n, c) => n + { A: 15, B: 9, C: 3, D: 0 }[tl.crit[c.id]], 0);
    tlFinish({ p, max: 45 });
  });
}

/* ---------- Sprechen ---------- */
function tlRenderSpeak(){
  const s = tlS();
  const P = TLD.sprechen;
  const t = P.teile[tl.idx];
  const body = document.getElementById("tlBody");
  const last = tl.idx === P.teile.length - 1;
  const L2 = lang === "en" ? "en" : "it";
  const sc = P.scales[t.id];
  const pts = c => c.aussp ? sc[1] : sc[0];
  body.innerHTML = `
    ${tl.prepDone ? `<p class="tl-alert">${s.prepDone}</p>` : ""}
    <div class="tl-tabs">${P.teile.map((x, i) => `<button type="button" class="chip ${i === tl.idx ? "active" : ""}" data-teil="${i}">Teil ${i + 1}</button>`).join("")}</div>
    <h3 class="tl-h">${t.name} <span class="tl-pts">${t.points} ${s.pt}</span></h3>
    ${tl.idx === 0 ? `<p class="tl-instr">${P.instr}</p>` : ""}
    <p class="tl-instr">${t.task}</p>
    ${(t.texts || []).map(x => `<div class="tl-box tl-read"><p class="tl-box-h">${x.label}</p><p>${tlEsc(x.text)}</p></div>`).join("")}
    <ul class="tl-list">${t.list.map(x => `<li>${tlEsc(x)}</li>`).join("")}</ul>
    <p class="tl-box-h">${s.phrases}</p>
    <div class="tl-box tl-phrases">${t.phrases.map(x => `<span>${tlEsc(x)}</span>`).join("")}</div>
    <details class="tl-details"><summary>${s.model}</summary><div class="tl-read">${tlParas(t.model)}</div>
      ${speakBtnHtml(t.model.replace(/^[AB]: /gm, ""), "quiz-speak")}</details>
    <p class="tl-box-h">${s.speakAssess}</p>
    <p class="tl-note">${s.speakHint}</p>
    ${P.criteria.map(c => `<div class="tl-crit-row"><p class="tl-crit-h"><b>${c.de}</b> · ${c[L2]}</p><div class="tl-radios tl-abcd">
      ${["A", "B", "C", "D"].map((k, i) => `<label class="tl-radio"><input type="radio" name="tls-${t.id}-${c.id}" value="${k}" ${tl.sp[t.id + "-" + c.id] === k ? "checked" : ""}><span><b>${k}</b> · ${pts(c)[i]}</span></label>`).join("")}</div></div>`).join("")}
    <details class="tl-details"><summary>${s.speakLegend}</summary>
      ${P.criteria.map(c => `<p class="tl-crit-h"><b>${c.de}</b></p><ul class="tl-list">${["A", "B", "C", "D"].map(k => `<li><b>${k}</b> ${c.lv[k]}</li>`).join("")}</ul>`).join("")}</details>
    <p class="tl-alert" id="tlCritMsg" hidden>${s.pickAllSpeak}</p>
    <div class="genus-nav">
      ${tl.idx > 0 ? `<button type="button" class="flash-secondary" id="tlPrev">${s.prev}</button>` : ""}
      <button type="button" class="conj-btn genus-next" id="${last ? "tlCalc" : "tlNext"}">${last ? s.calc : s.next}</button>
    </div>${tlQuitHtml()}`;
  tlBindQuit(tlRenderSpeak);
  bindSpeakBtns(body);
  const go = i => { tl.idx = i; tlRenderSpeak(); body.scrollTop = 0; };
  body.querySelectorAll("[data-teil]").forEach(b => b.addEventListener("click", () => go(+b.dataset.teil)));
  body.querySelectorAll(".tl-abcd input").forEach(r => r.addEventListener("change", () => { tl.sp[r.name.slice(4)] = r.value; }));
  const prev = document.getElementById("tlPrev"); if(prev) prev.addEventListener("click", () => go(tl.idx - 1));
  const next = document.getElementById("tlNext"); if(next) next.addEventListener("click", () => go(tl.idx + 1));
  const calc = document.getElementById("tlCalc");
  if(calc) calc.addEventListener("click", () => {
    const keys = P.teile.flatMap(x => P.criteria.map(c => [x, c, tl.sp[x.id + "-" + c.id]]));
    if(keys.some(k => !k[2])){ document.getElementById("tlCritMsg").hidden = false; return; }
    const p = keys.reduce((n, [x, c, v]) => n + P.scales[x.id][c.aussp ? 1 : 0]["ABCD".indexOf(v)], 0);
    tlFinish({ p, max: 75 });
  });
}

/* ---------- consegna e risultati ---------- */
function tlSubmit(auto){
  if(canSpeak) window.speechSynthesis.cancel();
  tl.timeUp = auto;
  tl.confirm = false;
  if(tl.mod === "schreiben"){
    if(!tl.task) tl.task = TLD.schreiben.tasks[0].id;   // tempo scaduto prima di scegliere
    tl.phase = "assess";
    tlRender();
    return;
  }
  const teile = TLD[tl.mod].teile.map(t => {
    const ok = t.items.filter(i => tl.ans[i.n] === i.a).length;
    return { name: t.name, p: ok * t.perItem, points: t.points };
  });
  tlFinish({ p: teile.reduce((n, x) => n + x.p, 0), max: TLD[tl.mod].max, teile });
}
function tlFinish(r){
  tl.res[tl.mod] = r;
  tl.phase = "result";
  tlSave(tl.mod, r.p, r.max);
  bumpStreak();
  awardXp(XP_HARD);
  tlRender();
}

function tlResultHtml(){
  const s = tlS();
  const r = tl.res[tl.mod];
  const pct = r.p / r.max;
  let html = `${tl.timeUp && tl.mod !== "schreiben" ? `<p class="tl-alert">${s.timeUp}</p>` : ""}
    <div class="flash-done tl-done">
      <div class="flash-done-ic">${ic(pct >= 0.6 ? "checkSeal" : "target")}</div>
      <h3>${s.points(tlFmt(r.p), r.max)}</h3>
      <p>${Math.round(pct * 100)} % · ${pct >= 0.6 ? s.goodPct : s.lowPct}</p>
    </div>`;
  if(r.teile){
    html += r.teile.map(x => `<div class="tl-bar-row"><span>${x.name}</span><span class="ex-bar"><span class="ex-bar-fill" style="width:${x.p / x.points * 100}%"></span></span><b>${tlFmt(x.p)}/${x.points}</b></div>`).join("");
    html += TLD[tl.mod].teile.map(t => `<details class="tl-details"><summary>${t.name} · ${s.check}</summary>
      ${t.items.map(i => {
        const mine = tl.ans[i.n], ok = mine === i.a;
        const lbl = v => v ? (v === "r" ? s.r : v === "f" ? s.f : v) : "—";
        return `<div class="tl-check ${ok ? "ok" : "ko"}"><b>${i.n}</b> ${ok ? ic("check","ic-sm") : ""}
          ${ok ? lbl(i.a) : `${s.yours} ${lbl(mine)} · ${s.right} <b>${lbl(i.a)}</b>`}
          <div class="tl-src">${s.src} <i>${tlEsc(i.src)}</i></div></div>`;
      }).join("")}
      ${t.type === "tf" ? `<p class="tl-box-h">${s.transcript}</p><div class="tl-read">${t.audio ? tlTranscript(t.audio) : t.items.map(i => `<p><b>${i.n}</b></p>${tlTranscript(i.audio)}`).join("")}</div>` : ""}
    </details>`).join("");
  }
  const nextMod = tl.mods[tl.mi + 1];
  if(!nextMod && tl.mods.length > 1){
    const tot = tl.mods.reduce((n, m) => n + tl.res[m].p, 0);
    html += `<div class="tl-total ${tot >= TL_PASS_WRITTEN ? "ok" : "ko"}">
      <p>${s.writtenTotal}</p><h3>${tlFmt(tot)} / 225</h3><p>${tot >= TL_PASS_WRITTEN ? s.passed : s.notYet(TL_PASS_WRITTEN)}</p></div>`;
  }
  if(tl.mod === "sprechen") html += `<p class="tl-note">${r.p >= TL_PASS_ORAL ? s.passed : s.notYet(TL_PASS_ORAL)}</p>`;
  html += `<div class="flash-actions tl-actions">
    ${nextMod ? `<button type="button" class="conj-btn" id="tlNextMod">${s.nextMod(s.mods[nextMod])}</button>` : ""}
    <button type="button" class="flash-secondary" id="tlMenu">${s.backMenu}</button></div>`;
  return html;
}
function tlBindResult(){
  const n = document.getElementById("tlNextMod");
  if(n) n.addEventListener("click", () => { tlNextModule(); document.getElementById("tlBody").scrollTop = 0; });
  document.getElementById("tlMenu").addEventListener("click", () => { tl = null; tlRender(); });
}

document.getElementById("tlClose").addEventListener("click", closeTelc);
document.getElementById("tlOverlay").addEventListener("click", (ev) => { if(ev.target.id === "tlOverlay") closeTelc(); });
document.addEventListener("keydown", (ev) => {
  if(ev.key === "Escape" && document.getElementById("tlOverlay").classList.contains("open")) closeTelc();
});
