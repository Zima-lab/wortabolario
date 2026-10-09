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
const D = CANDIDATI.find(p => require('fs').existsSync(p + 'data.js'));
if(!D){ console.error('Non trovo la cartella dell app. Percorsi provati:\n ' + CANDIDATI.join('\n ')); process.exit(1); }
console.log('cartella app: ' + D);
let pass=0, fail=0; const errs=[];
function ok(c,m){ if(c){pass++;} else {fail++; errs.push(m);} }

// ---------- A. CONTROLLI SUI DATI ----------
const dataSrc = fs.readFileSync(D+'data.js','utf8');
const appSrc  = fs.readFileSync(D+'app.js','utf8');
const verSrc  = fs.readFileSync(D+'version.js','utf8');
const exSrc   = fs.readFileSync(D+'esercizi.js','utf8');
function arr(n){ const m=dataSrc.match(new RegExp('const '+n+'\\s*=\\s*(\\[[\\s\\S]*?\\n\\]);')); return eval(m[1]); }
const VERBI=arr('VERBI'), SOST=arr('SOSTANTIVI'), AGG=arr('AGGETTIVI'), GRAM=arr('GRAMMATICA'), FRASI=arr('FRASI'), DETTI=arr('DETTI');

ok(GRAM.length===80, 'GRAMMATICA dovrebbe avere 80 schede, ne ha '+GRAM.length);
ok(verSrc.includes('"v38"'), 'version.js non e a v38');

// campi obbligatori e bilinguismo grammatica
GRAM.forEach(g=>{
  ['de','it','en','cat','rows','enRows','note','enNote','ex','enEx'].forEach(k=>ok(g[k]!==undefined && g[k]!=='', 'GRAM "'+g.de+'": campo '+k+' mancante'));
  ok(g.rows.length===g.enRows.length, 'GRAM "'+g.de+'": rows/enRows disallineati');
  ok(g.ex.length===g.enEx.length, 'GRAM "'+g.de+'": ex/enEx disallineati');
  g.ex.forEach((p,i)=>ok(p[0]===g.enEx[i][0], 'GRAM "'+g.de+'": frase tedesca diversa tra ex ed enEx ('+p[0]+')'));
  g.rows.forEach(r=>ok(Array.isArray(r)&&r.length===2&&r[0]&&r[1], 'GRAM "'+g.de+'": riga malformata'));
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
Object.entries(BIG).forEach(([k,p])=>ok(Number.isInteger(p)&&p>=1&&p<=49, 'BIGNAMI_PAGES: pagina fuori range per "'+k+'" ('+p+')'));
// BIGNAMI_B2_PAGES (dalla v33): chiavi esistenti, pagine 2-19, PDF in precache
const big2Src = appSrc.match(/const BIGNAMI_B2_PAGES = (\{[\s\S]*?\n\});/)[1];
const BIG2 = eval('('+big2Src+')');
Object.keys(BIG2).forEach(k=>ok(titoli.has(k), 'BIGNAMI_B2_PAGES: la chiave "'+k+'" non corrisponde a nessuna scheda'));
Object.entries(BIG2).forEach(([k,p])=>ok(Number.isInteger(p)&&p>=2&&p<=19, 'BIGNAMI_B2_PAGES: pagina fuori range per "'+k+'" ('+p+')'));
const swSrc2 = fs.readFileSync(path.join(__dirname,'sw.js'),'utf8');
ok(swSrc2.includes('Grammatica_Tedesca_B2_Bignami.pdf') && swSrc2.includes('German_Grammar_B2_Bignami_EN.pdf'), 'sw.js: PDF B2 non in precache');

// ---------- B. L APP IN JSDOM ----------
const html = fs.readFileSync(D+'index.html','utf8')
  .replace(/<script[^>]*src="[^"]*"[^>]*><\/script>/g,'');
const dom = new JSDOM(html, { runScripts:'dangerously', url:'https://example.org/' });
const w = dom.window;
w.HTMLMediaElement && (w.HTMLMediaElement.prototype.play = ()=>{});
w.scrollTo = ()=>{};
w.matchMedia = w.matchMedia || (q=>({matches:false, media:q, addEventListener(){}, removeEventListener(){}, addListener(){}, removeListener(){}}));
const s = w.document.createElement('script');
s.textContent = verSrc + '\n' + dataSrc + '\n' + exSrc + '\n' + appSrc + '\n' +
  'window.__test = { get ENTRIES(){return ENTRIES;}, get lang(){return lang;}, get EX(){return EX_TOPICS;}, get exData(){return exData;}, get exDeck(){return exDeck;}, get exIdx(){return exIdx;}, exNorm, exStatus, exDueItems };';
w.document.body.appendChild(s);
w.document.dispatchEvent(new w.Event('DOMContentLoaded',{bubbles:true}));

const T = w.__test;
ok(!!T && T.ENTRIES.length > 900, 'boot: ENTRIES non popolato ('+(T?T.ENTRIES.length:'nessun ponte')+')');
ok(T.ENTRIES.length === VERBI.length+SOST.length+AGG.length+GRAM.length+FRASI.length+DETTI.length, 'boot: conteggio ENTRIES incoerente');

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


// v37: scheda AP6 Preposizione vs Präpositionaladverb (Bignami p. 49)
res = cerca('Präpositionaladverb');
entry = apri(res,"Preposizione vs Präpositionaladverb — la differenza");
ok(!!entry, 'AP6: scheda non trovata cercando "Präpositionaladverb"');
ok(entry && entry.innerHTML.includes('#page=49'), 'AP6: manca il link alla pagina 49 del Bignami');
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
ok(exCount >= 70, 'esercizi: ne servono almeno 70, ce ne sono '+exCount);
['choice','order','gap','fix'].forEach(k => ok((TIPI[k]||0) >= 8, 'esercizi: pochi di tipo '+k));
ok(T.exNorm('Über') === T.exNorm('ueber') && T.exNorm('Straße') === T.exNorm('strasse'), 'exNorm: ae/oe/ue/ss non equivalgono a ä/ö/ü/ß');
ok(/<script src="esercizi.js">/.test(fs.readFileSync(D+'index.html','utf8')), 'index.html: manca esercizi.js');
ok(swSrc2.includes('"esercizi.js"'), 'sw.js: esercizi.js non in precache');
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

console.log('\nasserzioni: '+pass+' verdi, '+fail+' rosse');
if(fail){ console.log('\n--- problemi ---'); errs.slice(0,25).forEach(e=>console.log(' • '+e)); if(errs.length>25) console.log(' … e altri '+(errs.length-25)); process.exit(1); }
console.log('tutto verde');
