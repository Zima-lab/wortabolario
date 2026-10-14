/* Wortabolario — js/avvio.js  (14/14)
   Pannello Traguardi, pulsante "torna su" e avvio dell'app. Va caricato per ULTIMO.
   Tutti i file di js/ condividono le stesse variabili: l'ordine di caricamento è in index.html. */

/* ---------- PANNELLO "TRAGUARDI" (XP, trofei, messaggi) ---------- */

function xpNextTrophyInfo(){
  const remain = XP_TROPHY_STEP - (xpTotal % XP_TROPHY_STEP);
  const pct = Math.round((xpTotal % XP_TROPHY_STEP) / XP_TROPHY_STEP * 100);
  return { remain, pct };
}

function renderXpPanel(){
  const s = UI_STRINGS[lang];
  document.getElementById("xpTitle").textContent = s.xpTitle;
  const body = document.getElementById("xpBody");
  const { remain, pct } = xpNextTrophyInfo();

  const trophiesHtml = xpTrophies.length
    ? `<div class="xp-trophy-grid">` + xpTrophies.slice().reverse().map(t => `
        <div class="xp-trophy xp-trophy-${trophyTier(t.n)}">
          ${ic("trophy")}
          <span class="xp-trophy-n">#${t.n}</span>
          <span class="xp-trophy-tier">${trophyTierLabel(t.n)}</span>
        </div>`).join("") + `</div>`
    : `<div class="empty"><div class="empty-ic">${ic("trophy")}</div>${s.xpNoTrophies}</div>`;

  const messagesHtml = xpMessages.length
    ? `<ul class="xp-msg-list">` + xpMessages.slice(0, 8).map(m => `<li>${m.text}</li>`).join("") + `</ul>`
    : `<p class="xp-msg-empty">${s.xpNoMessages}</p>`;

  body.innerHTML = `
    <div class="xp-total-card">
      <div class="xp-total-n">${xpTotal}<span> XP</span></div>
      <div class="progress-track" role="progressbar" aria-valuenow="${xpTotal % XP_TROPHY_STEP}" aria-valuemin="0" aria-valuemax="${XP_TROPHY_STEP}">
        <div class="progress-fill xp-fill" style="width:${pct}%"></div>
      </div>
      <span class="progress-label">${s.xpToNext(remain)}</span>
    </div>
    <p class="eyebrow">${s.xpTrophiesTitle}</p>
    ${trophiesHtml}
    <p class="eyebrow">${s.xpMessagesTitle}</p>
    ${messagesHtml}
  `;
}

function openXpPanel(){
  renderXpPanel();
  document.getElementById("xpOverlay").classList.add("open");
  document.body.classList.add("conj-lock");
}
function closeXpPanel(){
  document.getElementById("xpOverlay").classList.remove("open");
  document.body.classList.remove("conj-lock");
}

document.getElementById("xpClose").addEventListener("click", closeXpPanel);
document.getElementById("xpOverlay").addEventListener("click", (ev) => {
  if(ev.target.id === "xpOverlay") closeXpPanel();
});
document.getElementById("xpToast").addEventListener("click", hideXpToast);
document.addEventListener("keydown", (ev) => {
  if(ev.key === "Escape" && document.getElementById("xpOverlay").classList.contains("open")) closeXpPanel();
});

/* ---------- TORNA SU ---------- */

const backTopBtn = document.getElementById("backTop");
window.addEventListener("scroll", () => {
  backTopBtn.hidden = window.scrollY < 600;
}, { passive: true });
backTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* ---------- TAB BAR ---------- */

document.querySelectorAll(".tabbar .tab").forEach(b => {
  b.addEventListener("click", () => setTab(b.dataset.tab));
});

/* ---------- AVVIO ---------- */

paintStaticIcons();
applyStaticStrings();
applyTheme();
renderFilters();
updateView();
