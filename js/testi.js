/* Wortabolario — js/testi.js  (3/14)
   Tutti i testi dell'interfaccia in italiano e in inglese (UI_STRINGS) e le funzioni per sceglierli.
   Tutti i file di js/ condividono le stesse variabili: l'ordine di caricamento è in index.html. */

/* ---------- LINGUA (IT / EN) ---------- */

let lang = localStorage.getItem("wortabolario_lang") || "it";

const CAT_EN = {
  "casa":"home", "lavoro":"work", "famiglia":"family", "città":"city", "varie":"miscellaneous",
  "cibo":"food", "salute":"health", "corpo":"body", "arte":"art", "scuola":"school",
  "ausiliare":"auxiliary", "modale":"modal", "movimento":"motion", "percezione":"perception",
  "comunicazione":"communication", "quotidiano":"everyday", "mentale":"mental", "posizione":"position",
  "riflessivo":"reflexive", "aggettivo":"adjective", "avverbio":"adverb", "irregolare":"irregular verb",
  "casi":"cases", "pronomi":"pronouns", "reggenza":"verb government", "sintassi":"syntax",
  "verbi con preposizione":"verbs with prepositions",
  "tempi verbali":"verb tenses", "connettori":"connectors", "aggettivi":"adjectives",
  "modali":"modal verbs", "preposizioni":"prepositions", "verbi":"verbs",
  "formazione delle parole":"word formation", "genere":"gender", "numeri":"numbers", "meteo":"weather", "frase utile":"useful phrase", "detto":"saying"
};

const FIELD_LABELS_EN = { "Articolo":"Article", "Plurale":"Plural", "Comparativo":"Comparative", "Superlativo":"Superlative", "Contrario":"Opposite", "Preposizione":"Preposition" };

function trCat(cat){ return lang === "en" ? (CAT_EN[cat] || cat) : cat; }
function trFieldLabel(label){ return lang === "en" ? (FIELD_LABELS_EN[label] || label) : label; }

function L(e){
  if(lang === "en"){
    return { it: e.en || e.it, fields: e.fields, rows: e.enRows, note: e.enNote, ex: e.enEx, catLabel: trCat(e.catLabel), tables: e.tables || [] };
  }
  return { it: e.it, fields: e.fields, rows: e.rows, note: e.note, ex: e.ex, catLabel: e.catLabel, tables: e.tables || [] };
}

