/* Wortabolario — js/ricerca.js  (7/14)
   Filtri, ricerca (anche con errori di battitura), elenco dei risultati e tendina dei suggerimenti.
   Tutti i file di js/ condividono le stesse variabili: l'ordine di caricamento è in index.html. */

/* Articolo colorato per genere (der/die/das) — aiuta a memorizzare il genere */
function genusChip(e){
  if(e.type !== "sostantivo") return null;
  const art = e.de.split(" ")[0].toLowerCase();
  if(art !== "der" && art !== "die" && art !== "das") return null;
  return { art, rest: e.de.slice(art.length + 1) };
}

const searchEl = () => document.getElementById("search");

function typeCount(t){
  if(t === "tutti") return ENTRIES.length;
  if(t === "preferiti") return favIds.size;
  return ENTRIES.filter(e => e.type === t).length;
}

function renderFilters(){
  const host = document.getElementById("typeFilters");
  const s = UI_STRINGS[lang];
  const types = ["tutti","verbo","sostantivo","aggettivo","grammatica","frase","detto"];
  const chips = types.map(t =>
    `<button class="chip ${activeType===t?'active':''}" data-t="${t}" aria-pressed="${activeType===t}">${TL(t)}<span class="chip-n">${typeCount(t)}</span></button>`
  );
  chips.push(`<button class="chip chip-fav ${activeType==='preferiti'?'active':''}" data-t="preferiti" aria-pressed="${activeType==='preferiti'}">${ic("star","ic-sm")}${s.favChip}<span class="chip-n">${favIds.size}</span></button>`);
  host.innerHTML = chips.join("") + `
    <select id="sortSel" aria-label="Ordinamento">
      <option value="orig" ${sortMode==='orig'?'selected':''}>${s.sortOrig}</option>
      <option value="az" ${sortMode==='az'?'selected':''}>${s.sortAZ}</option>
      <option value="za" ${sortMode==='za'?'selected':''}>${s.sortZA}</option>
    </select>`;
  host.querySelectorAll(".chip").forEach(b=>{
    b.addEventListener("click", ()=>{ activeType = b.dataset.t; renderFilters(); updateView(); });
  });
  document.getElementById("sortSel").addEventListener("change", (ev)=>{
    sortMode = ev.target.value;
    localStorage.setItem("wortabolario_sort", sortMode);
    updateView();
  });
}

/* Ricerca tollerante: normalizza gli umlaut (ü→u, ß→ss) e, se non trova nulla,
   accetta 1 errore di battitura (distanza di Levenshtein ≤ 1) sulle parole chiave. */
function normSearch(s){ return deUmlaut(s.toLowerCase()).replace(/ß/g, "ss"); }

function lev1(a, b){
  if(a === b) return true;
  const la = a.length, lb = b.length;
  if(Math.abs(la - lb) > 1) return false;
  let i = 0, j = 0, edits = 0;
  while(i < la && j < lb){
    if(a[i] === b[j]){ i++; j++; continue; }
    if(++edits > 1) return false;
    if(la > lb) i++;
    else if(lb > la) j++;
    else { i++; j++; }
  }
  return edits + (la - i) + (lb - j) <= 1;
}

