/* Wortabolario — js/icone-audio.js  (5/14)
   Icone SVG dell'interfaccia e pronuncia tedesca (speechSynthesis).
   Tutti i file di js/ condividono le stesse variabili: l'ordine di caricamento è in index.html. */

/* ---------- ICONE (stile SF Symbols) ----------
   Disegni a tratto su griglia 24×24, monocromi: ereditano il colore del testo
   con `currentColor`, quindi funzionano da soli in tema chiaro e scuro.
   Tratto 1.7 con terminali arrotondati, come le icone di sistema iOS. */

const ICONS = {
  home:    '<path d="M3.2 10.4 12 3.3l8.8 7.1"/><path d="M5.6 9.5V19a1.6 1.6 0 0 0 1.6 1.6h9.6A1.6 1.6 0 0 0 18.4 19V9.5"/><path d="M9.7 20.6v-5.2a1 1 0 0 1 1-1h2.6a1 1 0 0 1 1 1v5.2"/>',
  search:  '<circle cx="10.8" cy="10.8" r="6.6"/><path d="M15.6 15.6 20.8 20.8"/>',
  target:  '<circle cx="12" cy="12" r="8.4"/><circle cx="12" cy="12" r="4.3"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>',
  star:     '<path d="m12 3.9 2.55 5.17 5.7.83-4.13 4.02.98 5.68L12 16.92l-5.1 2.68.98-5.68L3.75 9.9l5.7-.83z"/>',
  starFill: '<path d="m12 3.9 2.55 5.17 5.7.83-4.13 4.02.98 5.68L12 16.92l-5.1 2.68.98-5.68L3.75 9.9l5.7-.83z" fill="currentColor"/>',
  clock:   '<circle cx="12" cy="12" r="8.4"/><path d="M12 7.1V12l3.1 1.9"/>',
  cards:   '<rect x="7.2" y="7.2" width="13.6" height="13.6" rx="3"/><path d="M17 4.2H6.2A2.9 2.9 0 0 0 3.3 7.1v10.6"/>',
  dice:    '<rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="8.6" cy="8.6" r="1.15" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.15" fill="currentColor" stroke="none"/><circle cx="15.4" cy="15.4" r="1.15" fill="currentColor" stroke="none"/>',
  pencil:  '<path d="M4.6 19.4h3.5L19 8.9a2.05 2.05 0 0 0-2.9-2.9L5.5 16.5z"/><path d="m14.7 7.7 2.9 2.9"/>',
  speaker: '<path d="M4.2 9.4h3.1L11.4 6v12L7.3 14.6H4.2z"/><path d="M14.9 9.7a3.9 3.9 0 0 1 0 4.6"/><path d="M17.5 7.4a7.4 7.4 0 0 1 0 9.2"/>',
  chevron: '<path d="M9.7 5.6 16 12l-6.3 6.4"/>',
  arrowUp: '<path d="M12 19.6V5.2"/><path d="M5.9 11.3 12 5.2l6.1 6.1"/>',
  close:   '<path d="m6.6 6.6 10.8 10.8"/><path d="M17.4 6.6 6.6 17.4"/>',
  sun:     '<circle cx="12" cy="12" r="4"/><path d="M12 2.9v2.2M12 18.9v2.2M21.1 12h-2.2M5.1 12H2.9M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6M18.4 18.4l-1.6-1.6M7.2 7.2 5.6 5.6"/>',
  moon:    '<path d="M20.3 14.7A8.6 8.6 0 1 1 9.3 3.7a6.9 6.9 0 0 0 11 11z"/>',
  export:  '<path d="M12 3.6v10.8"/><path d="M7.6 10 12 14.4 16.4 10"/><path d="M4.6 17.2v1.6a2 2 0 0 0 2 2h10.8a2 2 0 0 0 2-2v-1.6"/>',
  import:  '<path d="M12 14.4V3.6"/><path d="M7.6 8 12 3.6 16.4 8"/><path d="M4.6 17.2v1.6a2 2 0 0 0 2 2h10.8a2 2 0 0 0 2-2v-1.6"/>',
  flame:   '<path d="M12 2.9c.5 3-1 4.5-2.4 5.9-1.3 1.3-2.5 2.7-2.5 4.9a5.4 5.4 0 0 0 10.8 0c0-2.2-1-3.6-2-4.7-.2 1-.8 1.7-1.6 1.9.4-3.1-1.2-6.2-2.3-8z"/>',
  book:    '<path d="M12 7.2v12.3"/><path d="M12 7.2C10.4 5.9 8.4 5.2 6.1 5.2H4v12.3h2.1c2.3 0 4.3.7 5.9 2"/><path d="M12 7.2c1.6-1.3 3.6-2 5.9-2H20v12.3h-2.1c-2.3 0-4.3.7-5.9 2"/>',
  check:   '<path d="m5.4 12.4 4.4 4.4 8.8-9.6"/>',
  rotate:  '<path d="M3.8 12a8.2 8.2 0 1 0 2.6-6"/><path d="M3.4 4.4v4.2h4.2"/>',
  checkSeal: '<circle cx="12" cy="12" r="8.4"/><path d="m8.2 12.2 2.7 2.7 5-5.4"/>',
  exam:    '<rect x="5.2" y="4.6" width="13.6" height="16.2" rx="2.4"/><path d="M9.2 4.6V3.8a1 1 0 0 1 1-1h3.6a1 1 0 0 1 1 1v.8"/><path d="m8.8 12.6 2.2 2.2 4.4-4.6"/>',
  trophy:  '<path d="M7.5 4.2h9v3.9a4.5 4.5 0 0 1-9 0V4.2Z"/><path d="M7.5 5.5H4.8a2.6 2.6 0 0 0 2.6 3.4"/><path d="M16.5 5.5h2.7a2.6 2.6 0 0 1-2.6 3.4"/><path d="M12 12.6v2.9"/><path d="M9.2 19.5h5.6"/><path d="m10.3 16.3 3.4 0 .6 2.7h-4.6z"/>',
};

/** Restituisce l'SVG di un'icona. `cls` aggiunge classi CSS per la dimensione. */
function ic(name, cls){
  const p = ICONS[name];
  if(!p) return "";
  return `<svg class="ic ${cls || ""}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${p}</svg>`;
}

/** Riempie gli elementi statici marcati con data-icon (tab bar, chiusure, temi). */
function paintStaticIcons(){
  document.querySelectorAll("[data-icon]").forEach(el => {
    if(el.dataset.iconDone) return;
    el.innerHTML = ic(el.dataset.icon);
    el.dataset.iconDone = "1";
  });
}

/* ---------- AUDIO (pronuncia tedesca via speechSynthesis) ---------- */

const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;
function speak(text){
  if(!canSpeak) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "de-DE";
  u.rate = 0.95;
  const deVoice = window.speechSynthesis.getVoices().find(v => v.lang && v.lang.startsWith("de"));
  if(deVoice) u.voice = deVoice;
  window.speechSynthesis.speak(u);
}
function speakBtnHtml(text, cls){
  if(!canSpeak) return "";
  const aria = (UI_STRINGS[lang] || UI_STRINGS.it).speakAria;
  return `<button type="button" class="speak-btn ${cls || ""}" data-say="${text.replace(/"/g, "&quot;")}" aria-label="${aria}" title="${aria}">${ic("speaker")}</button>`;
}
function bindSpeakBtns(root){
  (root || document).querySelectorAll(".speak-btn").forEach(b => {
    if(b.dataset.bound) return;
    b.dataset.bound = "1";
    b.addEventListener("click", (ev) => { ev.stopPropagation(); speak(b.dataset.say); });
  });
}
