/* Wortabolario — js/schede.js  (8/14)
   Disegno di una scheda: tabelle di grammatica, regole a blocchi, esempi e pannello "tutte le coniugazioni".
   Tutti i file di js/ condividono le stesse variabili: l'ordine di caricamento è in index.html. */

/* ---------- TABELLE DI GRAMMATICA (v39) ----------
   Modello del Bignami: righe = casi, colonne = generi con i loro colori.
   Celle: {x} = forma che cambia (evidenziata) · *x* = grassetto. */
const CASE_Q = { Nominativ: "Wer? Was?", Akkusativ: "Wen? Was?", Dativ: "Wem?", Genitiv: "Wessen?" };
function cellHtml(txt){
  return String(txt)
    .replace(/\{([^}]*)\}/g, '<b class="hl">$1</b>')
    .replace(/\*([^*]+)\*/g, "<b>$1</b>");
}
function tLabel(x){ return Array.isArray(x) ? (lang === "en" ? x[1] : x[0]) : x; }
function tableText(tb){
  return [tLabel(tb.caption || ""), ...tb.cols.map(c => c[1]),
          ...tb.rows.map(r => r.map(tLabel).join(" "))].join(" ").replace(/[{}*]/g, "");
}
function gramTableHtml(tb){
  const head = tb.head !== undefined ? tLabel(tb.head) : "Kasus";
  const cap = tb.caption ? `<div class="gtable-cap">${tLabel(tb.caption)}</div>` : "";
  const ths = tb.cols.map(([k, lab]) => `<th class="g-${k}" scope="col">${lab}</th>`).join("");
  const trs = tb.rows.map(r => {
    const lab = tLabel(r[0]);
    const q = CASE_Q[lab];
    const th = `<th scope="row">${lab}${q ? `<span class="gq">${q}</span>` : ""}</th>`;
    const tds = r.slice(1).map((c, i) => `<td class="g-${tb.cols[i][0]}">${cellHtml(c)}</td>`).join("");
    return `<tr>${th}${tds}</tr>`;
  }).join("");
  return `${cap}<div class="gtable-wrap"><table class="gtable"><thead><tr><th class="g-k">${head}</th>${ths}</tr></thead><tbody>${trs}</tbody></table></div>`;
}

/* ---------- RIGHE DI GRAMMATICA (v45) ----------
   Ogni riga è un BLOCCO: titolo in italiano → esempi in tedesco → (consiglio).
   Due formati in dati/grammatica.js, entrambi validi:
   · vecchio: [titolo, "testo"]                              → testo su una riga, " · " = separatore
   · nuovo:   [titolo, [[tedesco, traduzione], …], consiglio?] → un esempio per riga, con traduzione
   Segni nei testi:
   · _x_   parola tedesca dentro una frase italiana → corsivo
   · «x»   tedesco citato → corsivo
   · *x*   dentro una frase tedesca: la parte da notare → evidenziata
   · "✗ "  all'inizio di un esempio = frase SBAGLIATA
   · "A → B" dentro un esempio = trasformazione
   · ★ all'inizio del titolo = regola da non dimenticare (riquadro "Attenzione")
   Il corsivo è SOLO esplicito (_x_ o «x»): un corsivo automatico ne prende metà
   e confonde più di quanto aiuti. */
function richIt(txt){
  return String(txt == null ? "" : txt)
    .replace(/«([^»]*)»/g, '<i class="de-w" lang="de">$1</i>')
    .replace(/_([^_]+)_/g, '<i class="de-w" lang="de">$1</i>');
}
function richDe(txt){
  return String(txt).replace(/\*([^*]+)\*/g, '<b class="hl-de">$1</b>');
}
function rowText(r){
  const body = Array.isArray(r[1]) ? r[1].map(x => [].concat(x).join(" ")).join(" ") : r[1];
  return [r[0], body, r[2] || ""].join(" ").replace(/[_*«»✗★]/g, "");
}
function rowExHtml(item){
  const [de, tr] = [].concat(item);
  const wrong = /^✗\s*/.test(de);
  const clean = String(de).replace(/^[✗✓]\s*/, "");
  const deHtml = clean.split(/\s*→\s*/).map(richDe).join(' <span class="rx-arrow" aria-hidden="true">→</span> ');
  return `<li class="rx${wrong ? " rx-wrong" : ""}">`
    + `<span class="rx-de" lang="de">${wrong ? '<span class="rx-mark">✗</span>' : ""}${deHtml}</span>`
    + (tr ? `<span class="rx-tr">${richIt(tr)}</span>` : "")
    + `</li>`;
}
function ruleHtml(r, s){
  const star = /^★\s*/.test(r[0]);
  const title = richIt(String(r[0]).replace(/^★\s*/, ""));
  const body = Array.isArray(r[1])
    ? `<ul class="rule-ex">${r[1].map(rowExHtml).join("")}</ul>`
    : `<div class="rule-txt">${String(r[1]).split(/\s+·\s+/).map(richIt).join('<span class="sep" aria-hidden="true">·</span>')}</div>`;
  const tip = r[2] ? `<div class="rule-tip">${richIt(r[2])}</div>` : "";
  return `<div class="rule${star ? " rule-star" : ""}">`
    + (star ? `<span class="rule-flag">${ic("starFill", "ic-sm")}${s.ruleWatch}</span>` : "")
    + `<div class="rule-title">${title}</div>${body}${tip}</div>`;
}

