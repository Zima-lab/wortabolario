/* Wortabolario — js/bignami.js  (6/14)
   Collegamento di ogni scheda di grammatica alla pagina del Bignami B1/B2 e alle sezioni A–F.
   Tutti i file di js/ condividono le stesse variabili: l'ordine di caricamento è in index.html. */

/* ---------- COLLEGAMENTO AL BIGNAMI (PDF, pagina per pagina) ---------- */

const BIGNAMI_PDF = "Grammatica_Tedesca_B1_Bignami.pdf";
const BIGNAMI_PDF_EN = "German_Grammar_B1_Bignami_EN.pdf";
/* Stesso layout e stessa numerazione di pagina in entrambe le lingue:
   BIGNAMI_PAGES vale per tutti e due i PDF. */
function bignamiPdf(){ return lang === "en" ? BIGNAMI_PDF_EN : BIGNAMI_PDF; }
const BIGNAMI_PAGES = {
  /* v39 — Bignami B1 riorganizzato (54 pp): doppioni uniti, schede nuove,
     tabelle casi × genere. Le chiavi = campo "de" delle voci GRAMMATICA. */
  /* Sezione A · I casi e i pronomi (pp. 2-15) */
  "Interrogativpronomen": 2,
  "Der/die/das — Artikel nach Kasus": 3,
  "ein / kein — Artikel nach Kasus": 3,
  "Personalpronomen nei casi": 3,
  "Possessivpronomen": 3,
  "Verben mit Dativ": 3,
  "Nominativ/Akkusativ/Dativ — il trucco": 3,
  "der, die oder das? — il genere del nome": 4,
  "Der Plural — come si forma il plurale": 5,
  "Relativpronomen": 6,
  "Reflexivpronomen (Akk./Dat.)": 7,
  "Riflessivo + parte del corpo: mich o mir?": 7,
  "Adjektivdeklination — le desinenze": 8,
  "nicht brauchen zu": 9,
  "Indefinitpronomen": 10,
  "Infinitiv als Nomen": 11,
  "Adjektivendungen im Genitiv": 12,
  "Adjektive ohne Artikel — Nullartikel": 13,
  "Partizip I & II als Adjektiv": 14,
  "n-Deklination": 15,
  /* Sezione B · Preposizioni e verbi (pp. 16-22) */
  "Präpositionen — Akkusativ, Dativ oder Wechsel?": 16,
  "Präposition + Artikel — am, im, ins, zum, zur": 16,
  "mit · zu · von — sempre dativo": 16,
  "Auf, über, als, mit, bei, zu": 17,
  "Pronominaladverb: wo(r)+ / da(r)+": 18,
  "Preposizione vs Präpositionaladverb — la differenza": 18,
  "Verben mit Präpositionen": 19,
  "telefonieren mit vs. anrufen": 19,
  "Präposition + dass-Satz": 20,
  "sonst": 21,
  "Präpositionen mit Genitiv": 22,
  /* Sezione C · Congiunzioni e Nebensätze (pp. 23-33) */
  "Nebensatz mit bevor": 23,
  "Konjunktionaladverbien vs Subjunktionen": 24,
  "Connettori doppi": 24,
  "nicht nur... sondern auch": 24,
  "Infinitiv mit zu": 25,
  "um...zu / damit": 25,
  "als / wenn / wann": 26,
  "Weitere Konjunktionen — falls, indem, solange, sodass": 27,
  "seit/seitdem und bis": 26,
  "Verben mit doppelter Bedeutung": 28,
  "Coppie che si confondono: lernen · laufen · üben": 28,
  "Wenn das Komma die Bedeutung ändert": 29,
  "Nebensatz mit während": 30,
  "Nebensatz mit nachdem": 31,
  "entweder … oder": 32,
  "Relativsätze: Präposition, wo, was": 33,
  /* Sezione D · Tempi verbali (pp. 34-41) */
  "Das Perfekt — haben oder sein?": 34,
  "Präteritum: verbi forti, misti, irregolari": 35,
  "Modalverben — Präsens und Präteritum": 36,
  "Verbi modali: mai zu davanti all'infinito": 36,
  "Futur I — werden + Infinitiv": 37,
  "Futur II": 37,
  "Konjunktiv II": 38,
  "Konjunktiv I — die indirekte Rede": 38,
  "Das Passiv": 39,
  "Plusquamperfekt": 40,
  "Passiv mit Modalverben": 41,
  /* Sezione E · Struttura della frase (pp. 42-44) */
  "Tekamolo": 42,
  "Komparativ & Superlativ": 43,
  "Comparativi irregolari: viel · gern · gut": 43,
  "Adjektivdeklination + Komparativ/Superlativ": 44,
  /* Sezione F · Luogo e direzione (pp. 45-47) */
  "Wohin? / Wo? — i nomi geografici": 45,
  "an · in · auf · zu/bei — dove vai / dove sei": 46,
  "am Montag · in der Nacht — le preposizioni di tempo": 46,
  "W-Fragen — wo, wohin, woher · hin und her": 47,
  /* Appendice (pp. 48-54) */
  "wurde · würde · werden — le differenze": 48,
  "dürfen · können — le differenze": 49,
  "Position 0 — und/aber/oder/denn/sondern": 50,
  "also · so — Folge und Vergleich": 50,
  "Kommasetzung — la virgola": 51,
  "Die Zeichensetzung — Punkt, Ausrufezeichen, Doppelpunkt": 52,
  "Der Brief — Anrede und Gruß": 53,
  "Zahlen und Ordnungszahlen": 54,
  "Das Wetter — es regnet, es ist kalt": 54,
  /* Schede del Grammatikanhang del libro: hanno una pagina nel Bignami B2
     (BIGNAMI_B2_PAGES ha la precedenza); qui la pagina "madre" del B1. */
  "Indirekte Fragen — ob und W-Wörter": 2,
  "Negationswörter — nicht, kein, nichts, niemand": 10,
  "Zweiteilige und nachgestellte Präpositionen": 17,
  "Adjektive mit Präpositionen": 19,
  "Nomen mit Präpositionen": 19,
  "Nomen-Verb-Verbindungen": 19,
  "ohne … zu und (an)statt … zu": 25,
  "Trennbare und untrennbare Vorsilben": 34,
  "Perfekt mit doppeltem Infinitiv": 34,
  "Das Wort es — le sue funzioni": 42,
  "je …, desto / umso — und Vergleiche": 43,
  "Das Verb lassen — vier Bedeutungen": 49,
  "Vermutungen mit Modalverben — die Sicherheitsskala": 49,
  "Das Wort eigentlich — Adverb oder Modalpartikel": 42,
  "Modalpartikeln — denn, eigentlich, doch, ja, aber, wohl": 42,
  "Dativ und Akkusativ im Mittelfeld — die Reihenfolge": 42,
  "Vergleichssätze mit als oder wie": 43,
  "Wortbildung: Nomen — Nominalisierung, -ung, -heit, -keit": 4,
  "Wortbildung: Adjektive — un-, in-, des- und -bar, -los, -reich, -voll": 14,
  "Infinitivsatz oder dass-Satz?": 25,
  "Infinitiv Perfekt — geschrieben zu haben": 25
};