function matches(entry, q){
  if(!q) return true;
  const hay = [
    entry.de, entry.it, entry.en, entry.catLabel,
    ...entry.fields.map(f=>f[1]),
    ...entry.rows.map(rowText), ...entry.enRows.map(rowText),
    ...(entry.tables || []).map(tableText),
    ...entry.ex.flat(), ...entry.enEx.flat()
  ].join(" ").toLowerCase();
  if(hay.includes(q)) return true;
  const nq = normSearch(q);
  if(normSearch(hay).includes(nq)) return true;
  if(nq.length < 4) return false;   // niente fuzzy su query cortissime: troppi falsi positivi
  return [entry.de, entry.it, entry.en || ""].join(" ").toLowerCase()
    .split(/[\s,.;:()'"!?\/–—-]+/)
    .some(w => w.length >= 3 && lev1(normSearch(w), nq));
}


function sortList(list){
  if(sortMode === "orig") return list;
  const key = e => e.de.replace(/^(der|die|das)\s+/i, "").toLowerCase();
  const sorted = [...list].sort((a,b) => key(a).localeCompare(key(b), "de"));
  return sortMode === "za" ? sorted.reverse() : sorted;
}

function renderResults(){
  const q = searchEl().value.trim().toLowerCase();
  const s = UI_STRINGS[lang];
  const type = resultsOverride || activeType;
  let list = ENTRIES.filter(e =>
    type === "tutti" ? true :
    type === "preferiti" ? favIds.has(e.id) :
    e.type === type);
  list = sortList(list.filter(e => matches(e, q)));
  document.getElementById("count").textContent = list.length + " / " + ENTRIES.length + s.countSuffix;
  const host = document.getElementById("results");
  if(list.length === 0){
    host.innerHTML = type === "preferiti" && !q
      ? `<div class="empty"><div class="empty-ic">${ic("star")}</div>${s.emptyFavs}</div>`
      : `<div class="empty"><div class="empty-ic">${ic("search")}</div>${s.emptyPrefix}${q}${s.emptySuffix}</div>`;
    return;
  }
  /* Vista grammatica senza ricerca: raggruppata per sezioni A-F come il Bignami */
  if(type === "grammatica" && !q){
    const bySec = {};
    list.forEach(e => { const k = bignamiSection(e) || "A"; (bySec[k] = bySec[k] || []).push(e); });
    host.innerHTML = SEC_ORDER.filter(k => bySec[k]).map(k => {
      const items = bySec[k].slice().sort((x,y) => bignamiPageOf(x) - bignamiPageOf(y));
      return `
      <section class="gsec-group gsec-group-${SEC_COLOR[k]}">
        <div class="gsec gsec-${SEC_COLOR[k]}">
          <span class="gsec-code">${SEC_CODE[k] || k}</span>
          <span class="gsec-title">${SEC_LABELS[k][lang === "en" ? "en" : "it"]}</span>
          <span class="gsec-n">${items.length}</span>
        </div>
        ${items.map(renderEntry).join("")}
      </section>`;
    }).join("");
  } else {
    host.innerHTML = list.map(renderEntry).join("");
  }
  host.querySelectorAll(".entry-head").forEach(h=>{
    h.addEventListener("click", (ev)=>{
      if(ev.target.closest(".fav-btn")) return;
      const entryEl = h.closest(".entry");
      const id = entryEl.dataset.id;
      if(openIds.has(id)) openIds.delete(id); else { openIds.add(id); pushRecent(id); }
      entryEl.classList.toggle("open");
    });
  });
  host.querySelectorAll(".fav-btn").forEach(b=>{
    b.addEventListener("click", (ev)=>{
      ev.stopPropagation();
      toggleFav(b.dataset.fid);
      const on = favIds.has(b.dataset.fid);
      b.classList.toggle("on", on);
      b.innerHTML = on ? ic("starFill") : ic("star");   // innerHTML: il contenuto è un SVG
      b.setAttribute("aria-pressed", on);
      b.setAttribute("aria-label", on ? s.favAriaOn : s.favAria);
      renderFilters();
      if(type === "preferiti" && !on) renderResults();
    });
  });
  bindSpeakBtns(host);
  host.querySelectorAll(".conj-btn[data-vid]").forEach(b=>{
    b.addEventListener("click", ()=>{ renderConjugationPanel(b.dataset.vid); });
  });
  host.querySelectorAll(".ex-entry-btn").forEach(b=>{
    b.addEventListener("click", ()=>{ openExTopic(b.dataset.extopic); });
  });
}


/* ---------- SUGGERIMENTI DI RICERCA (tendina) ---------- */

function rankEntries(q){
  const starts = [], rest = [];
  ENTRIES.forEach(e => {
    const de = e.de.toLowerCase(), it = e.it.toLowerCase(), en = (e.en||"").toLowerCase();
    if(de.startsWith(q) || it.startsWith(q) || en.startsWith(q)) starts.push(e);
    else if(matches(e, q)) rest.push(e);
  });
  return [...starts, ...rest].slice(0, 8);
}

function renderSuggestions(){
  const q = searchEl().value.trim().toLowerCase();
  const list = document.getElementById("suggestList");
  activeSuggestion = -1;
  if(!q){
    list.hidden = true; list.innerHTML = "";
    searchEl().setAttribute("aria-expanded", "false");
    return;
  }
  const items = rankEntries(q);
  if(items.length === 0){
    list.hidden = true; list.innerHTML = "";
    searchEl().setAttribute("aria-expanded", "false");
    return;
  }
  list.hidden = false;
  searchEl().setAttribute("aria-expanded", "true");
  list.innerHTML = items.map((e, i) => {
    const t = L(e);
    return `
    <div class="suggest-item" role="option" id="sugg-${i}" data-id="${e.id}">
      <span class="badge ${e.type}">${TL(e.type)}</span>
      <span class="sde">${e.de}</span>
      <span class="sit">${t.it}</span>
    </div>
  `;}).join("");
  list.querySelectorAll(".suggest-item").forEach(el => {
    el.addEventListener("mousedown", (ev) => { ev.preventDefault(); selectEntry(el.dataset.id); });
  });
}

function updateActiveSuggestion(items){
  items.forEach((el, i) => el.classList.toggle("active", i === activeSuggestion));
  if(activeSuggestion >= 0){
    searchEl().setAttribute("aria-activedescendant", items[activeSuggestion].id);
    items[activeSuggestion].scrollIntoView({ block: "nearest" });
  } else {
    searchEl().removeAttribute("aria-activedescendant");
  }
}

function closeSuggestions(){
  const list = document.getElementById("suggestList");
  list.hidden = true;
  searchEl().setAttribute("aria-expanded", "false");
  activeSuggestion = -1;
}

/* Selezione di una voce (da tendina, da scheda "Oggi", o da tastiera):
   porta l'utente dritto al risultato, senza fargli scorrere l'intera lista. */
function selectEntry(id){
  const e = ENTRIES.find(x => x.id === id);
  if(!e) return;
  searchEl().value = e.de;
  document.getElementById("clearBtn").hidden = false;
  closeSuggestions();
  activeType = "tutti";
  renderFilters();
  setTab("cerca");   // il dettaglio di una voce vive nella tab Cerca
  openIds.add(e.id);
  pushRecent(e.id);
  requestAnimationFrame(() => {
    const el = document.querySelector(`.entry[data-id="${id}"]`);
    if(el){
      el.classList.add("open");
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}