const UI_STRINGS = {
  it: {
    subtitle: "Corso tedesco · vocabolario tedesco ↔ italiano — verbi, sostantivi, aggettivi, grammatica",
    placeholder: "Cerca in tedesco o in italiano… (es. 'Wohnung', 'appartamento', 'helfen')",
    clearAria: "Cancella ricerca",
    today: "Oggi",
    cardsOfDay: "Le carte del giorno",
    cardVerbo: "Verbo del giorno", cardParola: "Parola del giorno", cardFrase: "Frase del giorno", cardDetto: "Detto del giorno",
    countSuffix: " voci",
    emptyPrefix: "Nessuna voce trovata per \"", emptySuffix: "\".",
    conjBtn: "Tutte le coniugazioni", conjTitle: "Coniugazione completa", conjClose: "Chiudi", conjNoImperativ: "I verbi modali non hanno un imperativo naturale in tedesco moderno.",
    favAria: "Aggiungi ai preferiti", favAriaOn: "Rimuovi dai preferiti", favChip: "Preferiti",
    learnedTag: "imparata",
    recentTitle: "Riprendi da dove eri",
    progressLabel: (n, tot) => `Hai imparato ${n} ${n===1?"parola":"parole"} su ${tot}`,
    reviewBtn: "Ripassa con le flashcard",
    flashTitle: "Flashcard", flashTap: "Tocca la carta per vedere la traduzione",
    flashKnow: "La sapevo", flashDont: "Da ripassare",
    flashEmpty: "Nessuna carta da ripassare in questa selezione. Aggiungi qualche preferito o cambia filtro!",
    flashDoneTitle: "Ripasso completato!",
    flashDoneMsg: (ok, ko) => `${ok} ${ok===1?"parola saputa":"parole sapute"} · ${ko} da rivedere`,
    flashRestart: "Ricomincia", flashCloseBtn: "Chiudi",
    flashSrcFav: "solo preferiti", flashSrcAll: "tutte le voci",
    dueBtn: (n) => `Da ripassare oggi (${n})`,
    dueAllDone: "Nessuna parola in scadenza oggi — ottimo!",
    /* Sostituisce i 5 pallini ●○○○○ sul retro della flashcard: sembravano
       l'indicatore di un carosello e il loro senso non era leggibile. */
    srsInfo: (lv, giorni) => `Livello ${lv} di 5 · ` + (
      giorni <= 0 ? "da ripassare oggi"
      : giorni === 1 ? "la rivedrai domani"
      : `la rivedrai tra ${giorni} giorni`),
    speakAria: "Ascolta la pronuncia",
    genusBtn: "der · die · das",
    genusTitle: "Quiz: der, die o das?",
    genusPrompt: "Scegli l'articolo giusto",
    genusPlural: "Plurale",
    genusDoneTitle: "Quiz finito!",
    genusDoneMsg: (ok, tot) => `${ok} su ${tot} corretti`,
    genusPerfect: "Perfetto! Genere di ferro.",
    genusGood: "Bene! Le sbagliate finiscono nel ripasso.",
    genusMeh: "Il genere si impara col colore: riprova!",
    bignamiLink: (p) => `Scheda nel Bignami (pag. ${p})`,
    bignamiB2Link: (p) => `Scheda nel Bignami B2 (pag. ${p})`,
    ruleWatch: "Attenzione",
    exHead: "Esempi",
    noteHead: "In breve",
    sortOrig: "Ordine originale", sortAZ: "A → Z", sortZA: "Z → A",
    tabHome: "Casa", tabSearch: "Cerca", tabPractice: "Esercizi", tabFavs: "Preferiti",
    streakTitle: "Giorni di studio consecutivi",
    streakLabel: (n) => `${n} ${n===1?"giorno":"giorni"} di fila`,
    streakStart: "Studia oggi per iniziare la serie!",
    exTitle: "Allenati",
    exDue: "Ripasso di oggi",
    exDueDesc: (n) => n > 0 ? `${n} ${n===1?"parola":"parole"} in scadenza` : "Tutto fatto per oggi",
    exFlash: "Flashcard", exFlashDesc: "Carte DE ↔ IT con ripetizione spaziata",
    exGenus: "der · die · das", exGenusDesc: "Indovina l'articolo giusto",
    exConj: "Coniugazione", exConjDesc: "Scrivi tu la forma verbale richiesta",
    exWww: "wurde · würde · werden", exWwwDesc: "Scegli la forma giusta nella frase",
    wwTitle: "Quiz: wurde, würde o werden?",
    wwPrompt: "Completa la frase con la forma giusta",
    wwPerfect: "Perfetto! Fatti, ipotesi e futuro sono al loro posto.",
    wwGood: "Bene! Le sbagliate finiscono nel ripasso.",
    wwMeh: "Ricorda il trucco dell'Umlaut e riprova!",
    exGram: "Esercizi di grammatica", exGramDesc: (n) => n > 0 ? `${n} da ripassare · per argomento` : "Per argomento, con spiegazione",
    exPickTitle: "Esercizi di grammatica",
    exPickHint: "Scegli un argomento: ogni sessione ha fino a 10 esercizi, con la spiegazione dopo ogni risposta.",
    exReviewBtn: (n) => `Ripassa esercizi (${n})`,
    exReviewTitle: "Ripasso esercizi",
    exItems: (n, m) => `${n} esercizi · ${m} padroneggiati`,
    exNowChip: (n) => `${n} da ripassare`,
    exInstr: { choice: "Scegli la risposta giusta", order: "Metti le parole in ordine: tocca le tessere", gap: "Scrivi tu la parola che manca, con la tastiera", fix: "Dov'è l'errore?" },
    exHint: "Suggerimento", exKeysAria: "Lettere speciali",
    exPlaceholder: "Scrivi qui la parola…",
    exKeysLabel: "Sulla tua tastiera manca una di queste lettere? Toccala e si aggiunge a quello che stai scrivendo.",
    exKeysAlt: "Puoi anche scrivere ae · oe · ue · ss: vale come giusto.",
    exFixHint: "Tocca la parola (o le parole) sbagliata, poi «Verifica».",
    exCheck: "Verifica", exFinish: "Fine",
    exRight: "Richtig!", exWrong: "Non proprio", exCorrectIs: "Giusto:",
    exTopics: "Argomenti", exAgain: "Ancora", exDoneTitle: "Sessione finita!",
    exPerfect: "Perfetto! Tutto al suo posto.", exGood: "Bene! Gli errori tornano nel ripasso.", exMeh: "Rileggi la scheda e riprova: gli errori tornano nel ripasso.",
    exMasteredOf: (m, n) => `Padroneggiati: ${m} su ${n}`,
    exEntryBtn: (n) => `Esercizi (${n})`,
    exDk: "dürfen o können?", exDkDesc: "Permesso o capacità: scegli il modale",
    dkTitle: "Quiz: dürfen o können?",
    dkPrompt: "Completa la frase con il modale giusto",
    dkPerfect: "Perfetto! Permesso e capacità non ti confondono più.",
    dkGood: "Bene! Le sbagliate finiscono nel ripasso.",
    dkMeh: "Chiediti sempre PERCHÉ non puoi, e riprova!",
    xpChipTitle: "I tuoi punti esperienza — tocca per vedere i traguardi",
    xpTitle: "Traguardi",
    xpToNext: (n) => `${n} XP al prossimo trofeo`,
    xpTrophiesTitle: "Trofei vinti",
    xpNoTrophies: "Nessun trofeo ancora — continua a esercitarti!",
    xpMessagesTitle: "Messaggi ricevuti",
    xpNoMessages: "Ancora nessun messaggio: ne arriva uno ogni 50 XP.",
    xpTrophyToast: (n) => `Trofeo #${n} conquistato!`,
    backupTitle: "I tuoi progressi", backupHint: "Esporta un backup di preferiti, parole imparate e ripassi, o importalo su un altro dispositivo.",
    backupExport: "Esporta", backupImport: "Importa",
    importOk: "Progressi importati! L'app ora si ricarica.",
    importErr: "File non valido: scegli un backup esportato da Wortabolario.",
    cqTitle: "Quiz di coniugazione",
    cqPrompt: (tense, person) => `Scrivi il <b>${tense}</b> per <b>${person}</b>`,
    cqPlaceholder: "Scrivi la forma…",
    cqCheck: "Controlla", cqNext: "Avanti →", cqSkip: "Non lo so", quizBack: "← Indietro",
    cqRight: "Giusto!", cqWrongIs: "La forma giusta è",
    cqDoneTitle: "Quiz finito!", cqDoneMsg: (ok, tot) => `${ok} su ${tot} corrette`,
    cqPerfect: "Perfetto! Coniugazioni di ferro.",
    cqGood: "Bene! Le sbagliate finiscono nel ripasso.",
    cqMeh: "Le coniugazioni si domano con la pratica: riprova!",
    emptyFavs: "Non hai ancora preferiti. Tocca la stella accanto a una parola per salvarla qui.",
    footer: "Voci di grammatica e verbi tratte dai PDF della cartella \"Corso tedesco B1-1\" (Präteritum, verbi riflessivi, Futur, TEKAMOLO, i 4 casi, Relativpronomen, Plusquamperfekt, Nebensatz mit nachdem, Infinitiv als Nomen), integrate con vocabolario generale di livello B1, con la lista verbi forti di <a href=\"https://deutschlernerblog.de\" target=\"_blank\" rel=\"noopener\">deutschlernerblog.de</a> e verificate su <a href=\"https://dict.leo.org/tedesco-italiano/\" target=\"_blank\" rel=\"noopener\">dict.leo.org</a>, <a href=\"https://it.langenscheidt.com/tedesco-italiano/\" target=\"_blank\" rel=\"noopener\">Langenscheidt</a> e <a href=\"https://it.pons.com/traduzione\" target=\"_blank\" rel=\"noopener\">PONS</a>. Per approfondimenti: <a href=\"https://www.duden.de/\" target=\"_blank\" rel=\"noopener\">Duden</a>."
  },
  en: {
    subtitle: "German course · German ↔ English vocabulary — verbs, nouns, adjectives, grammar",
    placeholder: "Search in German or English… (e.g. 'Wohnung', 'apartment', 'helfen')",
    clearAria: "Clear search",
    today: "Today",
    cardsOfDay: "Cards of the day",
    cardVerbo: "Verb of the day", cardParola: "Word of the day", cardFrase: "Phrase of the day", cardDetto: "Saying of the day",
    countSuffix: " entries",
    emptyPrefix: "No entry found for \"", emptySuffix: "\".",
    conjBtn: "All conjugations", conjTitle: "Full conjugation", conjClose: "Close", conjNoImperativ: "Modal verbs have no natural imperative in modern German.",
    favAria: "Add to favourites", favAriaOn: "Remove from favourites", favChip: "Favourites",
    learnedTag: "learned",
    recentTitle: "Pick up where you left off",
    progressLabel: (n, tot) => `You have learned ${n} ${n===1?"word":"words"} out of ${tot}`,
    reviewBtn: "Review with flashcards",
    flashTitle: "Flashcards", flashTap: "Tap the card to see the translation",
    flashKnow: "I knew it", flashDont: "Review again",
    flashEmpty: "No cards to review in this selection. Add some favourites or change the filter!",
    flashDoneTitle: "Review complete!",
    flashDoneMsg: (ok, ko) => `${ok} ${ok===1?"word known":"words known"} · ${ko} to review`,
    flashRestart: "Restart", flashCloseBtn: "Close",
    flashSrcFav: "favourites only", flashSrcAll: "all entries",
    dueBtn: (n) => `Due today (${n})`,
    dueAllDone: "No words due today — great job!",
    srsInfo: (lv, days) => `Level ${lv} of 5 · ` + (
      days <= 0 ? "due for review today"
      : days === 1 ? "you'll see it again tomorrow"
      : `you'll see it again in ${days} days`),
    speakAria: "Hear the pronunciation",
    genusBtn: "der · die · das",
    genusTitle: "Quiz: der, die or das?",
    genusPrompt: "Pick the right article",
    genusPlural: "Plural",
    genusDoneTitle: "Quiz finished!",
    genusDoneMsg: (ok, tot) => `${ok} out of ${tot} correct`,
    genusPerfect: "Perfect! Rock-solid genders.",
    genusGood: "Nice! Missed ones go into your review pile.",
    genusMeh: "Gender sticks with colour — try again!",
    bignamiLink: (p) => `See the Bignami sheet (p. ${p})`,
    bignamiB2Link: (p) => `See the B2 Bignami sheet (p. ${p})`,
    ruleWatch: "Watch out",
    exHead: "Examples",
    noteHead: "In short",
    sortOrig: "Original order", sortAZ: "A → Z", sortZA: "Z → A",
    tabHome: "Home", tabSearch: "Search", tabPractice: "Practice", tabFavs: "Favourites",
    streakTitle: "Consecutive study days",
    streakLabel: (n) => `${n} ${n===1?"day":"days"} in a row`,
    streakStart: "Study today to start your streak!",
    exTitle: "Practice",
    exDue: "Today's review",
    exDueDesc: (n) => n > 0 ? `${n} ${n===1?"word":"words"} due` : "All done for today",
    exFlash: "Flashcards", exFlashDesc: "DE ↔ EN cards with spaced repetition",
    exGenus: "der · die · das", exGenusDesc: "Guess the right article",
    exConj: "Conjugation", exConjDesc: "Type the requested verb form yourself",
    exWww: "wurde · würde · werden", exWwwDesc: "Pick the right form in the sentence",
    wwTitle: "Quiz: wurde, würde or werden?",
    wwPrompt: "Complete the sentence with the right form",
    wwPerfect: "Perfect! Facts, hypotheses and future all in place.",
    wwGood: "Well done! Wrong ones go to review.",
    wwMeh: "Remember the umlaut trick and try again!",
    exGram: "Grammar exercises", exGramDesc: (n) => n > 0 ? `${n} to review · by topic` : "By topic, with explanations",
    exPickTitle: "Grammar exercises",
    exPickHint: "Pick a topic: each session has up to 10 exercises, with an explanation after every answer.",
    exReviewBtn: (n) => `Review exercises (${n})`,
    exReviewTitle: "Exercise review",
    exItems: (n, m) => `${n} exercises · ${m} mastered`,
    exNowChip: (n) => `${n} to review`,
    exInstr: { choice: "Pick the right answer", order: "Put the words in order: tap the tiles", gap: "Type the missing word yourself, using the keyboard", fix: "Where is the mistake?" },
    exHint: "Hint", exKeysAria: "Special letters",
    exPlaceholder: "Type the word here…",
    exKeysLabel: "Is one of these letters missing from your keyboard? Tap it to add it to what you are typing.",
    exKeysAlt: "You can also type ae · oe · ue · ss: it counts as correct.",
    exFixHint: "Tap the wrong word (or words), then «Check».",
    exCheck: "Check", exFinish: "Finish",
    exRight: "Richtig!", exWrong: "Not quite", exCorrectIs: "Correct:",
    exTopics: "Topics", exAgain: "Again", exDoneTitle: "Session complete!",
    exPerfect: "Perfect! Everything in place.", exGood: "Well done! Mistakes come back in review.", exMeh: "Re-read the sheet and try again: mistakes come back in review.",
    exMasteredOf: (m, n) => `Mastered: ${m} of ${n}`,
    exEntryBtn: (n) => `Exercises (${n})`,
    exDk: "dürfen or können?", exDkDesc: "Permission or ability: pick the modal",
    dkTitle: "Quiz: dürfen or können?",
    dkPrompt: "Complete the sentence with the right modal",
    dkPerfect: "Perfect! Permission and ability no longer trip you up.",
    dkGood: "Well done! Wrong ones go to review.",
    dkMeh: "Always ask yourself WHY you can't, then try again!",
    xpChipTitle: "Your experience points — tap to see your achievements",
    xpTitle: "Achievements",
    xpToNext: (n) => `${n} XP to your next trophy`,
    xpTrophiesTitle: "Trophies won",
    xpNoTrophies: "No trophies yet — keep practising!",
    xpMessagesTitle: "Messages received",
    xpNoMessages: "No messages yet: one arrives every 50 XP.",
    xpTrophyToast: (n) => `Trophy #${n} earned!`,
    backupTitle: "Your progress", backupHint: "Export a backup of favourites, learned words and reviews, or import it on another device.",
    backupExport: "Export", backupImport: "Import",
    importOk: "Progress imported! The app will now reload.",
    importErr: "Invalid file: choose a backup exported from Wortabolario.",
    cqTitle: "Conjugation quiz",
    cqPrompt: (tense, person) => `Type the <b>${tense}</b> for <b>${person}</b>`,
    cqPlaceholder: "Type the form…",
    cqCheck: "Check", cqNext: "Next →", cqSkip: "I don't know", quizBack: "← Back",
    cqRight: "Correct!", cqWrongIs: "The right form is",
    cqDoneTitle: "Quiz finished!", cqDoneMsg: (ok, tot) => `${ok} out of ${tot} correct`,
    cqPerfect: "Perfect! Rock-solid conjugations.",
    cqGood: "Nice! Missed ones go into your review pile.",
    cqMeh: "Conjugations yield to practice — try again!",
    emptyFavs: "No favourites yet. Tap the star next to a word to save it here.",
    footer: "Grammar and verb entries drawn from the PDFs in the \"Corso tedesco B1-1\" folder (Präteritum, reflexive verbs, Futur, TEKAMOLO, the 4 cases, Relativpronomen, Plusquamperfekt, nachdem-clauses, Infinitiv als Nomen), combined with general B1-level vocabulary, with the strong-verb list from <a href=\"https://deutschlernerblog.de\" target=\"_blank\" rel=\"noopener\">deutschlernerblog.de</a> and checked against <a href=\"https://dict.leo.org/tedesco-italiano/\" target=\"_blank\" rel=\"noopener\">dict.leo.org</a>, <a href=\"https://it.langenscheidt.com/tedesco-italiano/\" target=\"_blank\" rel=\"noopener\">Langenscheidt</a> and <a href=\"https://it.pons.com/traduzione\" target=\"_blank\" rel=\"noopener\">PONS</a>. For further reading: <a href=\"https://www.duden.de/\" target=\"_blank\" rel=\"noopener\">Duden</a>."
  }
};

