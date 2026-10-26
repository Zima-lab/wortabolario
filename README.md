# Wortabolario v3

Vocabolario tedesco ↔ italiano/inglese per il corso B1 — app web offline (PWA).

**Sito:** https://zima-lab.github.io/wortabolario-V3/

## Cosa contiene

- Ricerca in tedesco, italiano e inglese, tollerante agli errori di battitura
- Schede di verbi, sostantivi, aggettivi, grammatica, frasi e detti
- Coniugatore completo (Indikativ, Konjunktiv, Imperativ, participi)
- Flashcard bidirezionali con ripetizione spaziata (sistema Leitner)
- Quiz *der/die/das* e quiz di coniugazione
- Simulazione d'esame telc Deutsch B1 (Lesen, Sprachbausteine, Hören, Schreiben, Sprechen) con tempo e punteggio
- Preferiti, parole imparate, serie di giorni consecutivi
- Backup dei progressi in JSON (esporta / importa)
- Funziona offline e si installa sul telefono

## File

```
index.html        struttura della pagina e ordine di caricamento degli script
style.css         stile, diviso in 14 sezioni (indice in cima al file)
version.js        numero di versione: l'unica cosa da cambiare a ogni pubblicazione
sw.js             funzionamento offline (elenca tutti i file da salvare in cache)
manifest.webmanifest, icon.png, favicon.png, fonts/, *.pdf

dati/             IL CONTENUTO — per aggiungere parole o regole si toccano solo questi
  verbi.js          un verbo per riga
  sostantivi.js     un nome per riga
  aggettivi.js      aggettivi, avverbi, connettori
  grammatica.js     le schede di grammatica (nuove schede sempre IN FONDO)
  tabelle.js        tabelle casi × genere delle schede
  frasi.js          frasi utili e modi di dire
  esercizi.js       banca degli esercizi di grammatica
  esame-b1.js       modello d'esame telc B1 (testi originali, soluzioni, griglie)

js/               LA LOGICA — 15 file caricati in quest'ordine (vedi index.html)
  coniugazione.js   motore che costruisce tutte le forme di un verbo
  voci.js           riunisce tutti i dati in un unico elenco
  testi.js          testi dell'interfaccia in italiano e inglese
  stato.js          tema, preferiti, ripasso, serie di giorni, XP, backup
  icone-audio.js    icone e pronuncia
  bignami.js        collegamento delle schede alle pagine del Bignami
  ricerca.js        ricerca, filtri, elenco risultati, suggerimenti
  schede.js         come si disegna una scheda
  home.js           schermata Casa
  navigazione.js    tab in basso e pulsanti fissi
  flashcard.js      flashcard
  quiz.js           quiz der/die/das, coniugazione, wurde/würde, dürfen/können
  esercizi.js       esercizi di grammatica
  esame.js          simulazione d'esame telc B1 (timer, correzione, punteggi)
  avvio.js          traguardi, "torna su", avvio (sempre per ultimo)

test_app.js       test automatico (non serve al sito): node test_app.js
```

## Aggiornare il sito

Dopo aver caricato file modificati, **incrementare `APP_VERSION` in `version.js`**
(es. da `v46` a `v47`): `sw.js` ne ricava la versione della cache, così i
dispositivi scaricano i file nuovi. Se si aggiunge un file nuovo in `js/` o
`dati/`, va aggiunto sia in `index.html` sia nell'elenco di `sw.js`.

Nota: il CDN di GitHub Pages serve i file vecchi per circa 10 minuti dopo il
commit. Aspettare prima di aprire il sito, poi ricaricare forzatamente (⌘⇧R).

## Licenze

Codice e contenuti didattici: uso personale.
I caratteri in `fonts/` sono distribuiti con licenza SIL Open Font License
(vedi `fonts/OFL-IstokWeb.txt` e `fonts/OFL-PoltawskiNowy.txt`).
