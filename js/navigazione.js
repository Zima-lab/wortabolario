/* Wortabolario — js/navigazione.js  (10/14)
   Tab in basso (Casa · Cerca · Esercizi · Preferiti) e collegamento di tutti i pulsanti fissi della pagina.
   Tutti i file di js/ condividono le stesse variabili: l'ordine di caricamento è in index.html. */

/* ---------- NAVIGAZIONE A TAB (Casa · Cerca · Esercizi · Preferiti) ----------
   Ogni funzione è raggiungibile con un tap dal bordo inferiore (zona del pollice). */

let currentTab = "home";
let resultsOverride = null;   // la tab Preferiti forza il filtro senza toccare quello di Cerca

/* v53 — Su desktop (≥1024px) la tab bar diventa un menu laterale e la ricerca resta sempre
   visibile in alto (layout come Glifo). Il valore deve coincidere con la sez. 16 di style.css. */
const desktopMQ = typeof window.matchMedia === "function" ? window.matchMedia("(min-width: 1024px)") : { matches: false };
function isDesktop(){ return !!desktopMQ.matches; }

/* v57 — Pagina Esercizi in tre blocchi:
   1. Da fare oggi  (ripasso parole + ripasso esercizi in scadenza)
   2. Allenati      (quiz veloci)
   3. Grammatica per argomento (tutti gli argomenti, divisi per sezione del Bignami)
   Prima gli argomenti erano nascosti dietro la card "Esercizi di grammatica": ora sono in vista.
   Su telefono le sezioni partono chiuse (aperta solo quella con esercizi da ripassare);
   le sezioni aperte/chiuse a mano restano tali finché la pagina non si ricarica. */
const exSecOpen = {};   // chiave sezione → true/false scelto dall'utente
function renderExercises(){
  const s = UI_STRINGS[lang];
  const host = document.getElementById("exercises");
  const nDue = dueEntries().length;
  const nExDue = exDueItems().length;
  const today = [
    { id: "exDue",   ic: "clock",  name: s.exDue,    desc: s.exDueDesc(nDue),      cls: nDue > 0 ? "ex-hot" : "" },
    { id: "exRevEx", ic: "pencil", name: s.exRevEx,  desc: s.exRevExDesc(nExDue),  cls: nExDue > 0 ? "ex-hot" : "" }
  ];
  const train = [
    { id: "exFlash", ic: "cards",  name: s.exFlash, desc: s.exFlashDesc },
    { id: "exGenus", ic: "dice",   name: s.exGenus, desc: s.exGenusDesc },
    { id: "exConj",  ic: "pencil", name: s.exConj,  desc: s.exConjDesc },
    { id: "exTelc",  ic: "exam",   name: s.exTelc,  desc: s.exTelcDesc }
  ];
  const card = c => `
        <button type="button" class="ex-card ${c.cls || ""}" id="${c.id}">
          <span class="ex-ic">${ic(c.ic)}</span>
          <span class="ex-name">${c.name}</span>
          <span class="ex-desc">${c.desc}</span>
        </button>`;

  const groups = {};
  exTopics().forEach(t => { const k = exTopicSection(t); (groups[k] = groups[k] || []).push(t); });
  const secs = SEC_ORDER.filter(k => groups[k]).map(k => {
    const ts = groups[k];
    let tot = 0, mas = 0, now = 0;
    const rows = ts.map(t => {
      const st = exTopicStats(t), n = t.items.length;
      tot += n; mas += st.mastered; now += st.now;
      return `<button type="button" class="ex-topic" data-t="${t.id}">
          <span class="ex-topic-main">
            <span class="ex-topic-name">${exEsc(exTopicName(t))}</span>
            <span class="ex-topic-meta">${s.exItems(n, st.mastered)}</span>
            <span class="ex-bar"><span class="ex-bar-fill" style="width:${Math.round(st.mastered / n * 100)}%"></span></span>
          </span>
          ${st.now > 0 ? `<span class="ex-chip-now">${s.exNowChip(st.now)}</span>` : ""}
        </button>`;
    }).join("");
    const open = k in exSecOpen ? exSecOpen[k] : (isDesktop() || now > 0);
    return `<details class="ex-fold" data-sec="${k}"${open ? " open" : ""}>
        <summary class="gsec gsec-${SEC_COLOR[k]}">
          <span class="gsec-code">${SEC_CODE[k] || k}</span>
          <span class="gsec-title">${SEC_LABELS[k][lang === "en" ? "en" : "it"]}</span>
          ${now > 0 ? `<span class="ex-fold-now">${s.exNowChip(now)}</span>` : ""}
          <span class="gsec-n">${mas}/${tot}</span>
          <span class="ex-fold-chev">${ic("chevron")}</span>
        </summary>
        <div class="ex-topics-grid">${rows}</div>
      </details>`;
  }).join("");

  host.innerHTML = `
    <p class="eyebrow">${s.exTodayTitle}</p>
    <div class="ex-grid ex-grid-today">${today.map(card).join("")}</div>
    <p class="eyebrow ex-eyebrow">${s.exTitle}</p>
    <div class="ex-grid">${train.map(card).join("")}</div>
    <p class="eyebrow ex-eyebrow">${s.exTopicsTitle}</p>
    <p class="ex-pick-hint">${s.exPickHint}</p>
    <div class="ex-topics">${secs}</div>`;

  document.getElementById("exDue").addEventListener("click", () => openFlashcards("due"));
  document.getElementById("exRevEx").addEventListener("click", () => nExDue > 0 ? openExReview() : openExPicker());
  document.getElementById("exFlash").addEventListener("click", () => openFlashcards());
  document.getElementById("exGenus").addEventListener("click", () => openGenusQuiz());
  document.getElementById("exConj").addEventListener("click", () => openConjQuiz());
  document.getElementById("exTelc").addEventListener("click", () => openTelc());
  host.querySelectorAll(".ex-topic").forEach(b => b.addEventListener("click", () => openExTopic(b.dataset.t)));
  host.querySelectorAll(".ex-fold").forEach(d => d.addEventListener("toggle", () => { exSecOpen[d.dataset.sec] = d.open; }));
}

