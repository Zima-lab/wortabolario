/* Wortabolario — js/quiz.js  (12/14)
   Quiz der/die/das, quiz di coniugazione, quiz wurde/würde/werden e quiz dürfen/können.
   Tutti i file di js/ condividono le stesse variabili: l'ordine di caricamento è in index.html. */

/* ---------- QUIZ DER / DIE / DAS ---------- */

let genusDeck = [], genusIdx = 0, genusOk = 0, genusLock = false, genusAnswers = [];

/* v39 — dopo la risposta il quiz der/die/das mostra la regola della desinenza
   (come nella scheda «der, die o das?» del Bignami). Se la parola fa eccezione
   lo dice: aiuta a ricordare proprio i casi strani. */
const GENUS_RULES = [
  /* l'ordine conta: prima le desinenze più lunghe (-ment prima di -ent, -schaft prima di -t…) */
  [/ung$/, "die", true], [/heit$/, "die", true], [/keit$/, "die", true], [/schaft$/, "die", true],
  [/tät$/, "die", true], [/ion$/, "die", false], [/ei$/, "die", false], [/ik$/, "die", false],
  [/ie$/, "die", false], [/ur$/, "die", false], [/age$/, "die", false], [/enz$/, "die", false],
  [/chen$/, "das", true], [/lein$/, "das", true], [/ment$/, "das", false], [/um$/, "das", false],
  [/ett$/, "das", false], [/ma$/, "das", false], [/nis$/, "das", false], [/tum$/, "das", false],
  [/ling$/, "der", true], [/ismus$/, "der", true], [/ig$/, "der", false], [/ant$/, "der", false],
  [/ent$/, "der", false], [/ist$/, "der", false], [/loge$/, "der", false], [/eur$/, "der", false],
  [/är$/, "der", false], [/or$/, "der", false],
  [/e$/, "die", false]
];
function genusRuleHtml(word, art){
  const w = word.split(/[\s,(]/)[0];
  const r = GENUS_RULES.find(([re]) => re.test(w));
  if(!r) return "";
  const [re, ruleArt, always] = r;
  const suf = "-" + re.source.replace("$", "");
  const en = lang === "en";
  const txt = ruleArt === art
    ? (en ? `Rule: ${suf} → ${always ? "always" : "usually"} <b>${ruleArt}</b>`
          : `Regola: ${suf} → ${always ? "sempre" : "di solito"} <b>${ruleArt}</b>`)
    : (en ? `${suf} is usually <b>${ruleArt}</b>, but this word is an exception: <b>${art}</b>`
          : `${suf} di solito è <b>${ruleArt}</b>, ma questa parola è un'eccezione: <b>${art}</b>`);
  return `<div class="genus-rule${ruleArt === art ? "" : " is-exc"}">${ic("book","ic-sm")}${txt}</div>`;
}

function openGenusQuiz(){
  const nouns = ENTRIES.filter(e => genusChip(e));
  for(let i = nouns.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [nouns[i], nouns[j]] = [nouns[j], nouns[i]];
  }
  genusDeck = nouns.slice(0, 15);
  genusIdx = 0; genusOk = 0; genusLock = false; genusAnswers = [];
  document.getElementById("genusOverlay").classList.add("open");
  document.body.classList.add("conj-lock");
  renderGenus();
}
function closeGenusQuiz(){
  document.getElementById("genusOverlay").classList.remove("open");
  document.body.classList.remove("conj-lock");
  updateView();
}

function renderGenus(){
  const s = UI_STRINGS[lang];
  const body = document.getElementById("genusBody");
  document.getElementById("genusTitle").textContent = s.genusTitle +
    (genusDeck.length && genusIdx < genusDeck.length ? ` · ${genusIdx + 1} / ${genusDeck.length}` : "");

  if(genusIdx >= genusDeck.length){
    const msg = genusOk === genusDeck.length ? s.genusPerfect : (genusOk >= genusDeck.length * 0.7 ? s.genusGood : s.genusMeh);
    body.innerHTML = `
      <div class="flash-done">
        <div class="flash-done-ic">${ic(genusOk === genusDeck.length ? "checkSeal" : "dice")}</div>
        <h3>${s.genusDoneTitle}</h3>
        <p>${s.genusDoneMsg(genusOk, genusDeck.length)}<br>${msg}</p>
        <div class="flash-actions">
          <button type="button" class="conj-btn" id="genusRestart">${s.flashRestart}</button>
          <button type="button" class="flash-secondary" id="genusEnd">${s.flashCloseBtn}</button>
        </div>
      </div>`;
    document.getElementById("genusRestart").addEventListener("click", openGenusQuiz);
    document.getElementById("genusEnd").addEventListener("click", closeGenusQuiz);
    return;
  }

  const e = genusDeck[genusIdx];
  const g = genusChip(e);
  const t = L(e);
  const plural = (e.fields.find(f => f[0] === "Plurale") || [])[1];
  const chosen = genusAnswers[genusIdx];   // definito = domanda già risposta (revisione)

  body.innerHTML = `
    <div class="flash-progress"><div class="flash-progress-fill" style="width:${(genusIdx / genusDeck.length) * 100}%"></div></div>
    <div class="genus-question">
      <div class="genus-word" id="genusWord">${g.rest}</div>
      <div class="genus-hint">${s.genusPrompt}</div>
      <div class="genus-answer" id="genusAnswer"></div>
    </div>
    <div class="genus-btns" id="genusBtns">
      <button type="button" class="genus-opt genus-opt-der" data-a="der">der</button>
      <button type="button" class="genus-opt genus-opt-die" data-a="die">die</button>
      <button type="button" class="genus-opt genus-opt-das" data-a="das">das</button>
    </div>
    <div class="genus-nav" id="genusNav">
      ${genusIdx > 0 ? `<button type="button" class="flash-secondary genus-back">${s.quizBack}</button>` : ""}
    </div>`;

  if(chosen){
    /* Stato "risposto" (dopo il clic o tornando indietro): soluzione visibile,
       opzioni bloccate — punteggio e SRS non vengono toccati di nuovo. */
    body.querySelectorAll(".genus-opt").forEach(o => {
      if(o.dataset.a === g.art) o.classList.add("right");
      else if(o.dataset.a === chosen) o.classList.add("wrong");
      o.disabled = true;
    });
    const ans = document.getElementById("genusAnswer");
    ans.innerHTML = `<span class="genus genus-${g.art}">${g.art}</span> <b>${g.rest}</b> — ${t.it}` +
      (plural ? `<span class="genus-pl"> · ${s.genusPlural}: ${plural}</span>` : "") +
      genusRuleHtml(g.rest, g.art);
    ans.classList.add("show");
    /* Il pulsante audio sta accanto alla PAROLA GRANDE, non alla riga della
       soluzione. Compare solo ora che hai risposto: prima leggerebbe
       "der Bereich" e ti regalerebbe l'articolo. La pronuncia non parte mai
       da sola ed è ripetibile quante volte vuoi. */
    const word = document.getElementById("genusWord");
    word.insertAdjacentHTML("beforeend", speakBtnHtml(`${g.art} ${g.rest}`, "quiz-speak"));
    bindSpeakBtns(word);
    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "conj-btn genus-next";
    nextBtn.textContent = s.cqNext;
    nextBtn.addEventListener("click", () => { genusIdx++; genusLock = false; renderGenus(); });
    document.getElementById("genusNav").appendChild(nextBtn);
  } else {
    body.querySelectorAll(".genus-opt").forEach(b => {
      b.addEventListener("click", () => {
        if(genusLock) return;
        genusLock = true;
        const right = b.dataset.a === g.art;
        if(right){ genusOk++; bumpStreak(); awardXp(XP_MED); }
        else srsAnswer(e.id, false);   // genere sbagliato → la parola finisce nel ripasso
        genusAnswers[genusIdx] = b.dataset.a;
        genusLock = false;
        renderGenus();   // ri-renderizza in stato "risposto": soluzione + Avanti/Indietro
      });
    });
  }
  const backBtn = body.querySelector(".genus-back");
  if(backBtn) backBtn.addEventListener("click", () => { genusLock = false; genusIdx--; renderGenus(); });
}

document.getElementById("genusClose").addEventListener("click", closeGenusQuiz);
document.getElementById("genusOverlay").addEventListener("click", (ev) => {
  if(ev.target.id === "genusOverlay") closeGenusQuiz();
});
document.addEventListener("keydown", (ev) => {
  if(ev.key === "Escape" && document.getElementById("genusOverlay").classList.contains("open")) closeGenusQuiz();
});

/* ---------- QUIZ DI CONIUGAZIONE (produzione attiva) ----------
   Riusa buildParadigm: mostra verbo + tempo + persona, e l'utente SCRIVE la forma.
   Allenamento di produzione (non solo riconoscimento): il salto di qualità del B1.
   Le forme sbagliate entrano nell'SRS e ricompaiono nel ripasso di oggi. */

let cqDeck = [], cqIdx = 0, cqOk = 0, cqAnswered = false;
const CQ_TENSES = [["praesens","Präsens"],["praeteritum","Präteritum"],["perfekt","Perfekt"]];

function openConjQuiz(){
  const verbs = ENTRIES.filter(e => e.type === "verbo" && e.raw);
  for(let i = verbs.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [verbs[i], verbs[j]] = [verbs[j], verbs[i]];
  }
  cqDeck = verbs.slice(0, 10).map(e => {
    const p = buildParadigm(e.raw, VERB_META[e.raw.inf] || {});
    const [key, label] = CQ_TENSES[Math.floor(Math.random() * CQ_TENSES.length)];
    const pi = Math.floor(Math.random() * CONJ_PERSONS.length);
    return { e, tense: label, person: CONJ_PERSONS[pi], answer: p[key][pi] };
  });
  cqIdx = 0; cqOk = 0; cqAnswered = false;
  document.getElementById("cqOverlay").classList.add("open");
  document.body.classList.add("conj-lock");
  renderConjQuiz();
}
function closeConjQuiz(){
  document.getElementById("cqOverlay").classList.remove("open");
  document.body.classList.remove("conj-lock");
  updateView();
}

function cqNorm(s){ return s.toLowerCase().replace(/\s+/g, " ").trim(); }
/* Accetta la risposta sia con sia senza pronome: "hilfst" e "du hilfst" sono entrambe giuste. */
function cqStripPronoun(ans, person){
  const prons = person === "er/sie/es" ? ["er","sie","es"] : [person];
  for(const p of prons){
    if(ans.startsWith(p + " ")) return ans.slice(p.length + 1);
  }
  return ans;
}

function renderConjQuiz(){
  const s = UI_STRINGS[lang];
  const body = document.getElementById("cqBody");
  document.getElementById("cqTitle").textContent = s.cqTitle +
    (cqDeck.length && cqIdx < cqDeck.length ? ` · ${cqIdx + 1} / ${cqDeck.length}` : "");

  if(cqIdx >= cqDeck.length){
    const msg = cqOk === cqDeck.length ? s.cqPerfect : (cqOk >= cqDeck.length * 0.7 ? s.cqGood : s.cqMeh);
    body.innerHTML = `
      <div class="flash-done">
        <div class="flash-done-ic">${ic(cqOk === cqDeck.length ? "checkSeal" : "pencil")}</div>
        <h3>${s.cqDoneTitle}</h3>
        <p>${s.cqDoneMsg(cqOk, cqDeck.length)}<br>${msg}</p>
        <div class="flash-actions">
          <button type="button" class="conj-btn" id="cqRestart">${s.flashRestart}</button>
          <button type="button" class="flash-secondary" id="cqEnd">${s.flashCloseBtn}</button>
        </div>
      </div>`;
    document.getElementById("cqRestart").addEventListener("click", openConjQuiz);
    document.getElementById("cqEnd").addEventListener("click", closeConjQuiz);
    return;
  }

  const q = cqDeck[cqIdx];
  const t = L(q.e);
  body.innerHTML = `
    <div class="flash-progress"><div class="flash-progress-fill" style="width:${(cqIdx / cqDeck.length) * 100}%"></div></div>
    <div class="cq-question">
      <div class="cq-verb">${q.e.de} <span class="cq-it">${t.it}</span></div>
      <div class="cq-task">${s.cqPrompt(q.tense, q.person)}</div>
      <input type="text" id="cqInput" class="cq-input" placeholder="${s.cqPlaceholder}"
        autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" lang="de">
      <div class="cq-feedback" id="cqFeedback"></div>
    </div>
    <div class="flash-actions">
      <button type="button" class="flash-secondary" id="cqSkipBtn">${s.cqSkip}</button>
      <button type="button" class="flash-btn flash-yes" id="cqCheckBtn">${s.cqCheck}</button>
    </div>`;

  const input = document.getElementById("cqInput");
  const fb = document.getElementById("cqFeedback");
  const checkBtn = document.getElementById("cqCheckBtn");
  const skipBtn = document.getElementById("cqSkipBtn");
  input.focus();

  const reveal = (right) => {
    if(cqAnswered) return;
    cqAnswered = true;
    bumpStreak();
    /* Niente audio automatico: il pulsante legge la forma completa
       (pronome + verbo) e si può premere quante volte serve. */
    const spk = speakBtnHtml(`${q.person} ${q.answer}`, "quiz-speak");
    if(right){
      cqOk++;
      awardXp(XP_HARD);   // produzione attiva scritta = il gradino più difficile
      fb.innerHTML = `<span class="cq-right">${ic("check","ic-sm")}${s.cqRight}</span> <b>${q.person} ${q.answer}</b>${spk}`;
    } else {
      srsAnswer(q.e.id, false);   // la forma sbagliata finisce nel ripasso di oggi
      fb.innerHTML = `<span class="cq-wrong">${s.cqWrongIs}</span> <b>${q.person} ${q.answer}</b>${spk}`;
    }
    fb.classList.add("show", right ? "ok" : "ko");
    bindSpeakBtns(fb);
    input.disabled = true;
    skipBtn.hidden = true;
    checkBtn.textContent = s.cqNext;
  };
  const submit = () => {
    if(cqAnswered){
      cqIdx++; cqAnswered = false; renderConjQuiz();
      return;
    }
    const user = cqStripPronoun(cqNorm(input.value), q.person);
    if(!user){ input.focus(); return; }
    reveal(user === cqNorm(q.answer));
  };
  checkBtn.addEventListener("click", submit);
  skipBtn.addEventListener("click", () => reveal(false));
  input.addEventListener("keydown", (ev) => { if(ev.key === "Enter"){ ev.preventDefault(); submit(); } });
}

document.getElementById("cqClose").addEventListener("click", closeConjQuiz);
document.getElementById("cqOverlay").addEventListener("click", (ev) => {
  if(ev.target.id === "cqOverlay") closeConjQuiz();
});
document.addEventListener("keydown", (ev) => {
  if(ev.key === "Escape" && document.getElementById("cqOverlay").classList.contains("open")) closeConjQuiz();
});

/* ---------- QUIZ wurde · würde · werden (Appendice del Bignami, p. 44) ----------
   Frase con il buco: si sceglie tra le tre "anime" di werden, coniugate per la
   persona della frase. Ogni soluzione spiega PERCHÉ (il marcatore nella frase).
   Stesso pattern del quiz genus: niente timer, Avanti/Indietro, revisione
   senza ritoccare punteggio/SRS. Errore → la voce Appendice entra nel ripasso. */

const WW_ITEMS = [
  { q:"Ich ___ gern nach Berlin fahren.", opts:["wurde","würde","werde"], a:"würde",
    why:{it:"desiderio (gern) → Konjunktiv II", en:"wish (gern) → Konjunktiv II"} },
  { q:"Er ___ 2010 Arzt.", opts:["wurde","würde","wird"], a:"wurde",
    why:{it:"fatto reale del passato (2010) → Präteritum", en:"real past fact (2010) → Präteritum"} },
  { q:"Das Haus ___ 1990 gebaut.", opts:["wurde","würde","wird"], a:"wurde",
    why:{it:"Passiv al passato (1990)", en:"past passive (1990)"} },
  { q:"___ du mir bitte helfen?", opts:["Wurdest","Würdest","Wirst"], a:"Würdest",
    why:{it:"richiesta gentile (bitte) → Konjunktiv II", en:"polite request (bitte) → Konjunktiv II"} },
  { q:"Morgen ___ ich 30 Jahre alt.", opts:["wurde","würde","werde"], a:"werde",
    why:{it:"futuro certo (morgen) → werden", en:"certain future (morgen) → werden"} },
  { q:"An deiner Stelle ___ ich warten.", opts:["wurde","würde","werde"], a:"würde",
    why:{it:"consiglio/ipotesi (an deiner Stelle) → Konjunktiv II", en:"advice/hypothesis (an deiner Stelle) → Konjunktiv II"} },
  { q:"Das Brot ___ jeden Morgen frisch gebacken.", opts:["wurde","würde","wird"], a:"wird",
    why:{it:"Passiv al presente: abitudine (jeden Morgen)", en:"present passive: habit (jeden Morgen)"} },
  { q:"Er ___ reich, wenn er mehr arbeitete.", opts:["wurde","würde","wird"], a:"würde",
    why:{it:"ipotesi con wenn → Konjunktiv II", en:"hypothesis with wenn → Konjunktiv II"} },
  { q:"Sie ___ letztes Jahr Mutter.", opts:["wurde","würde","wird"], a:"wurde",
    why:{it:"fatto reale (letztes Jahr) → Präteritum", en:"real fact (letztes Jahr) → Präteritum"} },
  { q:"Wir ___ nächstes Jahr bestimmt nach Spanien fliegen.", opts:["wurden","würden","werden"], a:"werden",
    why:{it:"piano certo (bestimmt) → Futur I", en:"certain plan (bestimmt) → Futur I"} },
  { q:"Die Berliner Mauer ___ 1989 geöffnet.", opts:["wurde","würde","wird"], a:"wurde",
    why:{it:"Passiv al passato (1989)", en:"past passive (1989)"} },
  { q:"___ Sie bitte das Fenster schließen?", opts:["Wurden","Würden","Werden"], a:"Würden",
    why:{it:"cortesia con Sie → Konjunktiv II", en:"politeness with Sie → Konjunktiv II"} }
];
/* colore per "anima": wurd- teal (fatto), ü prugna (ipotesi), il resto navy (presente/futuro) */
function wwOptClass(opt){
  if(opt.includes("ü") || opt.includes("Ü")) return "ww-plum";
  if(opt.toLowerCase().startsWith("wurd")) return "ww-teal";
  return "ww-navy";
}
function wwEntry(){
  return ENTRIES.find(e => e.type === "grammatica" && e.de.startsWith("wurde · würde · werden"));
}

let wwDeck = [], wwIdx = 0, wwOk = 0, wwAnswers = [], wwLock = false;

function openWwQuiz(){
  const items = WW_ITEMS.slice();
  for(let i = items.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  wwDeck = items.slice(0, 10);
  wwIdx = 0; wwOk = 0; wwAnswers = []; wwLock = false;
  document.getElementById("wwOverlay").classList.add("open");
  document.body.classList.add("conj-lock");
  renderWw();
}
function closeWwQuiz(){
  document.getElementById("wwOverlay").classList.remove("open");
  document.body.classList.remove("conj-lock");
  updateView();
}

function renderWw(){
  const s = UI_STRINGS[lang];
  const body = document.getElementById("wwBody");
  document.getElementById("wwTitle").textContent = s.wwTitle +
    (wwDeck.length && wwIdx < wwDeck.length ? ` · ${wwIdx + 1} / ${wwDeck.length}` : "");

  if(wwIdx >= wwDeck.length){
    const msg = wwOk === wwDeck.length ? s.wwPerfect : (wwOk >= wwDeck.length * 0.7 ? s.wwGood : s.wwMeh);
    body.innerHTML = `
      <div class="flash-done">
        <div class="flash-done-ic">${ic(wwOk === wwDeck.length ? "checkSeal" : "book")}</div>
        <h3>${s.cqDoneTitle}</h3>
        <p>${s.cqDoneMsg(wwOk, wwDeck.length)}<br>${msg}</p>
        <div class="flash-actions">
          <button type="button" class="conj-btn" id="wwRestart">${s.flashRestart}</button>
          <button type="button" class="flash-secondary" id="wwEnd">${s.flashCloseBtn}</button>
        </div>
      </div>`;
    document.getElementById("wwRestart").addEventListener("click", openWwQuiz);
    document.getElementById("wwEnd").addEventListener("click", closeWwQuiz);
    return;
  }

  const it = wwDeck[wwIdx];
  const chosen = wwAnswers[wwIdx];   // definito = domanda già risposta (revisione)

  body.innerHTML = `
    <div class="flash-progress"><div class="flash-progress-fill" style="width:${(wwIdx / wwDeck.length) * 100}%"></div></div>
    <div class="genus-question">
      <div class="ww-sentence">${it.q.replace("___", '<span class="ww-gap">___</span>')}</div>
      <div class="genus-hint">${s.wwPrompt}</div>
      <div class="genus-answer" id="wwAnswer"></div>
    </div>
    <div class="genus-btns" id="wwBtns">
      ${it.opts.map(o => `<button type="button" class="genus-opt ww-opt ${wwOptClass(o)}" data-a="${o}">${o}</button>`).join("")}
    </div>
    <div class="genus-nav" id="wwNav">
      ${wwIdx > 0 ? `<button type="button" class="flash-secondary ww-back">${s.quizBack}</button>` : ""}
    </div>`;

  if(chosen){
    body.querySelectorAll(".ww-opt").forEach(o => {
      if(o.dataset.a === it.a) o.classList.add("right");
      else if(o.dataset.a === chosen) o.classList.add("wrong");
      o.disabled = true;
    });
    const ans = document.getElementById("wwAnswer");
    /* Il pulsante legge la frase completata, senza partire da solo. */
    ans.innerHTML = `<b>${it.q.replace("___", it.a)}</b>${speakBtnHtml(it.q.replace("___", it.a), "quiz-speak")}` +
      `<br><span class="ww-why">${it.why[lang === "en" ? "en" : "it"]}</span>`;
    ans.classList.add("show");
    bindSpeakBtns(ans);
    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "conj-btn genus-next";
    nextBtn.textContent = s.cqNext;
    nextBtn.addEventListener("click", () => { wwIdx++; wwLock = false; renderWw(); });
    document.getElementById("wwNav").appendChild(nextBtn);
  } else {
    body.querySelectorAll(".ww-opt").forEach(b => {
      b.addEventListener("click", () => {
        if(wwLock) return;
        wwLock = true;
        const right = b.dataset.a === it.a;
        if(right){ wwOk++; bumpStreak(); awardXp(XP_MED); }
        else {
          const g = wwEntry();
          if(g) srsAnswer(g.id, false);   // errore → la voce Appendice va in ripasso
        }
        wwAnswers[wwIdx] = b.dataset.a;
        wwLock = false;
        renderWw();   // ri-renderizza in stato "risposto": soluzione + perché + Avanti
      });
    });
  }
  const backBtn = body.querySelector(".ww-back");
  if(backBtn) backBtn.addEventListener("click", () => { wwLock = false; wwIdx--; renderWw(); });
}

/* ---------- QUIZ dürfen · können (Appendice del Bignami, p. 45) ----------
   Stesso pattern del quiz wurde/würde: frase col buco, tre opzioni coniugate
   per la persona della frase, la soluzione spiega PERCHÉ (permesso o capacità).
   Colori: kann- navy (capacità), darf- teal (permesso), muss- prugna (obbligo). */

const DK_ITEMS = [
  { q:"Ich ___ nicht schwimmen, ich habe es nie gelernt.", opts:["kann","darf","muss"], a:"kann",
    why:{it:"capacità che manca (nie gelernt) → können", en:"missing ability (nie gelernt) → können"} },
  { q:"Hier ___ man nicht rauchen, es ist verboten.", opts:["kann","darf","muss"], a:"darf",
    why:{it:"divieto (verboten) → nicht dürfen", en:"ban (verboten) → nicht dürfen"} },
  { q:"___ ich das Fenster öffnen?", opts:["Kann","Darf","Muss"], a:"Darf",
    why:{it:"chiedo il permesso → dürfen", en:"asking permission → dürfen"} },
  { q:"Sie ___ sehr gut Klavier spielen.", opts:["kann","darf","muss"], a:"kann",
    why:{it:"abilità imparata (sehr gut) → können", en:"learned skill (sehr gut) → können"} },
  { q:"Kinder ___ diesen Film nicht sehen: ab 18 Jahren.", opts:["können","dürfen","müssen"], a:"dürfen",
    why:{it:"regola d'età → nicht dürfen (è vietato)", en:"age rule → nicht dürfen (forbidden)"} },
  { q:"Er ___ nicht Auto fahren, er hat keinen Führerschein.", opts:["kann","darf","muss"], a:"darf",
    why:{it:"manca la patente: è una regola → dürfen", en:"no licence: it is a rule → dürfen"} },
  { q:"Ich ___ das Wort nicht lesen, es ist zu klein.", opts:["kann","darf","muss"], a:"kann",
    why:{it:"le circostanze lo impediscono → können", en:"the circumstances prevent it → können"} },
  { q:"Du ___ nicht kommen, wenn du keine Zeit hast.", opts:["kannst","darfst","musst"], a:"musst",
    why:{it:"non è obbligatorio (≠ vietato) → nicht müssen", en:"not compulsory (not a ban) → nicht müssen"} },
  { q:"___ du mir bitte helfen?", opts:["Kannst","Darfst","Musst"], a:"Kannst",
    why:{it:"richiesta informale di aiuto → können", en:"informal request for help → können"} },
  { q:"Heute ___ ich früher gehen, mein Chef hat es erlaubt.", opts:["kann","darf","muss"], a:"darf",
    why:{it:"permesso concesso (erlaubt) → dürfen", en:"permission granted (erlaubt) → dürfen"} },
  { q:"Nach der Operation ___ er zwei Wochen nicht arbeiten.", opts:["kann","darf","will"], a:"darf",
    why:{it:"lo vieta il medico → dürfen", en:"the doctor forbids it → dürfen"} },
  { q:"Wir ___ heute nicht kommen: das Auto ist kaputt.", opts:["können","dürfen","müssen"], a:"können",
    why:{it:"impedimento pratico (Auto kaputt) → können", en:"practical obstacle (Auto kaputt) → können"} }
];
function dkOptClass(opt){
  const o = opt.toLowerCase();
  if(o.startsWith("darf")) return "ww-teal";
  if(o.startsWith("muss") || o.startsWith("müss")) return "ww-plum";
  return "ww-navy";
}
function dkEntry(){
  return ENTRIES.find(e => e.type === "grammatica" && e.de.startsWith("dürfen · können"));
}

let dkDeck = [], dkIdx = 0, dkOk = 0, dkAnswers = [], dkLock = false;

function openDkQuiz(){
  const items = DK_ITEMS.slice();
  for(let i = items.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  dkDeck = items.slice(0, 10);
  dkIdx = 0; dkOk = 0; dkAnswers = []; dkLock = false;
  document.getElementById("dkOverlay").classList.add("open");
  document.body.classList.add("conj-lock");
  renderDk();
}
function closeDkQuiz(){
  document.getElementById("dkOverlay").classList.remove("open");
  document.body.classList.remove("conj-lock");
  updateView();
}

function renderDk(){
  const s = UI_STRINGS[lang];
  const body = document.getElementById("dkBody");
  document.getElementById("dkTitle").textContent = s.dkTitle +
    (dkDeck.length && dkIdx < dkDeck.length ? ` · ${dkIdx + 1} / ${dkDeck.length}` : "");

  if(dkIdx >= dkDeck.length){
    const msg = dkOk === dkDeck.length ? s.dkPerfect : (dkOk >= dkDeck.length * 0.7 ? s.dkGood : s.dkMeh);
    body.innerHTML = `
      <div class="flash-done">
        <div class="flash-done-ic">${ic(dkOk === dkDeck.length ? "checkSeal" : "book")}</div>
        <h3>${s.cqDoneTitle}</h3>
        <p>${s.cqDoneMsg(dkOk, dkDeck.length)}<br>${msg}</p>
        <div class="flash-actions">
          <button type="button" class="conj-btn" id="dkRestart">${s.flashRestart}</button>
          <button type="button" class="flash-secondary" id="dkEnd">${s.flashCloseBtn}</button>
        </div>
      </div>`;
    document.getElementById("dkRestart").addEventListener("click", openDkQuiz);
    document.getElementById("dkEnd").addEventListener("click", closeDkQuiz);
    return;
  }

  const it = dkDeck[dkIdx];
  const chosen = dkAnswers[dkIdx];

  body.innerHTML = `
    <div class="flash-progress"><div class="flash-progress-fill" style="width:${(dkIdx / dkDeck.length) * 100}%"></div></div>
    <div class="genus-question">
      <div class="ww-sentence">${it.q.replace("___", '<span class="ww-gap">___</span>')}</div>
      <div class="genus-hint">${s.dkPrompt}</div>
      <div class="genus-answer" id="dkAnswer"></div>
    </div>
    <div class="genus-btns" id="dkBtns">
      ${it.opts.map(o => `<button type="button" class="genus-opt ww-opt ${dkOptClass(o)}" data-a="${o}">${o}</button>`).join("")}
    </div>
    <div class="genus-nav" id="dkNav">
      ${dkIdx > 0 ? `<button type="button" class="flash-secondary dk-back">${s.quizBack}</button>` : ""}
    </div>`;

  if(chosen){
    body.querySelectorAll(".ww-opt").forEach(o => {
      if(o.dataset.a === it.a) o.classList.add("right");
      else if(o.dataset.a === chosen) o.classList.add("wrong");
      o.disabled = true;
    });
    const ans = document.getElementById("dkAnswer");
    ans.innerHTML = `<b>${it.q.replace("___", it.a)}</b>${speakBtnHtml(it.q.replace("___", it.a), "quiz-speak")}` +
      `<br><span class="ww-why">${it.why[lang === "en" ? "en" : "it"]}</span>`;
    ans.classList.add("show");
    bindSpeakBtns(ans);
    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "conj-btn genus-next";
    nextBtn.textContent = s.cqNext;
    nextBtn.addEventListener("click", () => { dkIdx++; dkLock = false; renderDk(); });
    document.getElementById("dkNav").appendChild(nextBtn);
  } else {
    body.querySelectorAll(".ww-opt").forEach(b => {
      b.addEventListener("click", () => {
        if(dkLock) return;
        dkLock = true;
        const right = b.dataset.a === it.a;
        if(right){ dkOk++; bumpStreak(); awardXp(XP_MED); }
        else {
          const g = dkEntry();
          if(g) srsAnswer(g.id, false);
        }
        dkAnswers[dkIdx] = b.dataset.a;
        dkLock = false;
        renderDk();
      });
    });
  }
  const backBtn = body.querySelector(".dk-back");
  if(backBtn) backBtn.addEventListener("click", () => { dkLock = false; dkIdx--; renderDk(); });
}

document.getElementById("dkClose").addEventListener("click", closeDkQuiz);
document.getElementById("dkOverlay").addEventListener("click", (ev) => {
  if(ev.target.id === "dkOverlay") closeDkQuiz();
});
document.addEventListener("keydown", (ev) => {
  if(ev.key === "Escape" && document.getElementById("dkOverlay").classList.contains("open")) closeDkQuiz();
});

document.getElementById("wwClose").addEventListener("click", closeWwQuiz);
document.getElementById("wwOverlay").addEventListener("click", (ev) => {
  if(ev.target.id === "wwOverlay") closeWwQuiz();
});
document.addEventListener("keydown", (ev) => {
  if(ev.key === "Escape" && document.getElementById("wwOverlay").classList.contains("open")) closeWwQuiz();
});