/* ---------- BIGNAMI B2 (dalla v33) ----------
   Le schede nuove rispetto al B1 hanno una pagina propria nel Bignami B2.
   BIGNAMI_PAGES resta invariato (pagina "madre" nel B1): se una scheda sta
   anche qui, il link e la sezione della vista grammatica usano il B2. */
const BIGNAMI_B2_PDF = "Grammatica_Tedesca_B2_Bignami.pdf";
const BIGNAMI_B2_PDF_EN = "German_Grammar_B2_Bignami_EN.pdf";
function bignamiB2Pdf(){ return lang === "en" ? BIGNAMI_B2_PDF_EN : BIGNAMI_B2_PDF; }
const BIGNAMI_B2_PAGES = {
  "Perfekt mit doppeltem Infinitiv": 2,
  "Das Verb lassen — vier Bedeutungen": 3,
  "Vermutungen mit Modalverben — die Sicherheitsskala": 4,
  "Trennbare und untrennbare Vorsilben": 5,
  "Konjunktiv I — die indirekte Rede": 6,
  "Dativ und Akkusativ im Mittelfeld — die Reihenfolge": 7,
  "Das Wort es — le sue funzioni": 8,
  "Indirekte Fragen — ob und W-Wörter": 9,
  "Negationswörter — nicht, kein, nichts, niemand": 10,
  "Vergleichssätze mit als oder wie": 11,
  "je …, desto / umso — und Vergleiche": 12,
  "ohne … zu und (an)statt … zu": 13,
  "Infinitivsatz oder dass-Satz?": 14,
  "Infinitiv Perfekt — geschrieben zu haben": 15,
  "Zweiteilige und nachgestellte Präpositionen": 16,
  "Adjektive mit Präpositionen": 17,
  "Nomen mit Präpositionen": 18,
  "Nomen-Verb-Verbindungen": 19,
  "Wortbildung: Nomen — Nominalisierung, -ung, -heit, -keit": 20,
  "Wortbildung: Adjektive — un-, in-, des- und -bar, -los, -reich, -voll": 21,
  "Modalpartikeln — denn, eigentlich, doch, ja, aber, wohl": 22,
  "Das Wort eigentlich — Adverb oder Modalpartikel": 22,
  "also · so — Folge und Vergleich": 23
};
/* Sezioni del B2 (v41): A verbi (2-6) · B frase (7-15) · C preposizioni (16-19) · D parole (20-22) */
function bignamiB2Section(p){ return p <= 6 ? "B2A" : p <= 15 ? "B2B" : p <= 19 ? "B2C" : "B2D"; }
function bignamiPageOf(e){ return BIGNAMI_B2_PAGES[e.de] || BIGNAMI_PAGES[e.de] || 99; }

