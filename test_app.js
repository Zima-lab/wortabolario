/* Test dell app Wortabolario (dalla v29 in poi).
   Sta nella stessa cartella dell app e non viene caricato da index.html:
   e solo un file di lavoro, il sito non lo usa.

   Come eseguirlo:  node test_app.js
   Serve jsdom. Se non e installato:  mkdir -p ~/testenv && cd ~/testenv && npm install jsdom
   (il test lo cerca da solo, sia qui che in ~/testenv).

   Copre: struttura dei dati, bilinguismo completo, reggenze di aggettivi e sostantivi,
   CAT_EN, BIGNAMI_PAGES senza orfani ne buchi, avvio dell app e ricerca nel DOM. */
const fs=require('fs'), path=require('path');
function caricaJsdom(){
  const posti = ["jsdom", process.env.HOME + "/testenv/node_modules/jsdom"];
  for(const p of posti){ try { return require(p); } catch(e){} }
  console.error("jsdom non trovato. Installalo con:  mkdir -p ~/testenv && cd ~/testenv && npm install jsdom");
  process.exit(1);
}
const { JSDOM } = caricaJsdom();
/* La cartella dell app. Prima prova il percorso attuale, poi quello vecchio,
   cosi il test continua a funzionare se la cartella viene spostata di nuovo. */
const CANDIDATI = [
  process.env.HOME + '/mnt/Corso Tedesco/Vocabolario App v3/',
  process.env.HOME + '/mnt/Corso Tedesco/Corso tedesco B1/Vocabolario App v3/',
  process.cwd() + '/'
];
const D = CANDIDATI.find(p => require('fs').existsSync(p + 'dati/grammatica.js'));
if(!D){ console.error('Non trovo la cartella dell app. Percorsi provati:\n ' + CANDIDATI.join('\n ')); process.exit(1); }
console.log('cartella app: ' + D);
let pass=0, fail=0; const errs=[];
function ok(c,m){ if(c){pass++;} else {fail++; errs.push(m);} }

// ---------- A. CONTROLLI SUI DATI ----------
/* v46: i file si leggono nell'ordine in cui li carica index.html
   (dati/… = vocabolario e grammatica · dati/esercizi.js = banca esercizi · js/… = logica) */
const SCRIPTS = [...fs.readFileSync(D+'index.html','utf8').matchAll(/<script src="([^"]+)"><\/script>/g)].map(m=>m[1]);
const leggi = list => list.map(f => fs.readFileSync(D+f,'utf8')).join('\n');
const dataSrc = leggi(SCRIPTS.filter(f => f.startsWith('dati/') && f !== 'dati/esercizi.js'));
const exSrc   = leggi(['dati/esercizi.js']);
const appSrc  = leggi(SCRIPTS.filter(f => f.startsWith('js/')));
const verSrc  = fs.readFileSync(D+'version.js','utf8');
ok(SCRIPTS[0] === 'version.js' && SCRIPTS[SCRIPTS.length-1] === 'js/avvio.js', 'index.html: version.js deve essere il primo script e js/avvio.js l ultimo');
function arr(n){ const m=dataSrc.match(new RegExp('const '+n+'\\s*=\\s*(\\[[\\s\\S]*?\\n\\]);')); return eval(m[1]); }
const VERBI=arr('VERBI'), AGG=arr('AGGETTIVI');
/* si eseguono tutti i file di dati insieme, come fa il browser */
const FULL = new Function(dataSrc + ';return {GRAMMATICA, FRASI, GRAM_TABLES, SOSTANTIVI, DETTI, VERBI};')();
const GRAM = FULL.GRAMMATICA, FRASI = FULL.FRASI, GTAB = FULL.GRAM_TABLES, SOST = FULL.SOSTANTIVI, DETTI = FULL.DETTI;

ok(GRAM.length===98, 'GRAMMATICA dovrebbe avere 98 schede, ne ha '+GRAM.length);
ok(verSrc.includes('"v49"'), 'version.js non e a v49');

// campi obbligatori e bilinguismo grammatica
GRAM.forEach(g=>{
  ['de','it','en','cat','rows','enRows','note','enNote','ex','enEx'].forEach(k=>ok(g[k]!==undefined && g[k]!=='', 'GRAM "'+g.de+'": campo '+k+' mancante'));
  ok(g.rows.length===g.enRows.length, 'GRAM "'+g.de+'": rows/enRows disallineati');
  ok(g.ex.length===g.enEx.length, 'GRAM "'+g.de+'": ex/enEx disallineati');
  g.ex.forEach((p,i)=>ok(p[0]===g.enEx[i][0], 'GRAM "'+g.de+'": frase tedesca diversa tra ex ed enEx ('+p[0]+')'));
  /* v45: una riga e [titolo, "testo"] oppure [titolo, [[de, traduzione], ...], consiglio?] */
  const rigaOk = r => Array.isArray(r) && (r.length===2 || r.length===3) && r[0] &&
    (typeof r[1]==='string' ? r[1] : Array.isArray(r[1]) && r[1].length && r[1].every(x=>Array.isArray(x) && x[0]));
  g.rows.forEach(r=>ok(rigaOk(r), 'GRAM "'+g.de+'": riga malformata'));
  g.enRows.forEach(r=>ok(rigaOk(r), 'GRAM "'+g.de+'": riga EN malformata'));
  g.rows.forEach((r,i)=>{ if(Array.isArray(r[1])) r[1].forEach((x,j)=>ok(g.enRows[i][1][j] && g.enRows[i][1][j][0]===x[0], 'GRAM "'+g.de+'": esempio tedesco diverso tra IT ed EN ('+x[0]+')')); });
  [...g.rows,...g.enRows].forEach(r=>{ const t=JSON.stringify(r)+''; ok((t.match(/_/g)||[]).length%2===0, 'GRAM "'+g.de+'": _ sbilanciati in '+r[0]); ok((t.match(/\*/g)||[]).length%2===0, 'GRAM "'+g.de+'": * sbilanciati in '+r[0]); });
});

// duplicati
function dups(list,key){ const v=list.map(x=>x[key]); return v.filter((x,i)=>v.indexOf(x)!==i); }
ok(dups(GRAM,'de').length===0, 'GRAMMATICA: titoli duplicati '+dups(GRAM,'de'));
ok(dups(VERBI,'inf').length===0, 'VERBI: infiniti duplicati '+dups(VERBI,'inf'));
ok(dups(SOST,'de').length===0, 'SOSTANTIVI: duplicati '+dups(SOST,'de'));
ok(dups(AGG,'de').length===0, 'AGGETTIVI: duplicati '+dups(AGG,'de'));

