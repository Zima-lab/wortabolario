/* Wortabolario — js/coniugazione.js  (1/14)
   Motore di coniugazione: dall'infinito e dalle tre forme base (presente, Präteritum, Perfekt) costruisce tutti i tempi e modi.
   Tutti i file di js/ condividono le stesse variabili: l'ordine di caricamento è in index.html. */

/* ---------- MOTORE DI CONIUGAZIONE TEDESCA ----------
   Genera l'intero paradigma verbale (Indikativ, Konjunktiv, Imperativ, forme
   impersonali) a partire dai dati già presenti in VERBI (inf, pres, pra, perf),
   più una piccola tabella di metadati per gli ~20 verbi riflessivi/separabili/
   irregolari. Verificato riga per riga contro la tabella di flessione LEO. */

const PRON_AKK = ["mich","dich","sich","uns","euch","sich"];
const PRON_DAT = ["mir","dir","sich","uns","euch","sich"];
const CONJ_PERSONS = ["ich","du","er/sie/es","wir","ihr","sie"];

const VERB_META = {
  "sich waschen": { reflexive:"akk" },
  "sich anziehen": { reflexive:"akk" },
  "sich hinlegen": { reflexive:"akk" },
  "sich interessieren": { reflexive:"akk" },
  "sich aufregen": { reflexive:"akk" },
  "sich die Hände waschen": { reflexive:"dat" },
  "sich die Zähne putzen": { reflexive:"dat" },
  "sich etwas kaufen": { reflexive:"dat" }
};

function deUmlaut(s){ return s.replace(/ä/g,"a").replace(/ö/g,"o").replace(/ü/g,"u"); }
function umlaut(s){
  const idxAu = s.lastIndexOf("au");
  if (idxAu !== -1) return s.slice(0,idxAu) + "äu" + s.slice(idxAu+2);
  const idxA = s.lastIndexOf("a"), idxO = s.lastIndexOf("o"), idxU = s.lastIndexOf("u");
  const idx = Math.max(idxA, idxO, idxU);
  if (idx === -1) return s;
  const ch = s[idx];
  const rep = ch === "a" ? "ä" : ch === "o" ? "ö" : "ü";
  return s.slice(0,idx) + rep + s.slice(idx+1);
}
function deriveDuPresent(pres){
  if (pres.endsWith("et")) return pres.slice(0,-2) + "est";
  if (pres.endsWith("t")){
    const before = pres.slice(0,-1);
    if (/[sßz]$/.test(before)) return pres;
    return before + "st";
  }
  if (pres.endsWith("d")) return pres.slice(0,-1) + "st";
  if (/[sßz]$/.test(pres)) return pres + "t";
  return pres + "st";
}
function needsEpenthesis(stem){
  const last = stem[stem.length-1];
  const prev = stem[stem.length-2];
  if (last === "d" || last === "t") return true;
  if ((last === "n" || last === "m") && prev && /[bcdfgkpqtvwxz]/.test(prev)) return true;
  return false;
}
function ihrFromUnchangedStem(stem){ return stem + (needsEpenthesis(stem) ? "et" : "t"); }
function deriveDuPreteritum(pra){
  const last = pra[pra.length-1];
  if (last === "d" || last === "t") return pra + "est";
  if (last === "s" || last === "ß" || last === "z") return pra + "t";
  return pra + "st";
}
function deriveIhrPreteritum(pra){
  const last = pra[pra.length-1];
  if (last === "d" || last === "t") return pra + "et";
  return pra + "t";
}
function deriveWirSiePreteritum(pra){
  const last = pra[pra.length-1];
  return pra + (last === "e" ? "n" : "en");
}
function weakEndings(stem){ return [stem+"e", stem+"est", stem+"e", stem+"en", stem+"et", stem+"en"]; }
function stemExtractPres(pres){
  if (pres.endsWith("et")) return pres.slice(0,-2);
  if (pres.endsWith("t")) return pres.slice(0,-1);
  if (pres.endsWith("d")) return pres.slice(0,-1);
  return pres;
}

