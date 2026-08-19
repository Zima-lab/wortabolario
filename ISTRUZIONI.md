# Wortabolario — cosa caricare nel repo `wortabolario-V3`

Tutti i file sono **già pronti**: non devi modificare niente a mano, solo
caricarli al posto di quelli che ci sono adesso.

---

## L'ordine conta

Carica prima le immagini, poi il codice. Il motivo: `sw.js` elenca le icone
in `PRECACHE`, che usa `cache.addAll()` — è tutto-o-niente. Se pubblichi il
service worker quando le immagini non ci sono ancora, l'installazione
fallisce **in silenzio** e l'app perde il funzionamento offline.

---

### Passo 1 — file NUOVI (nessuno di questi esiste ancora)

Nella **radice** del repo:

| File | Cos'è |
|---|---|
| `apple-touch-icon.png` | 180px, nome fisso che iOS cerca per primo |
| `apple-touch-icon-precomposed.png` | 180px, variante per iOS più vecchi |
| `favicon.ico` | 16+32+48 in un file solo |

In una cartella **nuova** chiamata `icons/`:

| File | Misura |
|---|---|
| `icons/worta-16.png` | 16×16 |
| `icons/worta-32.png` | 32×32 |
| `icons/worta-48.png` | 48×48 |
| `icons/worta-180.png` | 180×180 |
| `icons/worta-192.png` | 192×192 |
| `icons/worta-512.png` | 512×512 |
| `icons/worta-maskable-512.png` | 512×512, con margine per la maschera Android |

> Su GitHub la cartella si crea al volo: **Add file → Create new file**,
> scrivi `icons/` nel nome e il campo si trasforma in cartella. Oppure
> trascina direttamente la cartella `icons` nella pagina di upload.

### Passo 2 — file da SOSTITUIRE (esistono già)

| File | Cosa cambia |
|---|---|
| `index.html` | le due righe delle icone diventano il blocco completo con `sizes` |
| `manifest.webmanifest` | misure vere al posto di quelle finte, più il campo `id` |
| `sw.js` | le nuove icone aggiunte a `PRECACHE` |
| `version.js` | `v26` → `v27`, così la cache vecchia viene buttata |

---

## Cosa NON toccare

`icon.png` e `favicon.png` **restano dove sono**. Il primo serve ancora a
`og:image` per le anteprime social, il secondo è ancora citato in `PRECACHE`.
Cancellarli farebbe fallire l'installazione del service worker.

---

## Passo 3 — svuota la cache delle icone

È la parte che quasi sempre si dimentica: Safari tiene le touch icon per
settimane, quindi senza questo passaggio continui a vedere quella sbagliata
anche a problema già risolto, e sembra che la correzione non abbia funzionato.

**iPhone**

1. Tieni premuta l'icona di Wortabolario nella Home → Rimuovi.
2. Impostazioni → Safari → Avanzate → Dati dei siti web → cerca
   `zima-lab.github.io` → scorri a sinistra → Elimina.
3. Riapri il sito in Safari e ri-aggiungilo alla Home.

**Mac**

1. Rimuovi la tessera dai Preferiti.
2. Safari → Impostazioni → Privacy → Gestisci dati dei siti web →
   `zima-lab.github.io` → Rimuovi.
3. Ricarica la pagina e rimetti il preferito.

---

## Passo 4 — verifica

Questi due indirizzi devono restituire l'immagine, non un 404:

- `https://zima-lab.github.io/wortabolario-V3/apple-touch-icon.png`
- `https://zima-lab.github.io/wortabolario-V3/icons/worta-180.png`

E il footer dell'app deve mostrare **v27**: se mostra ancora v26, il deploy
non è passato.

Se dopo la pulizia della cache le due app collidono ancora, allora — e solo
allora — serve separare davvero le origini: dominio proprio con due
sottodomini, oppure Cloudflare Pages / Netlify, che a ogni progetto
assegnano un sottodominio suo.

---

## Facoltativo, lato Glifo

A Glifo manca solo il campo `id` nel manifest. Aggiungerlo dà a Chromium
un'identità stabile anche quando due app condividono l'host. In
`manifest.webmanifest`, come prima riga dentro le graffe:

```json
"id": "/Glifo/",
```