// reggenze nuove
const aggPrep=AGG.filter(a=>a.prep), sostPrep=SOST.filter(s=>s.prep);
ok(aggPrep.length>=30, 'attesi almeno 30 aggettivi con reggenza, sono '+aggPrep.length);
ok(sostPrep.length>=65, 'attesi almeno 65 sostantivi con reggenza, sono '+sostPrep.length);
const casiRe=/(Akk\.|Dat\.|Gen\.|Nom\.)/;
aggPrep.forEach(a=>{
  ok(casiRe.test(a.prep), 'AGG "'+a.de+'": la reggenza non indica il caso ('+a.prep+')');
  ok(Array.isArray(a.ex)&&a.ex.length>0, 'AGG "'+a.de+'": manca la frase di esempio');
  ok(Array.isArray(a.enex)&&a.enex.length===a.ex.length, 'AGG "'+a.de+'": ex/enex disallineati');
  a.ex.forEach((p,i)=>ok(p[0]===a.enex[i][0], 'AGG "'+a.de+'": frase tedesca diversa tra ex ed enex'));
});
sostPrep.forEach(s=>{
  ok(casiRe.test(s.prep), 'SOST "'+s.de+'": la reggenza non indica il caso ('+s.prep+')');
  ok(Array.isArray(s.ex)&&s.ex.length>0, 'SOST "'+s.de+'": manca la frase di esempio');
  s.ex.forEach((p,i)=>ok(p[0]===s.enex[i][0], 'SOST "'+s.de+'": frase tedesca diversa tra ex ed enex'));
});
// articolo e plurale sui sostantivi nuovi
SOST.forEach(s=>{
  ok(/^(der|die|das)(\/(der|die|das))? /.test(s.de), 'SOST "'+s.de+'": manca l articolo iniziale');
  ok(!!s.pl, 'SOST "'+s.de+'": manca il plurale');
});

// CAT_EN copre tutte le categorie
const catEn = eval('('+appSrc.match(/const CAT_EN = (\{[\s\S]*?\n\});/)[1]+')');
const cats = new Set([...VERBI,...SOST,...AGG,...GRAM].map(x=>x.cat));
[...cats].forEach(c=>ok(catEn[c], 'CAT_EN: manca la traduzione della categoria "'+c+'"'));

// BIGNAMI_PAGES: niente orfani, niente buchi
const bigSrc = appSrc.match(/const BIGNAMI_PAGES = (\{[\s\S]*?\n\});/)[1];
const BIG = eval('('+bigSrc+')');
const titoli = new Set(GRAM.map(g=>g.de));
Object.keys(BIG).forEach(k=>ok(titoli.has(k), 'BIGNAMI_PAGES: la chiave "'+k+'" non corrisponde a nessuna scheda'));
GRAM.forEach(g=>ok(BIG[g.de]!==undefined, 'BIGNAMI_PAGES: la scheda "'+g.de+'" non ha una pagina'));
Object.entries(BIG).forEach(([k,p])=>ok(Number.isInteger(p)&&p>=1&&p<=54, 'BIGNAMI_PAGES: pagina fuori range per "'+k+'" ('+p+')'));
// BIGNAMI_B2_PAGES (dalla v33): chiavi esistenti, pagine 2-19, PDF in precache
const big2Src = appSrc.match(/const BIGNAMI_B2_PAGES = (\{[\s\S]*?\n\});/)[1];
const BIG2 = eval('('+big2Src+')');
Object.keys(BIG2).forEach(k=>ok(titoli.has(k), 'BIGNAMI_B2_PAGES: la chiave "'+k+'" non corrisponde a nessuna scheda'));
Object.entries(BIG2).forEach(([k,p])=>ok(Number.isInteger(p)&&p>=2&&p<=25, 'BIGNAMI_B2_PAGES: pagina fuori range per "'+k+'" ('+p+')'));
const swSrc2 = fs.readFileSync(path.join(__dirname,'sw.js'),'utf8');
ok(swSrc2.includes('Grammatica_Tedesca_B2_Bignami.pdf') && swSrc2.includes('German_Grammar_B2_Bignami_EN.pdf'), 'sw.js: PDF B2 non in precache');

// ---------- v39: TABELLE CASI × GENERE ----------
Object.entries(GTAB).forEach(([k,v])=>{
  const g = GRAM.find(x=>x.de===k);
  ok(!!g, 'GRAM_TABLES: la chiave "'+k+'" non corrisponde a nessuna scheda');
  ok(Array.isArray(v.tables) && v.tables.length>0, 'GRAM_TABLES "'+k+'": nessuna tabella');
  /* v46: le tabelle contengono solo le tabelle; righe e nota stanno nella scheda */
  ok(Object.keys(v).join()==='tables', 'GRAM_TABLES "'+k+'": deve contenere solo tables (trovato '+Object.keys(v).join()+')');
  v.tables.forEach(t=>{
    ok(t.cols.every(c=>['m','f','n','pl','x'].includes(c[0])), 'GRAM_TABLES "'+k+'": colore di colonna sconosciuto');
    t.rows.forEach(r=>ok(r.length===t.cols.length+1, 'GRAM_TABLES "'+k+'": riga di lunghezza sbagliata ('+JSON.stringify(r[0])+')'));
    t.rows.forEach(r=>r.slice(1).forEach(c=>ok((c.match(/\{/g)||[]).length===(c.match(/\}/g)||[]).length, 'GRAM_TABLES "'+k+'": graffe sbilanciate in '+c)));
  });
});
// le tabelle di declinazione principali hanno le colonne nell ordine der · die · das · Plural
['Der/die/das — Artikel nach Kasus','Relativpronomen','Possessivpronomen','Indefinitpronomen','Adjektive ohne Artikel — Nullartikel'].forEach(k=>{
  const c = GTAB[k] && GTAB[k].tables[0].cols.map(x=>x[0]).join(',');
  ok(c==='m,f,n,pl', 'ordine colonne non m,f,n,pl in "'+k+'": '+c);
  ok(GTAB[k] && GTAB[k].tables[0].rows[0][0]==='Nominativ', 'la prima riga non e il Nominativ in "'+k+'"');
});
['Das Perfekt — haben oder sein?','Modalverben — Präsens und Präteritum','als / wenn / wann','Zahlen und Ordnungszahlen','Das Wetter — es regnet, es ist kalt','der, die oder das? — il genere del nome','Präpositionen — Akkusativ, Dativ oder Wechsel?','Präposition + Artikel — am, im, ins, zum, zur','ein / kein — Artikel nach Kasus']
  .forEach(k=>ok(GRAM.some(g=>g.de===k), 'v39: manca la scheda "'+k+'"'));