function setTab(t){
  currentTab = t;
  document.querySelectorAll(".tabbar .tab").forEach(b => {
    const on = b.dataset.tab === t;
    b.classList.toggle("active", on);
    b.setAttribute("aria-selected", on);
  });
  updateView();
  window.scrollTo({ top: 0 });
  if(t === "cerca" && isDesktop()) searchEl().focus({ preventScroll: true });
}

function updateView(){
  const showHome = currentTab === "home";
  const showEx = currentTab === "esercizi";
  const showSearch = currentTab === "cerca";
  const showFav = currentTab === "preferiti";
  document.getElementById("home").style.display = showHome ? "" : "none";
  document.getElementById("exercises").style.display = showEx ? "" : "none";
  document.querySelector(".searchbar").style.display = (showSearch || isDesktop()) ? "" : "none";
  document.getElementById("typeFilters").style.display = showSearch ? "" : "none";
  document.getElementById("results").style.display = (showSearch || showFav) ? "" : "none";
  if(showHome) renderHome();
  if(showEx) renderExercises();
  if(showSearch){ resultsOverride = null; renderResults(); }
  if(showFav){ resultsOverride = "preferiti"; renderResults(); }
}


/* ---------- EVENTI ---------- */

searchEl().addEventListener("input", () => {
  document.getElementById("clearBtn").hidden = searchEl().value.length === 0;
  renderSuggestions();
  /* su desktop la ricerca è visibile da ogni tab: scrivere porta ai risultati */
  if(searchEl().value.trim() && currentTab !== "cerca") setTab("cerca");
  else updateView();
});

if(typeof desktopMQ.addEventListener === "function") desktopMQ.addEventListener("change", updateView);
document.getElementById("xpTopChip").addEventListener("click", () => openXpPanel());

searchEl().addEventListener("focus", () => { if(searchEl().value.trim()) renderSuggestions(); });

searchEl().addEventListener("keydown", (ev) => {
  const list = document.getElementById("suggestList");
  if(list.hidden){
    return;
  }
  const items = Array.from(list.querySelectorAll(".suggest-item"));
  if(ev.key === "ArrowDown"){
    ev.preventDefault();
    activeSuggestion = Math.min(activeSuggestion + 1, items.length - 1);
    updateActiveSuggestion(items);
  } else if(ev.key === "ArrowUp"){
    ev.preventDefault();
    activeSuggestion = Math.max(activeSuggestion - 1, 0);
    updateActiveSuggestion(items);
  } else if(ev.key === "Enter"){
    if(activeSuggestion >= 0 && items[activeSuggestion]){
      ev.preventDefault();
      selectEntry(items[activeSuggestion].dataset.id);
    }
  } else if(ev.key === "Escape"){
    closeSuggestions();
  }
});

document.getElementById("clearBtn").addEventListener("click", () => {
  searchEl().value = "";
  document.getElementById("clearBtn").hidden = true;
  closeSuggestions();
  updateView();
  searchEl().focus();
});

document.addEventListener("click", (ev) => {
  const wrap = document.querySelector(".search-input-wrap");
  if(wrap && !wrap.contains(ev.target)) closeSuggestions();
});

document.getElementById("langToggle").addEventListener("click", () => {
  lang = lang === "it" ? "en" : "it";
  localStorage.setItem("wortabolario_lang", lang);
  applyStaticStrings();
  renderFilters();
  renderHome();
  updateView();
  if(searchEl().value.trim()) renderSuggestions();
});

document.getElementById("themeToggle").addEventListener("click", () => {
  theme = theme === "light" ? "dark" : "light";
  localStorage.setItem("wortabolario_theme", theme);
  applyTheme();
});

document.getElementById("conjClose").addEventListener("click", closeConjPanel);
document.getElementById("conjOverlay").addEventListener("click", (ev) => {
  if(ev.target.id === "conjOverlay") closeConjPanel();
});
document.addEventListener("keydown", (ev) => {
  if(ev.key === "Escape" && document.getElementById("conjOverlay").classList.contains("open")) closeConjPanel();
});