const K2_STEM_OVERRIDE = {
  bringen:"brächt", denken:"dächt", kennen:"kennt", wissen:"wüsst", rennen:"rennt",
  können:"könnt", müssen:"müsst", dürfen:"dürft", mögen:"möcht", helfen:"hülf",
  haben:"hätt", werden:"würd"
};
const IRREGULAR_PRESENT = {
  sein: ["bin","bist","ist","sind","seid","sind"],
  haben: ["habe","hast","hat","haben","habt","haben"],
  tun: ["tue","tust","tut","tun","tut","tun"]
};
const MODAL_LIKE = new Set(["können","müssen","wollen","sollen","dürfen","mögen","wissen"]);
const IMPERATIV_OVERRIDE = {
  sein: { du:"sei", ihr:"seid", wir:"seien wir" },
  haben: { du:"hab/habe", ihr:"habt", wir:"haben wir" },
  werden: { du:"werde", ihr:"werdet", wir:"werden wir" },
  tun: { du:"tu/tue", ihr:"tut", wir:"tun wir" },
  wissen: { du:"wisse", ihr:"wisst", wir:"wissen wir" },
  können:null, müssen:null, wollen:null, sollen:null, dürfen:null, mögen:null
};
const PARTIZIP1_OVERRIDE = {
  anfangen:"anfangend", anrufen:"anrufend", aufstehen:"aufstehend", einladen:"einladend",
  "sich anziehen":"sich anziehend", "sich hinlegen":"sich hinlegend",
  sein:"seiend", tun:"tuend"
};
const SEPARABLE_PREFIXES = new Set(["an","auf","ein","aus","mit","nach","vor","zu","weg","zurück",
  "ab","bei","her","hin","los","fest","statt","teil","wieder","zusammen","um","über","unter","durch","heim"]);