ok(FRASI.some(f=>f[0]==='Es regnet.'), 'v39: mancano le frasi del meteo');
// v39, 2° blocco (materiale «tabelle tedesco»)
['Der Plural — come si forma il plurale','W-Fragen — wo, wohin, woher · hin und her','Weitere Konjunktionen — falls, indem, solange, sodass','Die Zeichensetzung — Punkt, Ausrufezeichen, Doppelpunkt','Konjunktiv I — die indirekte Rede']
  .forEach(k=>ok(GRAM.some(g=>g.de===k), 'v39b: manca la scheda "'+k+'"'));
ok(SOST.filter(x=>x.cat==='meteo').length>=30, 'v39b: servono almeno 30 nomi del meteo');
ok(['der Nebel','das Gymnasium','das Fernweh','der Handschuh'].every(d=>SOST.some(x=>x.de===d)), 'v39b: mancano nomi nuovi (Nebel, Gymnasium, Fernweh, Handschuh)');
ok(SOST.filter(x=>x.cat==='meteo'||x.cat==='scuola').filter(x=>x.note).every(x=>x.enNote), 'v39b: nota IT senza nota EN in un sostantivo');
ok(FRASI.some(f=>f[0]==='Mit freundlichen Grüßen') && FRASI.some(f=>f[0]==='Das ist mir Wurst.'), 'v39b: mancano le frasi (lettere formali / modi di dire)');
ok(GTAB['Personalpronomen nei casi'].tables[0].rows.length===5, 'v39b: la tabella dei pronomi personali deve avere anche Reflexiv e Possessiv');

// ---------- B. L APP IN JSDOM ----------
const html = fs.readFileSync(D+'index.html','utf8')
  .replace(/<script[^>]*src="[^"]*"[^>]*><\/script>/g,'');
const dom = new JSDOM(html, { runScripts:'dangerously', url:'https://example.org/' });
const w = dom.window;
w.HTMLMediaElement && (w.HTMLMediaElement.prototype.play = ()=>{});
w.scrollTo = ()=>{};
w.requestAnimationFrame = w.requestAnimationFrame || (f => setTimeout(f, 0));   // jsdom non lo ha: serve al messaggio XP dei traguardi
w.matchMedia = w.matchMedia || (q=>({matches:false, media:q, addEventListener(){}, removeEventListener(){}, addListener(){}, removeListener(){}}));
const s = w.document.createElement('script');
s.textContent = verSrc + '\n' + dataSrc + '\n' + exSrc + '\n' + appSrc + '\n' +
  'window.__test = { get ENTRIES(){return ENTRIES;}, get lang(){return lang;}, get EX(){return EX_TOPICS;}, get exData(){return exData;}, get exDeck(){return exDeck;}, get exIdx(){return exIdx;}, exNorm, exStatus, exDueItems, exOpenOverlay, exStartTopic, get tl(){return tl;}, tlClock, get TLD(){return TLD;}, TL_TESTS };';
w.document.body.appendChild(s);
w.document.dispatchEvent(new w.Event('DOMContentLoaded',{bubbles:true}));

const T = w.__test;
ok(!!T && T.ENTRIES.length > 900, 'boot: ENTRIES non popolato ('+(T?T.ENTRIES.length:'nessun ponte')+')');
/* dalla v42 anche VERBI riceve voci con push: si conta l'array completo */
ok(T.ENTRIES.length === FULL.VERBI.length+SOST.length+AGG.length+GRAM.length+FRASI.length+DETTI.length, 'boot: conteggio ENTRIES incoerente');

// vai sulla tab Cerca
const tabCerca = w.document.querySelector('.tab[data-tab="cerca"]');
ok(!!tabCerca, 'tab Cerca non trovata');
tabCerca.dispatchEvent(new w.Event('click',{bubbles:true}));

function cerca(q){
  const inp = w.document.getElementById('search');
  inp.value = q;
  inp.dispatchEvent(new w.Event('input',{bubbles:true}));
  return w.document.getElementById('results');
}
function apri(res, de){
  const entries=[...res.querySelectorAll(".entry")];
  const t=entries.find(e=>{const d=e.querySelector(".de"); return d && d.textContent.trim().replace(/\s+/g," ")===de;});
  if(t) t.querySelector(".entry-head").dispatchEvent(new w.Event("click",{bubbles:true}));
  return t;
}

// aggettivo con reggenza
let res = cerca('stolz');
ok(res.textContent.includes('stolz'), 'ricerca: "stolz" non trovato');
let entry = apri(res,"stolz");
ok(entry && entry.textContent.includes('Preposizione'), 'scheda stolz: manca l etichetta Preposizione');
ok(entry && entry.textContent.includes('auf + Akk.'), 'scheda stolz: manca la reggenza auf + Akk.');
ok(entry && entry.textContent.includes('Meine Großmutter'), 'scheda stolz: manca la frase di esempio');

// sostantivo con reggenza
res = cerca('Sehnsucht');
entry = apri(res,"die Sehnsucht");
ok(entry && entry.textContent.includes('Preposizione'), 'scheda Sehnsucht: manca l etichetta Preposizione');
ok(entry && entry.textContent.includes('nach + Dat.'), 'scheda Sehnsucht: manca la reggenza nach + Dat.');
ok(entry && entry.textContent.includes('die Sehnsüchte'), 'scheda Sehnsucht: manca il plurale');

// aggettivo senza reggenza: la riga non deve comparire
res = cerca('schnell');
entry = apri(res,"schnell");
ok(entry && !entry.textContent.includes('Preposizione'), 'scheda schnell: mostra Preposizione anche senza reggenza');

// schede di grammatica nuove
const nuove = ['Das Wort es — le sue funzioni','Trennbare und untrennbare Vorsilben','Perfekt mit doppeltem Infinitiv','Das Verb lassen — vier Bedeutungen','Vermutungen mit Modalverben — die Sicherheitsskala','Indirekte Fragen — ob und W-Wörter','Negationswörter — nicht, kein, nichts, niemand','je …, desto / umso — und Vergleiche','ohne … zu und (an)statt … zu','Zweiteilige und nachgestellte Präpositionen','Adjektive mit Präpositionen','Nomen mit Präpositionen','Nomen-Verb-Verbindungen'];
nuove.forEach(t=>{
  const r = cerca(t.split(' ')[0]);
  ok(r.textContent.length>0, 'ricerca a vuoto per "'+t+'"');
});
// contenuti ampliati
res = cerca('Passiv');
ok(res.textContent.includes('Das Passiv'), 'ricerca: scheda Das Passiv non trovata');
entry = apri(res,"Das Passiv");
ok(entry && entry.textContent.includes('worden'), 'scheda Passiv: manca il Perfekt con worden');
ok(entry && entry.textContent.includes('durch'), 'scheda Passiv: manca von/durch');