function renderEntry(e){
  const t = L(e);
  const s = UI_STRINGS[lang];
  const isOpen = openIds.has(e.id);
  let fieldsHtml = "";
  if(t.fields.length){
    fieldsHtml = `<div class="fields">` + t.fields.filter(f=>f[1]).map(f=>`
      <div class="field"><span class="k">${trFieldLabel(f[0])}</span><b>${f[1]}</b></div>
    `).join("") + `</div>`;
  }
  const tablesHtml = (t.tables || []).map(gramTableHtml).join("");
  let rowsHtml = "";
  if(t.rows.length){
    rowsHtml = `<div class="rules">` + t.rows.map(r => ruleHtml(r, s)).join("") + `</div>`;
  }
  let exHtml = "";
  if(t.ex.length){
    exHtml = `<div class="examples">${e.type === "grammatica" ? `<div class="sec-h">${s.exHead}</div>` : ""}` + t.ex.map(pair=>`
      <div class="example"><div class="de-ex" lang="de">${richDe(pair[0])}</div><div class="it-ex">${richIt(pair[1])}</div></div>
    `).join("") + `</div>`;
  }
  const noteHtml = !t.note ? "" : e.type === "grammatica"
    ? `<div class="note note-rule"><div class="sec-h">${s.noteHead}</div>${String(t.note).split("\n").map(p => `<p>${richIt(p)}</p>`).join("")}</div>`
    : `<div class="note">${t.note}</div>`;
  const b2Page = e.type === "grammatica" ? BIGNAMI_B2_PAGES[e.de] : null;
  const bigPage = e.type === "grammatica" ? BIGNAMI_PAGES[e.de] : null;
  const bignamiHtml = b2Page
    ? `<a class="bignami-link" href="${bignamiB2Pdf()}#page=${b2Page}" target="_blank" rel="noopener">${ic("book","ic-sm")}${s.bignamiB2Link(b2Page)}</a>`
    : bigPage
    ? `<a class="bignami-link" href="${bignamiPdf()}#page=${bigPage}" target="_blank" rel="noopener">${ic("book","ic-sm")}${s.bignamiLink(bigPage)}</a>`
    : "";
  const exTopic = e.type === "grammatica" ? exTopicByCard(e.de) : null;
  const exBtnHtml = exTopic
    ? `<button type="button" class="conj-btn ex-entry-btn" data-extopic="${exTopic.id}">${ic("pencil","ic-sm")}${s.exEntryBtn(exTopic.items.length)}</button>`
    : "";
  const conjBtnHtml = e.type === "verbo"
    ? `<button type="button" class="conj-btn" data-vid="${e.id}">${ic("pencil","ic-sm")}${UI_STRINGS[lang].conjBtn}</button>`
    : "";
  const g = genusChip(e);
  const deHtml = g
    ? `<span class="de"><span class="genus genus-${g.art}" title="${g.art === 'der' ? 'maschile' : g.art === 'die' ? 'femminile' : 'neutro'}">${g.art}</span> ${g.rest}</span>`
    : `<span class="de">${e.de}</span>`;
  const isFav = favIds.has(e.id);
  const isLearned = learnedIds.has(e.id);
  return `
    <div class="entry ${isOpen?'open':''}" data-id="${e.id}">
      <div class="entry-head">
        <div class="left">
          <span class="badge ${e.type}">${TL(e.type)}</span>
          ${deHtml}
          <span class="it">${t.it}</span>
          ${isLearned ? `<span class="learned-tag" title="${s.learnedTag}">${ic("check")}</span>` : ""}
        </div>
        ${e.type !== "grammatica" ? speakBtnHtml(e.de) : (canSpeak ? '<span class="icon-spacer" aria-hidden="true"></span>' : "")}
        <button type="button" class="fav-btn ${isFav?'on':''}" data-fid="${e.id}" aria-label="${isFav ? s.favAriaOn : s.favAria}" aria-pressed="${isFav}">${isFav ? ic("starFill") : ic("star")}</button>
        <span class="chev">${ic('chevron')}</span>
      </div>
      <div class="entry-body">
        ${fieldsHtml}
        ${tablesHtml}
        ${rowsHtml}
        ${exHtml}
        ${noteHtml}
        ${bignamiHtml}
        ${exBtnHtml}
        ${conjBtnHtml}
      </div>
    </div>
  `;
}