function buildParadigm(v, meta){
  meta = meta || {};
  const reflexive = meta.reflexive || null;
  const pronTable = reflexive === "dat" ? PRON_DAT : PRON_AKK;
  const isModal = MODAL_LIKE.has(v.inf);
  const irregularKey = IRREGULAR_PRESENT[v.inf] ? v.inf : null;

  const presClean = v.pres.includes(" / ") ? v.pres.split(" / ")[0] : v.pres;
  const presTokens = presClean.split(" ");
  const praTokens = v.pra.split(" ");
  const perfTokens = v.perf.split(" ");

  const coreErPres = presTokens[0];
  const restPres = presTokens.slice(1);
  const coreErPra = praTokens[0];
  const restPra = praTokens.slice(1);
  let auxWord = perfTokens[0];
  if (auxWord.includes("/")) auxWord = auxWord.split("/")[0];
  const participle = perfTokens[perfTokens.length-1];
  const restPerf = perfTokens.slice(1,-1);

  const infCore = v.inf.replace(/^sich\s+/, "");
  const infWords = infCore.split(" ");
  let lastInfWord = infWords[infWords.length-1];
  const nonSichRestPres = presTokens.slice(1).filter(t => t !== "sich");
  const candidatePrefix = nonSichRestPres[nonSichRestPres.length-1];
  if (candidatePrefix && SEPARABLE_PREFIXES.has(candidatePrefix) && lastInfWord.startsWith(candidatePrefix)) {
    lastInfWord = lastInfWord.slice(candidatePrefix.length);
  }
  const unchangedStemFull = lastInfWord.endsWith("en") ? lastInfWord.slice(0,-2) : lastInfWord.slice(0,-1);

  function substitute(tokens, personIdx){
    return tokens.map(t => t === "sich" ? pronTable[personIdx] : t).join(" ");
  }
  function attach(core, tokens, personIdx){
    const rest = substitute(tokens, personIdx);
    return rest ? core + " " + rest : core;
  }

  let coreFormsPres;
  if (irregularKey) {
    coreFormsPres = IRREGULAR_PRESENT[irregularKey];
  } else if (isModal) {
    const duPres = deriveDuPresent(coreErPres);
    const wirPres = unchangedStemFull + "en";
    coreFormsPres = [coreErPres, duPres, coreErPres, wirPres, ihrFromUnchangedStem(unchangedStemFull), wirPres];
  } else {
    const duPres = deriveDuPresent(coreErPres);
    const ichPres = unchangedStemFull + "e";
    const wirPres = unchangedStemFull + "en";
    coreFormsPres = [ichPres, duPres, coreErPres, wirPres, ihrFromUnchangedStem(unchangedStemFull), wirPres];
  }
  const praesens = coreFormsPres.map((f,i) => attach(f, restPres, i));

  const duPra = deriveDuPreteritum(coreErPra);
  const ihrPra = deriveIhrPreteritum(coreErPra);
  const wirSiePra = deriveWirSiePreteritum(coreErPra);
  const coreFormsPra = [coreErPra, duPra, coreErPra, wirSiePra, ihrPra, wirSiePra];
  const praeteritum = coreFormsPra.map((f,i) => attach(f, restPra, i));

  const auxPresForms = auxWord === "ist" ? IRREGULAR_PRESENT.sein : IRREGULAR_PRESENT.haben;
  const perfekt = auxPresForms.map((a,i) => [a, substitute(restPerf,i), participle].filter(Boolean).join(" "));
  const auxPraForms = auxWord === "ist"
    ? ["war","warst","war","waren","wart","waren"]
    : ["hatte","hattest","hatte","hatten","hattet","hatten"];
  const plusq = auxPraForms.map((a,i) => [a, substitute(restPerf,i), participle].filter(Boolean).join(" "));

  const werdenPres = ["werde","wirst","wird","werden","werdet","werden"];
  const futurI = werdenPres.map((w,i) => [w, reflexive?pronTable[i]:null, infCore].filter(Boolean).join(" "));
  const auxInfinitive = auxWord === "ist" ? "sein" : "haben";
  const futurII = werdenPres.map((w,i) => [w, substitute(restPerf,i), participle, auxInfinitive].filter(Boolean).join(" "));

  const k1Stem = v.inf === "sein" ? null : unchangedStemFull;
  const k1PresForms = v.inf === "sein" ? ["sei","seiest","sei","seien","seiet","seien"] : weakEndings(k1Stem);
  const konjIPraesens = k1PresForms.map((f,i) => attach(f, restPres, i));
  const auxK1 = auxWord === "ist" ? ["sei","seiest","sei","seien","seiet","seien"] : weakEndings("hab");
  const konjIPerfekt = auxK1.map((a,i) => [a, substitute(restPerf,i), participle].filter(Boolean).join(" "));

  let k2Stem;
  if (K2_STEM_OVERRIDE[v.inf]) k2Stem = K2_STEM_OVERRIDE[v.inf];
  else if (v.inf === "sein") k2Stem = null;
  else if (coreErPra.endsWith("te")) k2Stem = null;
  else k2Stem = umlaut(coreErPra);
  const k2CoreForms = k2Stem ? weakEndings(k2Stem) : (v.inf === "sein" ? weakEndings(umlaut(coreErPra)) : coreFormsPra);
  const konjIIPraeteritum = k2CoreForms.map((f,i) => attach(f, restPra, i));
  const auxK2 = auxWord === "ist" ? weakEndings("wär") : weakEndings("hätt");
  const konjIIPlusq = auxK2.map((a,i) => [a, substitute(restPerf,i), participle].filter(Boolean).join(" "));

  const werdenK1Forms = weakEndings("werd");
  const werdenK2Forms = weakEndings("würd");
  const konjFuturI = werdenK1Forms.map((w1,i) => {
    const combo = w1 + "/" + werdenK2Forms[i];
    return [combo, reflexive?pronTable[i]:null, infCore].filter(Boolean).join(" ");
  });
  const konjFuturII = werdenK1Forms.map((w1,i) => {
    const combo = w1 + "/" + werdenK2Forms[i];
    return [combo, substitute(restPerf,i), participle, auxInfinitive].filter(Boolean).join(" ");
  });

  let imperativ = null;
  if (IMPERATIV_OVERRIDE[v.inf] !== undefined) {
    const ov = IMPERATIV_OVERRIDE[v.inf];
    if (ov !== null) {
      imperativ = {
        du: attach(ov.du, restPres, 1),
        ihr: attach(ov.ihr, restPres, 4),
        wir: [ov.wir.split(" ")[0], "wir", substitute(restPres,3)].filter(Boolean).join(" "),
        Sie: [ov.wir.split(" ")[0], "Sie", substitute(restPres,5)].filter(Boolean).join(" ")
      };
    }
  } else if (!isModal) {
    const presStem = stemExtractPres(coreErPres);
    let duForms;
    const deUml = deUmlaut(presStem);
    if (deUml === unchangedStemFull && presStem !== unchangedStemFull) {
      duForms = [unchangedStemFull, unchangedStemFull+"e"];
    } else if (presStem !== unchangedStemFull) {
      duForms = [presStem];
    } else {
      if (needsEpenthesis(unchangedStemFull)) duForms = [unchangedStemFull+"e"];
      else duForms = [unchangedStemFull, unchangedStemFull+"e"];
    }
    const duRest = substitute(restPres, 1);
    const duStr = duForms.join("/") + (duRest ? " " + duRest : "");
    const ihrStr = attach(ihrFromUnchangedStem(unchangedStemFull), restPres, 4);
    const wirStr = [unchangedStemFull+"en", "wir", substitute(restPres,3)].filter(Boolean).join(" ");
    const sieStr = [unchangedStemFull+"en", "Sie", substitute(restPres,5)].filter(Boolean).join(" ");
    imperativ = { du: duStr, ihr: ihrStr, wir: wirStr, Sie: sieStr };
  }

  let partizipPraesens;
  if (PARTIZIP1_OVERRIDE[v.inf]) partizipPraesens = PARTIZIP1_OVERRIDE[v.inf];
  else if (reflexive) {
    const extra = restPres.filter(t => t !== "sich").join(" ");
    partizipPraesens = "sich " + (extra ? extra + " " : "") + unchangedStemFull + "end";
  } else {
    partizipPraesens = infCore + "d";
  }

  return {
    praesens, perfekt, praeteritum, plusq, futurI, futurII,
    konjIPraesens, konjIPerfekt, konjIIPraeteritum, konjIIPlusq, konjFuturI, konjFuturII,
    imperativ, partizipPraesens, partizipPerfekt: participle
  };
}