// v37: scheda Preposizione vs Präpositionaladverb (dalla v39 Bignami p. 17, sezione B3)
res = cerca('Präpositionaladverb');
entry = apri(res,"Preposizione vs Präpositionaladverb — la differenza");
ok(!!entry, 'AP6: scheda non trovata cercando "Präpositionaladverb"');
ok(entry && entry.innerHTML.includes('#page=18'), 'AP6: manca il link alla pagina 18 del Bignami');
ok(entry && entry.textContent.includes('darauf'), 'AP6: contenuto mancante (darauf)');
ok(entry && entry.innerHTML.includes('Grammatica_Tedesca_B1_Bignami.pdf'), 'AP6: il link non punta al Bignami B1');


// ---------- v38: ESERCIZI DI GRAMMATICA ----------
const EXT = T.EX;
ok(Array.isArray(EXT) && EXT.length >= 8, 'esercizi: servono almeno 8 argomenti');
const exIds = new Set(); let exCount = 0;
const TIPI = {};
EXT.forEach(t => {
  ok(t.id && t.it && t.en && t.cards && t.cards.length, 'esercizi: argomento incompleto '+t.id);
  t.cards.forEach(c => ok(GRAM.some(g=>g.de===c), 'esercizi "'+t.id+'": la scheda "'+c+'" non esiste in GRAMMATICA'));
  ok(t.cards.every(c => BIG[c] !== undefined || BIG2[c] !== undefined), 'esercizi "'+t.id+'": scheda senza pagina del Bignami');
  ok(t.items.length >= 8, 'esercizi "'+t.id+'": servono almeno 8 esercizi');
  t.items.forEach(it => {
    exCount++; TIPI[it.t] = (TIPI[it.t]||0)+1;
    ok(!exIds.has(it.id), 'esercizi: id duplicato '+it.id); exIds.add(it.id);
    ok(it.why && it.why.it && it.why.en, 'esercizio '+it.id+': spiegazione IT/EN mancante');
    ok(['choice','order','gap','fix'].includes(it.t), 'esercizio '+it.id+': tipo sconosciuto');
    if(it.t==='choice'){
      ok(it.opts.length>=2 && it.opts.length<=4 && it.opts.includes(it.a), 'choice '+it.id+': risposta non tra le opzioni');
      ok(new Set(it.opts).size===it.opts.length, 'choice '+it.id+': opzioni duplicate');
    }
    if(it.t==='order'){
      ok(it.a.length>=3 && typeof it.pre==='string' && typeof it.post==='string', 'order '+it.id+': dati incompleti');
    }
    if(it.t==='gap'){ ok(!!it.hint && it.q.includes('___') && !!it.a, 'gap '+it.id+': dati incompleti'); }
    if(it.t==='fix'){
      const n = it.q.split(' ').length;
      ok(it.bad.length>0 && it.bad.every(i=>i>=0&&i<n), 'fix '+it.id+': indice fuori dalla frase');
      ok(it.fix && it.fix!==it.q, 'fix '+it.id+': frase corretta mancante o uguale');
    }
  });
});
ok(EXT.some(t=>t.id==='finali' && t.items.length>=12), 'esercizi: manca l argomento um…zu / damit (finali)');
// v40: esercizi d'esame telc, raggruppati nella sezione TELC
['telc_sb','telc_brief','telc_sprechen'].forEach(id => {
  const t = EXT.find(x => x.id === id);
  ok(t && t.sec === 'TELC' && t.items.length >= 15, 'telc: manca o incompleto l argomento '+id);
});
ok(appSrc.includes('TELC:{ it: "Esame telc B1 · B2"'), 'telc: manca l etichetta di sezione TELC');
ok(exCount >= 70, 'esercizi: ne servono almeno 70, ce ne sono '+exCount);
['choice','order','gap','fix'].forEach(k => ok((TIPI[k]||0) >= 8, 'esercizi: pochi di tipo '+k));
ok(T.exNorm('Über') === T.exNorm('ueber') && T.exNorm('Straße') === T.exNorm('strasse'), 'exNorm: ae/oe/ue/ss non equivalgono a ä/ö/ü/ß');
ok(SCRIPTS.includes('dati/esercizi.js'), 'index.html: manca dati/esercizi.js');
/* v46: ogni script caricato da index.html deve essere anche nella cache offline */
SCRIPTS.forEach(f => ok(swSrc2.includes('"'+f+'"'), 'sw.js: '+f+' non in precache'));
ok(!SCRIPTS.some(f => !fs.existsSync(D+f)), 'index.html: carica un file che non esiste');
ok(/wortabolario_ex"/.test(appSrc), 'BACKUP_KEYS: manca wortabolario_ex');
ok(!!w.document.getElementById('exOverlay'), 'index.html: manca exOverlay');

const $ = (id) => w.document.getElementById(id);
const click = (el) => el.dispatchEvent(new w.Event('click',{bubbles:true}));
// tab Esercizi -> scheda Grammatica
click(w.document.querySelector('.tab[data-tab="esercizi"]'));
ok(!!$('exGram'), 'tab Esercizi: manca la card Grammatica');
click($('exGram'));
ok($('exOverlay').classList.contains('open'), 'exGram: overlay non aperto');
ok($('exBody').querySelectorAll('.ex-topic').length === EXT.length, 'elenco: numero di argomenti sbagliato');
ok($('exBody').querySelectorAll('.gsec').length >= 3, 'elenco: mancano le barre di sezione');
// sessione: risolvo ogni tipo
const dnum = (re) => [...w.document.querySelectorAll('#exBody button')];
function giocaTopic(id){
  click($('exBody').querySelector('.ex-topic[data-t="'+id+'"]'));
  let guard = 0, risolti = 0;
  while(!$('exBody').querySelector('.flash-done') && guard++ < 60){
    const body = $('exBody');
    if(body.querySelector('#exNext')){ click(body.querySelector('#exNext')); continue; }
    // non so quale esercizio sia: leggo dal titolo (n / m) e dal DOM
    if(body.querySelector('.ex-opt')){ click(body.querySelector('.ex-opt')); risolti++; continue; }
    if(body.querySelector('.ex-tile')){
      const t = body.querySelector('#exBank .ex-tile'); if(t){ click(t); continue; }
      click($('exCheck')); risolti++; continue;
    }
    if(body.querySelector('#exInput')){ $('exInput').value = 'xyz'; $('exInput').dispatchEvent(new w.Event('input',{bubbles:true})); click($('exCheck')); risolti++; continue; }
    if(body.querySelector('.ex-word')){
      if(!body.querySelector('.ex-word.sel')){ click(body.querySelector('.ex-word')); continue; }
      click($('exCheck')); risolti++; continue;
    }
    break;
  }
  return risolti;
}
const nSolved = giocaTopic('dk');
ok(nSolved >= 8, 'sessione dk: troppo pochi esercizi risolti ('+nSolved+')');
ok($('exBody').querySelector('.flash-done'), 'sessione dk: non arriva alla schermata finale');
ok(Object.keys(T.exData).length >= 8, 'sessione dk: i progressi non sono stati salvati');
ok(w.localStorage.getItem('wortabolario_ex') && w.localStorage.getItem('wortabolario_ex').includes('dk0'), 'sessione dk: localStorage wortabolario_ex vuoto');
ok(T.exDueItems().length > 0, 'dopo risposte sbagliate devono esserci esercizi da ripassare');

// risposte giuste per tipo (apro i singoli esercizi in modo mirato)
function giusto(topicId, itemId){
  const topic = EXT.find(x=>x.id===topicId);
  const it = topic.items.find(x=>x.id===itemId);
  return it;
}
click($('exBody').querySelector('#exTopicsBtn'));
ok($('exBody').querySelector('#exReviewGo'), 'elenco: manca il pulsante Ripassa quando ci sono errori');
click($('exBody').querySelector('#exReviewGo'));
ok($('exBody').querySelector('.ex-instr'), 'ripasso: la sessione non parte');
click($('exClose'));
ok(!$('exOverlay').classList.contains('open'), 'exClose: overlay ancora aperto');

// la Home mostra il ripasso esercizi
click(w.document.querySelector('.tab[data-tab="home"]'));
ok(!!$('exDueBtn'), 'Home: manca il pulsante di ripasso esercizi');
click($('exDueBtn'));
ok($('exOverlay').classList.contains('open'), 'Home: il ripasso esercizi non si apre');
click($('exClose'));

// scheda con pulsante Esercizi
click(w.document.querySelector('.tab[data-tab="cerca"]'));
res = cerca('dürfen');
entry = apri(res, 'dürfen · können — le differenze');
ok(entry && entry.querySelector('.ex-entry-btn'), 'scheda dürfen · können: manca il pulsante Esercizi');
if(entry && entry.querySelector('.ex-entry-btn')){
  click(entry.querySelector('.ex-entry-btn'));
  ok($('exOverlay').classList.contains('open') && $('exBody').querySelector('.ex-instr'), 'pulsante Esercizi: la sessione non parte');
  click($('exClose'));
}

// risposte GIUSTE di ogni tipo: la spiegazione appare, l'esercizio sale di livello, danno XP
{
  w.localStorage.removeItem('wortabolario_ex');
  const xp0 = +(w.localStorage.getItem('wortabolario_xp')||0);
  const visti = new Set();
  let guard2 = 0;
  while(visti.size < 4 && guard2++ < 40){
    click($('exGram'));   // già nella tab esercizi? ricarico la tab
    break;
  }
  click(w.document.querySelector('.tab[data-tab="esercizi"]'));
  click($('exGram'));
  ['pronad','nebens','pos0','komma','dk','ww','gen','nde'].forEach(id => {
    if(visti.size >= 4) return;
    /* v42: gli argomenti hanno più di 10 esercizi, quindi un tipo può mancare dal mazzo:
       se la sessione precedente non è tornata all'elenco, lo riapro */
    if(!$('exBody').querySelector('.ex-topic[data-t="'+id+'"]')) w.openExPicker();
    click($('exBody').querySelector('.ex-topic[data-t="'+id+'"]'));
    for(let i=0;i<10;i++){
      const d = T.exDeck[T.exIdx]; if(!d) break;
      const it = d.item, body = $('exBody');
      if(!visti.has(it.t)){
        visti.add(it.t);
        if(it.t==='choice'){ click([...body.querySelectorAll('.ex-opt')].find(b=>b.textContent===it.a)); }
        if(it.t==='order'){ it.a.forEach((wd,k)=>{ const tile=[...body.querySelectorAll('#exBank .ex-tile')].find(b=>b.textContent===wd && !d.placed.includes(+b.dataset.i)); click(tile); }); click($('exCheck')); }
        if(it.t==='gap'){ $('exInput').value = it.a.replace('ü','ue').replace('ö','oe').replace('ä','ae'); $('exInput').dispatchEvent(new w.Event('input',{bubbles:true})); click($('exCheck')); }
        if(it.t==='fix'){ click(body.querySelectorAll('.ex-word')[it.bad[0]]); click($('exCheck')); }
        ok(d.res && d.res.ok, 'risposta giusta rifiutata: '+it.id+' ('+it.t+')');
        ok($('exBody').querySelector('.ex-fb-ok .ww-why'), 'manca la spiegazione dopo la risposta giusta: '+it.id);
        ok($('exBody').querySelector('.ex-fb .bignami-link'), 'manca il link al Bignami nella spiegazione: '+it.id);
        ok(T.exStatus(it.id)==='later', 'dopo una risposta giusta lo stato deve essere "later": '+it.id+' = '+T.exStatus(it.id));
      } else {
        // salto questo (risposta "non lo so" o clic su qualsiasi cosa)
        if(body.querySelector('#exSkip')) click($('exSkip')); else if(body.querySelector('.ex-opt')) click(body.querySelector('.ex-opt'));
      }
      if($('exBody').querySelector('#exNext')) click($('exBody').querySelector('#exNext'));
    }
  });
  ok(visti.size === 4, 'non ho visto tutti e 4 i tipi nei primi argomenti: '+[...visti]);
  ok(+(w.localStorage.getItem('wortabolario_xp')||0) > xp0, 'risposte giuste: nessun XP assegnato');
  click($('exClose'));
  const exp = JSON.parse(JSON.stringify(Object.keys(w.localStorage)));
  ok(exp.includes('wortabolario_ex'), 'localStorage: manca wortabolario_ex dopo le risposte');
}

// risposta giusta di tipo gap con ae/oe/ue
w.localStorage.removeItem('wortabolario_ex');
click(w.document.querySelector('.tab[data-tab="cerca"]'));

// cambio lingua -> etichetta inglese
const langBtn = w.document.getElementById('langToggle');
langBtn.dispatchEvent(new w.Event('click',{bubbles:true}));
res = cerca('stolz');
entry = apri(res,"stolz");
ok(T.lang==='en', 'cambio lingua non riuscito');
ok(entry && entry.textContent.includes('Preposition'), 'scheda stolz in inglese: manca l etichetta Preposition');
langBtn.dispatchEvent(new w.Event('click',{bubbles:true}));

// ---------- v39 nel DOM ----------
click(w.document.querySelector('.tab[data-tab="cerca"]'));
res = cerca('Artikel nach Kasus');
entry = apri(res, 'Der/die/das — Artikel nach Kasus');
ok(entry && entry.querySelector('table.gtable'), 'tabella: la scheda der/die/das non mostra la tabella');
if(entry && entry.querySelector('table.gtable')){
  const ths = [...entry.querySelectorAll('thead th')].map(x=>x.className);
  ok(ths.join(',')==='g-k,g-m,g-f,g-n,g-pl', 'tabella der/die/das: intestazioni/colori sbagliati '+ths);
  const righe = [...entry.querySelectorAll('tbody th')].map(x=>x.firstChild.textContent);
  ok(righe.join(',')==='Nominativ,Akkusativ,Dativ,Genitiv', 'tabella der/die/das: righe dei casi sbagliate '+righe);
  ok(entry.querySelector('tbody td.g-m b.hl') && entry.querySelector('tbody td.g-m b.hl').textContent==='den', 'tabella der/die/das: den non evidenziato');
  ok(entry.querySelector('tbody th .gq'), 'tabella der/die/das: manca la domanda Wer?/Wen?…');
  ok(!entry.textContent.includes('Maschile (der)'), 'scheda der/die/das: le vecchie righe di testo sono ancora visibili');
  ok(entry.innerHTML.includes('#page=3'), 'scheda der/die/das: link al Bignami non va a p.3');
}
res = cerca('Ihnen');
ok(res.textContent.includes('Personalpronomen nei casi'), 'ricerca: il testo delle tabelle non e cercabile (Ihnen)');
res = cerca('Modalverben');
entry = apri(res, 'Modalverben — Präsens und Präteritum');
ok(entry && entry.querySelectorAll('table.gtable').length===2, 'Modalverben: servono 2 tabelle');
ok(entry && entry.innerHTML.includes('#page=36'), 'Modalverben: link al Bignami non va a p.36');
res = cerca('Zahlen');
ok(res.textContent.includes('einundzwanzig'), 'Zahlen: scheda non trovata');
// quiz der/die/das: dopo la risposta compare la regola della desinenza (quando c'e)
click(w.document.querySelector('.tab[data-tab="esercizi"]'));
{
  const gbtn = [...w.document.querySelectorAll('button, .ex-card')].find(b=>/genus|der\/die\/das/i.test(b.id+' '+b.className+' '+b.textContent));
  ok(!!gbtn, 'quiz genus: pulsante non trovato');
  if(gbtn){
    click(gbtn);
    let visto = false;
    for(let i=0;i<15 && !visto;i++){
      const opt = w.document.querySelector('#genusBtns .genus-opt:not([disabled])');
      if(!opt) break;
      click(opt);
      if(w.document.querySelector('#genusAnswer .genus-rule')) visto = true;
      const nx = w.document.querySelector('#genusNav .genus-next'); if(nx) click(nx);
    }
    ok(visto, 'quiz genus: nessuna regola della desinenza mostrata in 15 parole');
    const cl = w.document.querySelector('#genusOverlay .conj-close'); if(cl) click(cl);
  }
}
// in inglese le etichette di riga cambiano
click(w.document.querySelector('.tab[data-tab="cerca"]'));
langBtn.dispatchEvent(new w.Event('click',{bubbles:true}));
res = cerca('Adjektivendungen im Genitiv');
entry = apri(res, 'Adjektivendungen im Genitiv');
ok(entry && entry.textContent.includes('definite article'), 'tabella in inglese: etichetta di riga non tradotta');
langBtn.dispatchEvent(new w.Event('click',{bubbles:true}));

// v44: esercizio "scrivi la parola" — campo con istruzione chiara, lettere speciali spiegate e inseribili
{
  T.exOpenOverlay(); T.exStartTopic('pronad', 999);
  let guard = 0, inp = null;
  while(guard++ < 80){
    inp = w.document.getElementById('exInput');
    if(inp) break;
    const sk = w.document.getElementById('exSkip');
    if(sk) click(sk); else { const o = w.document.querySelector('.ex-opt'); if(o) click(o); }
    const nx = w.document.getElementById('exNext'); if(nx) click(nx); else break;
  }
  ok(!!inp, 'gap: nessun esercizio da scrivere trovato in pronad');
  if(inp){
    const body = w.document.getElementById('exBody');
    ok(body.querySelector('.ex-instr').textContent.includes('Scrivi tu'), 'gap: istruzione non chiarita');
    ok(inp.placeholder.includes('Scrivi qui'), 'gap: placeholder mancante');
    ok(inp.closest('.ex-field') && inp.closest('.ex-field').querySelector('.ex-keys-box'), 'gap: tasti non dentro .ex-field');
    ok(body.querySelector('.ex-keys-label').textContent.includes('tastiera'), 'gap: etichetta lettere speciali mancante');
    ok(body.querySelector('.ex-keys-alt').textContent.includes('ae'), 'gap: nota ae/oe/ue/ss mancante');
    inp.value = 'f'; inp.dispatchEvent(new w.Event('input',{bubbles:true}));
    inp.setSelectionRange(1,1);
    const md = new w.MouseEvent('mousedown',{bubbles:true,cancelable:true});
    const kU = [...body.querySelectorAll('.ex-key')].find(k=>k.dataset.c==='ü');
    kU.dispatchEvent(md);
    ok(md.defaultPrevented, 'gap: mousedown sui tasti non bloccato (il campo perderebbe il focus)');
    click(kU);
    ok(w.document.getElementById('exInput').value === 'fü', 'gap: il tasto ü non inserisce la lettera');
    ok(T.exNorm('fuer') === T.exNorm('für') && T.exNorm('Strasse') === T.exNorm('Straße'), 'gap: ae/oe/ue/ss non equivalenti');
  }
  const cl = w.document.querySelector('#exOverlay .conj-close'); if(cl) click(cl);
}

// v48: simulatore d'esame telc B1 (dati/esame-b1.js + js/esame.js)
ok(T.TL_TESTS.length === 2 && new Set(T.TL_TESTS.map(t=>t.id)).size === 2, 'telc: servono 2 modelli con id diversi');
// i controlli sui dati valgono per OGNI modello
T.TL_TESTS.forEach(D1 => {
  const nums = [];
  ['lesen','hoeren'].forEach(m => D1[m].teile.forEach(t => {
    ok(t.items.length * t.perItem === t.points, 'telc '+t.id+': punti per item × item ≠ punti della parte');
    t.items.forEach(i => {
      nums.push(i.n);
      ok(i.src && i.src.length > 3, 'telc '+i.n+': manca la Textstelle (src)');
      const valid = t.type==='tf' ? ['r','f'] : (t.type==='mc'||t.type==='mcgap') ? ['a','b','c'] : t.options.map(o=>o[0]).concat(t.allowX?['x']:[]);
      ok(valid.includes(i.a), 'telc '+i.n+': soluzione non valida ('+i.a+')');
      if(t.type==='mc'||t.type==='mcgap') ok(i.opts.length===3, 'telc '+i.n+': servono 3 opzioni');
      if(t.type==='tf' && !t.audio) ok(Array.isArray(i.audio) && i.audio.length, 'telc '+i.n+': manca l audio');
    });
    if(t.type==='match'||t.type==='bank'){
      const used = t.items.map(i=>i.a).filter(a=>a!=='x');
      ok(new Set(used).size===used.length, 'telc '+t.id+': una lettera è usata due volte');
      ok(new Set(t.options.map(o=>o[0])).size===t.options.length, 'telc '+t.id+': lettere delle opzioni duplicate');
    }
    if(t.text && t.type!=='mc'){
      const g=[...t.text.matchAll(/\{(\d+)\}/g)].map(x=>+x[1]);
      ok(JSON.stringify(g)===JSON.stringify(t.items.map(i=>i.n)), 'telc '+t.id+': buchi nel testo ≠ item');
    }
  }));
  ok(JSON.stringify(nums)===JSON.stringify(Array.from({length:60},(_, k)=>k+1)), 'telc: la numerazione deve andare da 1 a 60 senza buchi');
  ok(D1.lesen.teile.reduce((n,t)=>n+t.points,0)===D1.lesen.max && D1.lesen.max===105, 'telc: Lesen+SB devono fare 105');
  ok(D1.hoeren.teile.reduce((n,t)=>n+t.points,0)===75, 'telc: Hören deve fare 75');
  ok(D1.sprechen.teile.reduce((n,t)=>n+t.points,0)===75, 'telc: Sprechen deve fare 75');
  ok(D1.schreiben.tasks.every(t=>t.points.length===4 && t.model), 'telc: ogni lettera ha 4 punti e un modello');
  ok(D1.schreiben.criteria && D1.sprechen.scales && D1.sprechen.teile.length===3, 'telc '+D1.id+': griglie mancanti');
});
// testi dei due modelli davvero diversi
ok(T.TL_TESTS[0].lesen.teile[1].text !== T.TL_TESTS[1].lesen.teile[1].text && T.TL_TESTS[0].hoeren.teile[1].audio !== T.TL_TESTS[1].hoeren.teile[1].audio, 'telc: il modello 2 ripete i testi del modello 1');
{
  const D1 = T.TL_TESTS[0];
  const sIt = w.eval('UI_STRINGS.it.tl'), sEn = w.eval('UI_STRINGS.en.tl');
  ok(Object.keys(sIt).sort().join()===Object.keys(sEn).sort().join(), 'telc: chiavi IT/EN dei testi diverse');

  const $ = id => w.document.getElementById(id);
  const tab = w.document.querySelector('.tabbar [data-tab="esercizi"]'); click(tab);
  ok(!!$('exTelc'), 'telc: manca la card nella tab Esercizi');
  click($('exTelc'));
  ok($('tlOverlay').classList.contains('open'), 'telc: il pannello non si apre');
  ok($('tlBody').querySelectorAll('[data-start]').length===5, 'telc: il menu deve avere 5 prove');

  // Lesen: tutte giuste → 105/105
  click($('tlBody').querySelector('[data-start="lesen"]'));
  T.tlClock();
  ok(/^(90|89):\d\d$/.test($('tlClock').textContent), 'telc: il timer di Lesen non parte da 90:00 ('+$('tlClock').textContent+')');
  D1.lesen.teile.forEach((t, k) => {
    click($('tlBody').querySelectorAll('[data-teil]')[k]);
    t.items.forEach(i => {
      const el = $('tlBody').querySelector('select[data-q="'+i.n+'"]') || $('tlBody').querySelector('input[data-q="'+i.n+'"][value="'+i.a+'"]');
      ok(!!el, 'telc: campo per la domanda '+i.n+' mancante');
      if(!el) return;
      if(el.tagName==='SELECT') el.value = i.a; else el.checked = true;
      el.dispatchEvent(new w.Event('change',{bubbles:true}));
    });
  });
  click($('tlBody').querySelectorAll('[data-teil]')[3]);
  ok($('tlg-24') && $('tlg-24').textContent==='an', 'telc: il buco 24 non mostra la parola scelta');
  click($('tlBody').querySelectorAll('[data-teil]')[4]);
  click($('tlSubmit'));
  ok($('tlSubmit') && $('tlSubmit').textContent.includes('di nuovo'), 'telc: la consegna non chiede conferma');
  click($('tlSubmit'));
  ok(T.tl.phase==='result' && T.tl.res.lesen.p===105, 'telc: tutte giuste dovrebbe fare 105, fa '+(T.tl.res.lesen && T.tl.res.lesen.p));
  ok($('tlBody').textContent.includes('105 / 105'), 'telc: risultato non mostrato');
  click($('tlMenu'));

  // Esame completo: Lesen vuoto, Hören a tempo scaduto, Schreiben valutato A/B/C → 27/225
  click($('tlBody').querySelector('[data-start="full"]'));
  click($('tlBody').querySelectorAll('[data-teil]')[4]); click($('tlSubmit')); click($('tlSubmit'));
  ok(T.tl.res.lesen.p===0, 'telc completo: Lesen vuoto dovrebbe fare 0');
  click($('tlNextMod'));
  ok(T.tl.mod==='hoeren', 'telc completo: dopo Lesen deve venire Hören');
  ok($('tlBody').textContent.includes('trascrizione') || $('tlBody').querySelector('[data-play]'), 'telc: Hören senza audio né trascrizione');
  T.tl.endAt = Date.now() - 1000; T.tlClock();
  ok(T.tl.phase==='result' && T.tl.timeUp, 'telc: a tempo scaduto la prova non viene consegnata');
  click($('tlNextMod'));
  ok(T.tl.mod==='schreiben', 'telc completo: dopo Hören deve venire Schreiben');
  click($('tlBody').querySelector('[data-task="A"]'));
  const ta = $('tlText'); ta.value = 'Lieber Paul, danke für deine Mail.'; ta.dispatchEvent(new w.Event('input',{bubbles:true}));
  ok($('tlWords').textContent.startsWith('6 '), 'telc: contatore parole sbagliato ('+$('tlWords').textContent+')');
  click($('tlSubmit')); click($('tlSubmit'));
  ok(T.tl.phase==='assess', 'telc: dopo la consegna della lettera manca la valutazione');
  click($('tlCalc'));
  ok(!$('tlCritMsg').hidden, 'telc: senza livelli deve chiedere di sceglierli');
  [['I','A'],['II','B'],['III','C']].forEach(([c,v]) => { const r=$('tlBody').querySelector('input[name="tlc'+c+'"][value="'+v+'"]'); r.checked=true; r.dispatchEvent(new w.Event('change',{bubbles:true})); });
  click($('tlCalc'));
  ok(T.tl.res.schreiben && T.tl.res.schreiben.p===27, 'telc: A+B+C dovrebbe fare 27');
  ok($('tlBody').querySelector('.tl-total') && $('tlBody').textContent.includes('27 / 225'), 'telc: manca il totale dello scritto');
  click($('tlMenu'));

  // Sprechen: Teil 1 tutto A (15), Teil 2 tutto B (6+6+6+4=22), Teil 3 tutto C (2+2+2+2=8) → 45 (soglia)
  click($('tlBody').querySelector('[data-start="sprechen"]'));
  click($('tlBody').querySelectorAll('[data-teil]')[2]); click($('tlCalc'));
  ok(!$('tlCritMsg').hidden, 'telc: Sprechen senza livelli deve chiedere di sceglierli');
  ['A','B','C'].forEach((v,k) => {
    click($('tlBody').querySelectorAll('[data-teil]')[k]);
    const rs = $('tlBody').querySelectorAll('.tl-abcd input[value="'+v+'"]');
    ok(rs.length===4, 'telc: ogni parte di Sprechen deve avere 4 criteri');
    rs.forEach(r => { r.checked=true; r.dispatchEvent(new w.Event('change',{bubbles:true})); });
  });
  click($('tlCalc'));
  ok(T.tl.res.sprechen && T.tl.res.sprechen.p===45, 'telc: Sprechen A/B/C dovrebbe fare 45, fa '+(T.tl.res.sprechen&&T.tl.res.sprechen.p));
  ok($('tlBody').textContent.includes('Superato'), 'telc: con 45/75 l orale è superato');
  ok(D1.sprechen.teile.every(x => D1.sprechen.criteria.reduce((n,c)=>n+D1.sprechen.scales[x.id][c.aussp?1:0][0],0)===x.points), 'telc: i punti massimi dei criteri non coincidono con i punti della parte');
  const hist = JSON.parse(w.localStorage.getItem('wortabolario_telc')||'[]');
  ok(hist.length===5, 'telc: lo storico dovrebbe avere 5 risultati, ne ha '+hist.length);
  click($('tlMenu'));
  ok($('tlBody').textContent.includes('ultimo: 45/75'), 'telc: il menu non mostra l ultimo punteggio');

  // Modelltest 2: si sceglie nel menu, tutte giuste → 105, storico separato dal modello 1
  click($('tlBody').querySelector('[data-test="1"]'));
  ok(T.TLD.id==='b1-2' && !$('tlBody').textContent.includes('ultimo: 45/75'), 'telc: il modello 2 non deve mostrare i punteggi del modello 1');
  click($('tlBody').querySelector('[data-start="lesen"]'));
  T.TL_TESTS[1].lesen.teile.forEach((t, k) => {
    click($('tlBody').querySelectorAll('[data-teil]')[k]);
    t.items.forEach(i => {
      const el = $('tlBody').querySelector('select[data-q="'+i.n+'"]') || $('tlBody').querySelector('input[data-q="'+i.n+'"][value="'+i.a+'"]');
      ok(!!el, 'telc M2: campo per la domanda '+i.n+' mancante');
      if(!el) return;
      if(el.tagName==='SELECT') el.value = i.a; else el.checked = true;
      el.dispatchEvent(new w.Event('change',{bubbles:true}));
    });
  });
  ok($('tlBody').textContent.includes('Sprachcafé'), 'telc M2: Sprachbausteine 2 non mostra il testo del modello 2');
  click($('tlSubmit')); click($('tlSubmit'));
  ok(T.tl.res.lesen.p===105, 'telc M2: tutte giuste dovrebbe fare 105, fa '+T.tl.res.lesen.p);
  click($('tlMenu'));
  ok($('tlBody').textContent.includes('ultimo: 105/105'), 'telc M2: il menu non mostra l ultimo punteggio del modello 2');
  ok(w.localStorage.getItem('wortabolario_telc_m')==='b1-2', 'telc: la scelta del modello non viene ricordata');
  click($('tlBody').querySelector('[data-test="0"]'));
  ok($('tlBody').textContent.includes('ultimo: 45/75'), 'telc: tornando al modello 1 manca il suo storico');

  // uscita in due tocchi
  click($('tlBody').querySelector('[data-start="hoeren"]'));
  click($('tlQuit')); ok(T.tl!==null, 'telc: il primo tocco su Esci non deve chiudere la prova');
  click($('tlQuit')); ok(T.tl===null && $('tlBody').querySelectorAll('[data-start]').length===5, 'telc: Esci non torna al menu');
  click(w.document.getElementById('tlClose'));
  ok(!$('tlOverlay').classList.contains('open'), 'telc: il pannello non si chiude');
}

console.log('\nasserzioni: '+pass+' verdi, '+fail+' rosse');
if(fail){ console.log('\n--- problemi ---'); errs.slice(0,25).forEach(e=>console.log(' • '+e)); if(errs.length>25) console.log(' … e altri '+(errs.length-25)); process.exit(1); }
console.log('tutto verde');