/* ---------- PANNELLO "TUTTE LE CONIUGAZIONI" ---------- */

function conjRows(forms){
  return forms.map((f,i) => `<div class="conj-row"><span class="conj-p">${CONJ_PERSONS[i]}</span><span class="conj-f">${f}</span></div>`).join("");
}
function conjCard(label, forms){
  return `<div class="conj-card"><h4>${label}</h4>${conjRows(forms)}</div>`;
}
function conjImpRow(label, form){
  return form ? `<div class="conj-row"><span class="conj-p">${label}</span><span class="conj-f">${form}</span></div>` : "";
}

function renderConjugationPanel(entryId){
  const entry = ENTRIES.find(e => e.id === entryId);
  if(!entry || !entry.raw) return;
  const v = entry.raw;
  const meta = VERB_META[v.inf] || {};
  const p = buildParadigm(v, meta);
  const s = UI_STRINGS[lang];
  const t = L(entry);

  const body = document.getElementById("conjBody");
  body.innerHTML = `
    <div class="conj-verbhead">
      <span class="badge verbo">${TL("verbo")}</span>
      <span class="de">${v.inf}</span>
      <span class="it">${t.it}</span>
    </div>
    <section class="conj-section">
      <h3 class="conj-sectitle">Indikativ</h3>
      <div class="conj-grid">
        ${conjCard("Präsens", p.praesens)}
        ${conjCard("Perfekt", p.perfekt)}
        ${conjCard("Präteritum", p.praeteritum)}
        ${conjCard("Plusquamperfekt", p.plusq)}
        ${conjCard("Futur I", p.futurI)}
        ${conjCard("Futur II", p.futurII)}
      </div>
    </section>
    <section class="conj-section">
      <h3 class="conj-sectitle">Konjunktiv</h3>
      <div class="conj-grid">
        ${conjCard("Konjunktiv I – Präsens", p.konjIPraesens)}
        ${conjCard("Konjunktiv I – Perfekt", p.konjIPerfekt)}
        ${conjCard("Konjunktiv II – Präteritum", p.konjIIPraeteritum)}
        ${conjCard("Konjunktiv II – Plusquamperfekt", p.konjIIPlusq)}
        ${conjCard("Konjunktiv I/II – Futur I", p.konjFuturI)}
        ${conjCard("Konjunktiv I/II – Futur II", p.konjFuturII)}
      </div>
    </section>
    <section class="conj-section">
      <h3 class="conj-sectitle">Imperativ</h3>
      <div class="conj-grid">
        <div class="conj-card">
          <h4>Präsens</h4>
          ${p.imperativ ? [
            conjImpRow("(du)", p.imperativ.du),
            conjImpRow("(wir)", p.imperativ.wir),
            conjImpRow("(ihr)", p.imperativ.ihr),
            conjImpRow("(Sie)", p.imperativ.Sie)
          ].join("") : `<div class="conj-note">${s.conjNoImperativ}</div>`}
        </div>
      </div>
    </section>
    <section class="conj-section">
      <h3 class="conj-sectitle">Unpersönliche Zeiten</h3>
      <div class="conj-grid">
        <div class="conj-card"><h4>Partizip Präsens</h4><div class="conj-row"><span class="conj-f">${p.partizipPraesens}</span></div></div>
        <div class="conj-card"><h4>Partizip Perfekt</h4><div class="conj-row"><span class="conj-f">${p.partizipPerfekt}</span></div></div>
      </div>
    </section>
  `;
  document.getElementById("conjTitle").textContent = s.conjTitle + ": " + v.inf;
  document.getElementById("conjOverlay").classList.add("open");
  document.body.classList.add("conj-lock");
}

function closeConjPanel(){
  document.getElementById("conjOverlay").classList.remove("open");
  document.body.classList.remove("conj-lock");
}
