/* Wortabolario — js/voci.js  (2/14)
   Riunisce verbi, nomi, aggettivi, grammatica, frasi e detti (cartella dati/) in un unico elenco ENTRIES.
   Tutti i file di js/ condividono le stesse variabili: l'ordine di caricamento è in index.html. */

/* ---------- NORMALIZZAZIONE IN UN UNICO ARRAY ---------- */

let uid = 0;
const ENTRIES = [];

VERBI.forEach(v => {
  ENTRIES.push({
    id: "v"+(uid++), type: "verbo",
    de: v.inf, it: v.it, en: v.en, catLabel: v.cat,
    fields: [ ["Präsens", v.pres], ["Präteritum", v.pra], ["Perfekt", v.perf] ],
    rows: [], enRows: [],
    note: v.note, enNote: v.enNote,
    ex: v.ex, enEx: v.enex,
    raw: v
  });
});

SOSTANTIVI.forEach(s => {
  const f = [ ["Articolo", s.de.split(" ")[0]], ["Plurale", s.pl] ];
  if(s.prep) f.push(["Preposizione", s.prep]);
  ENTRIES.push({
    id: "s"+(uid++), type: "sostantivo",
    de: s.de, it: s.it, en: s.en, catLabel: s.cat,
    fields: f,
    rows: [], enRows: [],
    note: s.note || "", enNote: s.enNote || "",
    ex: s.ex, enEx: s.enex
  });
});

AGGETTIVI.forEach(a => {
  const f = [ ["Comparativo", a.comp], ["Superlativo", a.sup], ["Contrario", a.opp] ];
  if(a.prep) f.unshift(["Preposizione", a.prep]);
  ENTRIES.push({
    id: "a"+(uid++), type: "aggettivo",
    de: a.de, it: a.it, en: a.en, catLabel: a.cat,
    fields: f,
    rows: [], enRows: [],
    note: a.note || "", enNote: a.enNote || "",
    ex: a.ex || [], enEx: a.enex || []
  });
});

GRAMMATICA.forEach(g => {
  /* Tabelle casi × genere: stanno in dati/tabelle.js, con lo stesso titolo "de" della scheda. */
  const gt = GRAM_TABLES[g.de];
  ENTRIES.push({
    id: "g"+(uid++), type: "grammatica",
    de: g.de, it: g.it, en: g.en, catLabel: g.cat,
    fields: [],
    rows: g.rows, enRows: g.enRows,
    note: g.note, enNote: g.enNote,
    ex: g.ex, enEx: g.enEx,
    tables: gt ? gt.tables : []
  });
});

FRASI.forEach(([de, it, en]) => {
  ENTRIES.push({
    id: "f"+(uid++), type: "frase",
    de: de, it: it, en: en, catLabel: "frase utile",
    fields: [], rows: [], enRows: [],
    note: "", enNote: "",
    ex: [], enEx: []
  });
});

DETTI.forEach(([de, it, lit, en, enLit]) => {
  ENTRIES.push({
    id: "d"+(uid++), type: "detto",
    de: de, it: it, en: en, catLabel: "detto",
    fields: [], rows: [], enRows: [],
    note: lit, enNote: enLit,
    ex: [], enEx: []
  });
});