/* ---------- SEZIONI DEL BIGNAMI (A-F) ----------
   La sezione si ricava dalla pagina del PDF: così la vista grammatica
   dell'app rispecchia l'indice del Bignami, con gli stessi colori. */
function bignamiSection(e){
  const p2 = BIGNAMI_B2_PAGES[e.de];
  if(p2) return bignamiB2Section(p2);
  const p = BIGNAMI_PAGES[e.de];
  if(!p) return null;
  if(p <= 15) return "A";
  if(p <= 22) return "B";
  if(p <= 33) return "C";
  if(p <= 41) return "D";
  if(p <= 44) return "E";
  if(p <= 47) return "F";
  return "AP";
}
const SEC_ORDER = ["A","B","C","D","E","F","AP", "B2A","B2B","B2C","B2D", "TELC"];
const SEC_LABELS = {
  A: { it: "I casi e i pronomi",            en: "Cases and pronouns" },
  B: { it: "Preposizioni e verbi",          en: "Prepositions and verbs" },
  C: { it: "Congiunzioni e Nebensätze",     en: "Conjunctions and subordinate clauses" },
  D: { it: "Tempi verbali",                 en: "Verb tenses" },
  E: { it: "Struttura della frase",         en: "Sentence structure" },
  F: { it: "Luogo e direzione",             en: "Place and direction" },
  AP:{ it: "Appendice",                     en: "Appendix" },
  B2A: { it: "B2 · Verbi",                  en: "B2 · Verbs" },
  B2B: { it: "B2 · Struttura della frase",  en: "B2 · Sentence structure" },
  B2C: { it: "B2 · Preposizioni e reggenze", en: "B2 · Prepositions and patterns" },
  B2D: { it: "B2 · Parole e particelle",    en: "B2 · Words and particles" },
  TELC:{ it: "Esame telc B1 · B2",          en: "telc exam B1 · B2" }
};
/* Sigla mostrata nella barra di sezione (B2A → "B2·A") */
const SEC_CODE = { B2A: "B2·A", B2B: "B2·B", B2C: "B2·C", B2D: "B2·D", TELC: "telc" };
/* Colore di sezione come nel PDF: A/E navy, B/F teal, C arancio, D prugna, Appendice ardesia */
const SEC_COLOR = { A: "a", B: "b", C: "c", D: "d", E: "a", F: "b", AP: "ap",
                    B2A: "a", B2B: "b", B2C: "c", B2D: "d", TELC: "c" };