function applyStaticStrings(){
  const s = UI_STRINGS[lang];
  document.getElementById("subTitle").textContent = s.subtitle;
  searchEl().placeholder = s.placeholder;
  document.getElementById("clearBtn").setAttribute("aria-label", s.clearAria);
  document.getElementById("footerNote").innerHTML = s.footer;
  const verEl = document.getElementById("appVersion");
  if(verEl && typeof APP_VERSION !== "undefined") verEl.textContent = "Wortabolario " + APP_VERSION;
  document.documentElement.lang = lang;
  document.querySelectorAll(".lang-toggle .lang-opt").forEach(el=>{
    el.classList.toggle("active", el.dataset.lang === lang);
  });
  const conjCloseBtn = document.getElementById("conjClose");
  if(conjCloseBtn) conjCloseBtn.setAttribute("aria-label", s.conjClose);
  const cqCloseBtn = document.getElementById("cqClose");
  if(cqCloseBtn) cqCloseBtn.setAttribute("aria-label", s.conjClose);
  const exCloseBtn = document.getElementById("exClose");
  if(exCloseBtn) exCloseBtn.setAttribute("aria-label", s.conjClose);
  const xpCloseBtn = document.getElementById("xpClose");
  if(xpCloseBtn) xpCloseBtn.setAttribute("aria-label", s.conjClose);
  document.querySelectorAll(".tabbar .tab-lb").forEach(el => {
    if(s[el.dataset.tl]) el.textContent = s[el.dataset.tl];
  });
}
