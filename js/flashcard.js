/* Wortabolario — js/flashcard.js  (11/14)
   Flashcard con ripasso a intervalli.
   Tutti i file di js/ condividono le stesse variabili: l'ordine di caricamento è in index.html. */

/* ---------- FLASHCARD (ripasso attivo) ---------- */

let flashDeck = [], flashIdx = 0, flashOk = 0, flashKo = 0, flashFlipped = false, flashSource = "auto";
/* Direzione: "deit" = riconoscimento (vedi il tedesco), "itde" = produzione (vedi la traduzione,
   devi ricordare il tedesco) — più difficile e più efficace per fissare le parole. */
let flashDir = localStorage.getItem("wortabolario_flashdir") || "deit";

function buildDeck(){
  let pool;
  if(flashSource === "due"){
    pool = dueEntries();
  } else if(flashSource === "fav" || (flashSource === "auto" && activeType === "preferiti")){
    pool = ENTRIES.filter(e => favIds.has(e.id));
    flashSource = "fav";
  } else {
    pool = ENTRIES.filter(e => activeType === "tutti" || activeType === "preferiti" || e.type === activeType);
    flashSource = "all";
  }
  // prima le non imparate, poi mescola (ma nel mazzo "da ripassare" contano tutte)
  if(flashSource !== "due"){
    const fresh = pool.filter(e => !learnedIds.has(e.id));
    pool = fresh.length >= 5 ? fresh : pool;
  }
  const deck = [...pool];
  for(let i = deck.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck.slice(0, 20);
}

function openFlashcards(src){
  flashSource = src || "auto";
  flashDeck = buildDeck();
  flashIdx = 0; flashOk = 0; flashKo = 0; flashFlipped = false;
  document.getElementById("flashOverlay").classList.add("open");
  document.body.classList.add("conj-lock");
  renderFlash();
}
function closeFlashcards(){
  document.getElementById("flashOverlay").classList.remove("open");
  document.body.classList.remove("conj-lock");
  renderFilters();
  updateView();
}

function renderFlash(){
  const s = UI_STRINGS[lang];
  const body = document.getElementById("flashBody");
  document.getElementById("flashTitle").textContent = s.flashTitle +
    (flashDeck.length ? ` · ${Math.min(flashIdx + 1, flashDeck.length)} / ${flashDeck.length}` : "");

  if(flashDeck.length === 0){
    body.innerHTML = `<div class="empty"><div class="empty-ic">${ic("cards")}</div>${s.flashEmpty}</div>`;
    return;
  }
  if(flashIdx >= flashDeck.length){
    body.innerHTML = `
      <div class="flash-done">
        <div class="flash-done-ic">${ic("checkSeal")}</div>
        <h3>${s.flashDoneTitle}</h3>
        <p>${s.flashDoneMsg(flashOk, flashKo)}</p>
        <div class="flash-actions">
          <button type="button" class="conj-btn" id="flashRestart">${s.flashRestart}</button>
          <button type="button" class="flash-secondary" id="flashEnd">${s.flashCloseBtn}</button>
        </div>
      </div>`;
    document.getElementById("flashRestart").addEventListener("click", () => openFlashcards(flashSource));
    document.getElementById("flashEnd").addEventListener("click", closeFlashcards);
    return;
  }

  const e = flashDeck[flashIdx];
  const t = L(e);
  const g = genusChip(e);
  const deHtml = g ? `<span class="genus genus-${g.art}">${g.art}</span> ${g.rest}` : e.de;
  const backExtra = t.ex && t.ex.length ? `<div class="flash-ex">"${t.ex[0][0]}"<br><span>${t.ex[0][1]}</span></div>` : "";

  // direzione: cosa mostra il fronte e cosa il retro
  const trLabel = lang === "en" ? "EN" : "IT";
  const spk = speakBtnHtml(e.de, "flash-speak");
  /* Stato del ripasso a intervalli, in chiaro. Solo per le parole già
     incontrate: su una parola nuova non c'è ancora niente da dire. */
  const srs = srsData[e.id];
  const lv = (srs && srs.lv) || 0;
  const lvHtml = lv > 0
    ? `<div class="srs-lv">${ic("clock", "ic-sm")}${s.srsInfo(lv, (srs.due || 0) - todayIdx())}</div>`
    : "";
  const front = flashDir === "deit"
    ? `<div class="flash-word">${deHtml}</div>${spk}`
    : `<div class="flash-word flash-word-tr">${t.it}</div>`;
  const back = flashDir === "deit"
    ? `<div class="flash-word-sm">${e.de}</div><div class="flash-tr">${t.it}</div>${backExtra}${lvHtml}`
    : `<div class="flash-word-sm">${t.it}</div><div class="flash-tr flash-tr-de">${deHtml}</div>${spk}${backExtra}${lvHtml}`;

  body.innerHTML = `
    <div class="flash-topbar">
      <div class="flash-progress"><div class="flash-progress-fill" style="width:${(flashIdx / flashDeck.length) * 100}%"></div></div>
      <div class="flash-dir" id="flashDir" role="group" aria-label="Direzione flashcard">
        <button type="button" class="flash-dir-opt ${flashDir==='deit'?'active':''}" data-dir="deit" aria-pressed="${flashDir==='deit'}">DE → ${trLabel}</button>
        <button type="button" class="flash-dir-opt ${flashDir==='itde'?'active':''}" data-dir="itde" aria-pressed="${flashDir==='itde'}">${trLabel} → DE</button>
      </div>
    </div>
    <div class="flash-card ${flashFlipped ? 'flipped' : ''}" id="flashCard" tabindex="0" role="button" aria-label="${s.flashTap}">
      <div class="flash-inner">
        <div class="flash-face flash-front">
          <span class="badge ${e.type}">${TL(e.type)}</span>
          ${front}
          <div class="flash-hint">${s.flashTap}</div>
        </div>
        <div class="flash-face flash-back">
          ${back}
        </div>
      </div>
    </div>
    <div class="flash-actions ${flashFlipped ? '' : 'hidden'}">
      <button type="button" class="flash-btn flash-no" id="flashNo">${ic("rotate","ic-sm")}${s.flashDont}</button>
      <button type="button" class="flash-btn flash-yes" id="flashYes">${ic("check","ic-sm")}${s.flashKnow}</button>
    </div>`;

  document.querySelectorAll("#flashDir .flash-dir-opt").forEach(b => {
    b.addEventListener("click", (ev) => {
      ev.stopPropagation();
      if(b.dataset.dir === flashDir) return;
      flashDir = b.dataset.dir;
      localStorage.setItem("wortabolario_flashdir", flashDir);
      flashFlipped = false;
      renderFlash();
    });
  });

  bindSpeakBtns(body);
  const card = document.getElementById("flashCard");
  const flip = (ev) => {
    if(ev && ev.target && ev.target.closest(".speak-btn")) return;
    flashFlipped = !flashFlipped; renderFlash();
  };
  card.addEventListener("click", flip);
  card.addEventListener("keydown", (ev) => { if(ev.key === "Enter" || ev.key === " "){ ev.preventDefault(); flip(); } });

  const nyes = document.getElementById("flashYes"), nno = document.getElementById("flashNo");
  if(nyes) nyes.addEventListener("click", () => {
    srsAnswer(e.id, true); flashOk++;      // SRS: sale di livello, la rivedrai più in là
    awardXp(XP_EASY);   // flashcard = riconoscimento, il gradino più facile
    flashIdx++; flashFlipped = false; renderFlash();
  });
  if(nno) nno.addEventListener("click", () => {
    srsAnswer(e.id, false); flashKo++;     // SRS: torna a livello 0, in scadenza oggi
    flashDeck.push(e); // la carta torna in fondo al mazzo
    flashIdx++; flashFlipped = false; renderFlash();
  });
}

document.getElementById("flashClose").addEventListener("click", closeFlashcards);
document.getElementById("flashOverlay").addEventListener("click", (ev) => {
  if(ev.target.id === "flashOverlay") closeFlashcards();
});
document.addEventListener("keydown", (ev) => {
  if(ev.key === "Escape" && document.getElementById("flashOverlay").classList.contains("open")) closeFlashcards();
});
