/* Wortabolario — js/navigazione.js  (10/14)
   Tab in basso (Casa · Cerca · Esercizi · Preferiti) e collegamento di tutti i pulsanti fissi della pagina.
   Tutti i file di js/ condividono le stesse variabili: l'ordine di caricamento è in index.html. */

/* ---------- NAVIGAZIONE A TAB (Casa · Cerca · Esercizi · Preferiti) ----------
   Ogni funzione è raggiungibile con un tap dal bordo inferiore (zona del pollice). */

let currentTab = "home";
let resultsOverride = null;   // la tab Preferiti forza il filtro senza toccare quello di Cerca

function renderExercises(){
  const s = UI_STRINGS[lang];
  const host = document.getElementById("exercises");
  const nDue = dueEntries().length;
  const nExDue = exDueItems().length;
  const cards = [
    { id: "exDue",   ic: "clock",  name: s.exDue,   desc: s.exDueDesc(nDue), cls: nDue > 0 ? "ex-hot" : "" },
    { id: "exGram",  ic: "pencil", name: s.exGram,  desc: s.exGramDesc(nExDue), cls: nExDue > 0 ? "ex-hot" : "" },
    { id: "exFlash", ic: "cards",  name: s.exFlash, desc: s.exFlashDesc },
    { id: "exGenus", ic: "dice",   name: s.exGenus, desc: s.exGenusDesc },
    { id: "exConj",  ic: "pencil", name: s.exConj,  desc: s.exConjDesc },
    { id: "exWww",   ic: "book",   name: s.exWww,   desc: s.exWwwDesc },
    { id: "exDk",    ic: "book",   name: s.exDk,    desc: s.exDkDesc }
  ];
  host.innerHTML = `
    <p class="eyebrow">${s.exTitle}</p>
    <div class="ex-grid">
      ${cards.map(c => `
        <button type="button" class="ex-card ${c.cls || ""}" id="${c.id}">
          <span class="ex-ic">${ic(c.ic)}</span>
          <span class="ex-name">${c.name}</span>
          <span class="ex-desc">${c.desc}</span>
        </button>`).join("")}
    </div>`;
  document.getElementById("exDue").addEventListener("click", () => openFlashcards("due"));
  document.getElementById("exGram").addEventListener("click", openExPicker);
  document.getElementById("exFlash").addEventListener("click", () => openFlashcards());
  document.getElementById("exGenus").addEventListener("click", () => openGenusQuiz());
  document.getElementById("exConj").addEventListener("click", () => openConjQuiz());
  document.getElementById("exWww").addEventListener("click", () => openWwQuiz());
  document.getElementById("exDk").addEventListener("click", () => openDkQuiz());
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
}

function updateView(){
  const showHome = currentTab === "home";
  const showEx = currentTab === "esercizi";
  const showSearch = currentTab === "cerca";
  const showFav = currentTab === "preferiti";
  document.getElementById("home").style.display = showHome ? "" : "none";
  document.getElementById("exercises").style.display = showEx ? "" : "none";
  document.querySelector(".searchbar").style.display = showSearch ? "" : "none";
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
  updateView();
});

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
