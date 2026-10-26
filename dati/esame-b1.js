/* Wortabolario — dati/esame-b1.js
   Modello d'esame ORIGINALE nel formato "Zertifikat Deutsch / telc Deutsch B1"
   (testi scritti per l'app: non sono copie delle prove ufficiali telc).

   Struttura e punteggi come l'esame vero (fonte: telc.net):
     Leseverstehen 1–3 (75) + Sprachbausteine 1–2 (30) → 90 minuti insieme
     Hörverstehen 1–3 (75) → circa 30 minuti
     Schriftlicher Ausdruck (45) → 30 minuti
     Mündliche Prüfung 1–3 (75) → circa 15 minuti + 20 di preparazione
   Superato: 135/225 nello scritto E 45/75 nell'orale (60 % in entrambe).

   Numerazione come nel foglio risposte telc: Lesen 1–20, Sprachbausteine 21–40, Hören 41–60.
   Ogni item ha `a` (soluzione) e `src` (la frase del testo che dà la risposta, in tedesco).
   Tipi: match (scegli una lettera) · mc (a/b/c su un testo) · mcgap (a/b/c nei buchi)
         bank (buchi + 15 parole) · tf (richtig/falsch, con audio). */

const TELC_B1 = {
  id: "b1-1",
  title: "telc Deutsch B1 · Modelltest 1",

  lesen: { minutes: 90, max: 105, teile: [

    { id: "lv1", type: "match", name: "Leseverstehen · Teil 1", points: 25, perItem: 5,
      instr: "Lesen Sie die Überschriften a–j und die Texte 1–5. Welche Überschrift passt zu welchem Text? Jede Überschrift passt nur einmal.",
      tip: { it: "Leggi prima i 5 testi in fretta per capire il tema, poi cerca il titolo. Attento ai titoli-trappola: usano le stesse parole del testo ma dicono un'altra cosa.",
             en: "Skim the 5 texts first to get the topic, then look for the headline. Watch out for trap headlines: they reuse words from the text but say something else." },
      options: [
        ["a", "Sonntags lesen und lernen – zunächst als Versuch"],
        ["b", "Senioren suchen Nachhilfe in Mathematik"],
        ["c", "Freibäder bleiben wegen Wassermangel geschlossen"],
        ["d", "Mit dem Vierbeiner ins Büro"],
        ["e", "Fahrräder werden immer teurer"],
        ["f", "Bei Hitze länger baden"],
        ["g", "Stadtbibliothek wird renoviert"],
        ["h", "Jung und Alt helfen sich gegenseitig"],
        ["i", "Tierheim sucht ein neues Zuhause für Hunde"],
        ["j", "Immer mehr Menschen fahren mit dem Rad zur Arbeit"]
      ],
      items: [
        { n: 1, a: "a", src: "Zunächst gilt die neue Regelung für sechs Monate.",
          text: "Ab dem 1. März können Leserinnen und Leser die Stadtbibliothek auch sonntags besuchen. Zunächst gilt die neue Regelung für sechs Monate. Von 11 bis 17 Uhr kann man Bücher ausleihen, in Zeitschriften blättern oder in Ruhe lernen. Personal gibt es am Sonntag allerdings nur an der Information im Erdgeschoss; Bücher gibt man an den Automaten zurück. Wenn genug Menschen das Angebot nutzen, will die Stadt die Sonntagsöffnung im Herbst fest einführen." },
        { n: 2, a: "j", src: "Fast jeder fünfte Berufstätige … fährt inzwischen mit dem Rad zur Arbeit – vor fünf Jahren war es nur jeder zehnte.",
          text: "Fast jeder fünfte Berufstätige in unserer Stadt fährt inzwischen mit dem Rad zur Arbeit – vor fünf Jahren war es nur jeder zehnte. Das zeigt eine neue Umfrage der Universität. Die meisten Befragten sagen, dass sie so Geld sparen und gleichzeitig etwas für ihre Gesundheit tun. Viele wünschen sich aber breitere und sicherere Radwege. Die Stadt hat angekündigt, in den nächsten zwei Jahren zwölf Kilometer neue Radwege zu bauen." },
        { n: 3, a: "h", src: "Die Älteren helfen bei den Hausaufgaben … Dafür zeigen die Jugendlichen ihnen, wie man mit Smartphone und Tablet umgeht.",
          text: "Im Stadtteilzentrum Nord treffen sich seit Januar jeden Dienstag- und Donnerstagnachmittag Rentnerinnen und Rentner mit Schülern der Gesamtschule. Die Älteren helfen bei den Hausaufgaben in Mathematik, Deutsch und Englisch. Dafür zeigen die Jugendlichen ihnen, wie man mit Smartphone und Tablet umgeht. „Beide Seiten profitieren“, sagt die Leiterin des Zentrums. Wer mitmachen möchte, kann sich einfach im Büro des Zentrums melden." },
        { n: 4, a: "d", src: "Die Mitarbeiter dürfen ihre Hunde mit zur Arbeit bringen.",
          text: "Bei einer Softwarefirma in der Hafenstraße sind seit einigen Wochen nicht nur Menschen im Büro: Die Mitarbeiter dürfen ihre Hunde mit zur Arbeit bringen. Es gibt allerdings Regeln. Die Tiere müssen ruhig sein und dürfen nicht in die Küche. Außerdem müssen alle Kollegen im Raum einverstanden sein. Die Chefin ist zufrieden: Seit die Hunde da sind, ist die Stimmung im Team besser, und die Mitarbeiter machen öfter eine Pause an der frischen Luft." },
        { n: 5, a: "f", src: "Die städtischen Freibäder … öffnen bis Sonntag schon um 7 Uhr morgens und schließen erst um 21 Uhr.",
          text: "Für die kommende Woche erwarten die Meteorologen Temperaturen von über 30 Grad. Die städtischen Freibäder reagieren darauf: Sie öffnen bis Sonntag schon um 7 Uhr morgens und schließen erst um 21 Uhr. Die Stadtwerke bitten außerdem darum, Pflanzen im Garten nur am frühen Morgen oder am Abend zu gießen. Ärzte raten, viel Wasser zu trinken und in der Mittagszeit keinen Sport in der Sonne zu treiben." }
      ] },

    { id: "lv2", type: "mc", name: "Leseverstehen · Teil 2", points: 25, perItem: 5,
      instr: "Lesen Sie den Text und die Aufgaben 6–10. Welche Lösung (a, b oder c) ist richtig?",
      tip: { it: "Le domande seguono l'ordine del testo. Leggi prima la domanda, poi cerca il paragrafo giusto e confronta parola per parola: spesso la risposta sbagliata è vera solo a metà.",
             en: "The questions follow the order of the text. Read the question first, then find the right paragraph and compare closely: wrong options are often only half true." },
      title: "Wegwerfen? Nein danke!",
      text: "Jeden ersten Samstag im Monat ist im Gemeindehaus der Lutherkirche viel los. Dann öffnet dort das Reparatur-Café. Menschen bringen kaputte Toaster, Lampen, Fahrräder oder Kleidung mit und reparieren sie gemeinsam mit ehrenamtlichen Helfern. Die Idee hatte vor drei Jahren Sabine Krüger, eine 34-jährige Elektrotechnikerin. „Ich habe mich immer geärgert, wenn Freunde ein Gerät weggeworfen haben, nur weil ein kleines Teil kaputt war“, erzählt sie.\n\nAm Anfang kamen nur wenige Besucher, und Frau Krüger reparierte fast alles allein. Heute arbeiten zwölf Helferinnen und Helfer mit: ein pensionierter Schreiner, zwei Schneiderinnen, ein Fahrradmechaniker und mehrere Studenten. Bezahlt wird niemand. „Wir machen das, weil es Spaß macht und weil wir etwas für die Umwelt tun wollen“, sagt Frau Krüger.\n\nDie Reparatur selbst kostet nichts. Wer möchte, kann aber etwas in eine Spendenkasse werfen. Von dem Geld kauft das Team Werkzeug und Ersatzteile. Kaffee und Kuchen gibt es auch – den Kuchen backen die Helfer abwechselnd zu Hause.\n\nWichtig ist Frau Krüger, dass die Besucher nicht nur warten, bis ihr Gerät wieder funktioniert. „Jeder soll mitmachen und dabei etwas lernen. Viele sind überrascht, wie einfach manche Reparaturen sind.“ Nicht alles kann man retten: Etwa jedes dritte Gerät ist zu alt, oder es gibt keine Ersatzteile mehr. Trotzdem ist die Bilanz gut. Im letzten Jahr hat das Team über 400 Gegenstände repariert.\n\nInzwischen gibt es in der Stadt zwei weitere Reparatur-Cafés. Frau Krüger hat beim Start geholfen und ihre Erfahrungen weitergegeben. Ihr nächster Plan: Sie möchte Kurse an Schulen anbieten, damit schon Kinder lernen, dass man Dinge nicht sofort wegwerfen muss.",
      items: [
        { n: 6, q: "Sabine Krüger hat das Reparatur-Café gegründet, weil …", a: "b",
          opts: ["sie als Elektrotechnikerin keine Arbeit gefunden hat.", "sie es schade fand, dass Leute Geräte mit kleinen Fehlern wegwerfen.", "ihre Kirchengemeinde sie darum gebeten hat."],
          src: "„Ich habe mich immer geärgert, wenn Freunde ein Gerät weggeworfen haben, nur weil ein kleines Teil kaputt war.“" },
        { n: 7, q: "Die Helferinnen und Helfer …", a: "c",
          opts: ["bekommen eine kleine Bezahlung.", "arbeiten alle in technischen Berufen.", "bekommen kein Geld für ihre Arbeit."],
          src: "Bezahlt wird niemand. (Und nicht alle sind Techniker: Schneiderinnen, Studenten …)" },
        { n: 8, q: "Die Besucher …", a: "c",
          opts: ["bezahlen nur die Ersatzteile.", "müssen für jede Reparatur einen festen Preis zahlen.", "können freiwillig etwas spenden."],
          src: "Die Reparatur selbst kostet nichts. Wer möchte, kann aber etwas in eine Spendenkasse werfen." },
        { n: 9, q: "Frau Krüger findet es wichtig, dass die Besucher …", a: "a",
          opts: ["bei der Reparatur selbst mitmachen.", "ihre Geräte vorher anmelden.", "Kuchen für das Café mitbringen."],
          src: "„Jeder soll mitmachen und dabei etwas lernen.“" },
        { n: 10, q: "Was ist Frau Krügers nächster Plan?", a: "a",
          opts: ["Sie möchte Kurse für Kinder an Schulen anbieten.", "Sie will selbst ein weiteres Café eröffnen.", "Sie möchte das Café öfter als einmal im Monat öffnen."],
          src: "Sie möchte Kurse an Schulen anbieten, damit schon Kinder lernen … (Bei den anderen Cafés hat sie nur beim Start geholfen.)" }
      ] },

    { id: "lv3", type: "match", name: "Leseverstehen · Teil 3", points: 25, perItem: 2.5, allowX: true,
      instr: "Lesen Sie die Situationen 11–20 und die Anzeigen a–l. Welche Anzeige passt zu welcher Situation? Jede Anzeige passt nur einmal. Es ist auch möglich, dass es für eine Situation keine passende Anzeige gibt: Dann wählen Sie x.",
      tip: { it: "Sottolinea mentalmente il dettaglio decisivo di ogni situazione (sera? usato? vegetariano?). Un annuncio sullo stesso tema ma con il dettaglio sbagliato è una trappola: in quel caso la risposta può essere x.",
             en: "Spot the decisive detail in each situation (evening? second-hand? vegetarian?). An ad on the same topic with the wrong detail is a trap: then the answer may be x." },
      optionsTitle: "Anzeigen",
      options: [
        ["a", "Fahrradwerkstatt Speiche: Wir reparieren Räder aller Marken, Ersatzteile immer auf Lager. Termine nach Vereinbarung."],
        ["b", "Tierliebe Studentin (Anna, 23) betreut Ihren Hund, wenn Sie verreisen – auch für mehrere Wochen. Erfahrung mit großen und kleinen Hunden."],
        ["c", "Umzüge Schnell & Sicher: Wir transportieren Ihre Möbel – mit Lkw und erfahrenem Team. Kostenloses Angebot per Telefon."],
        ["d", "Restaurant Linde: Mittagstisch von Montag bis Freitag, täglich auch vegetarische Gerichte ab 8,50 €."],
        ["e", "Deutsch am Abend: Abendkurse B1 mit Prüfungstraining, montags und mittwochs 18:30–21:00 Uhr, Volkshochschule Mitte."],
        ["f", "WG-Zimmer frei: 16 m², 5 Minuten zur Uni, ab 1. Juni, 390 € warm. Wir sind drei nette Studentinnen."],
        ["g", "Yoga für Einsteiger: Neuer Kurs ab 5. Mai, keine Vorkenntnisse nötig, Matten sind vorhanden."],
        ["h", "Gebrauchte Räder ab 80 €! Alle geprüft und verkehrssicher. Fahrradbörse jeden Samstag auf dem Marktplatz."],
        ["i", "Grüne Küche: Kochkurse ganz ohne Fleisch – saisonal und einfach. Samstags 10–14 Uhr, höchstens 8 Personen."],
        ["j", "Rockkonzert „Die Lauten“ in der Stadthalle am 12. Juni – leider ausverkauft!"],
        ["k", "Hundeschule Pfote: Welpenkurse und Training für junge Hunde, Gruppen samstags vormittags."],
        ["l", "Mathe-Hilfe für die Klassen 5 bis 10: Lehramtsstudent gibt Einzelunterricht, auch online."]
      ],
      items: [
        { n: 11, a: "e", text: "Ihre Freundin Marta möchte abends nach der Arbeit Deutsch lernen und sich auf die B1-Prüfung vorbereiten.", src: "e: Abendkurse B1 mit Prüfungstraining … 18:30–21:00 Uhr" },
        { n: 12, a: "h", text: "Ein Kollege sucht ein günstiges gebrauchtes Fahrrad für den Weg zur Arbeit.", src: "h: Gebrauchte Räder ab 80 € (a repariert nur, verkauft keine Räder)" },
        { n: 13, a: "b", text: "Ihre Nachbarin fährt zwei Wochen in Urlaub und sucht jemanden, der in dieser Zeit ihren Hund versorgt.", src: "b: betreut Ihren Hund, wenn Sie verreisen – auch für mehrere Wochen (k ist eine Hundeschule)" },
        { n: 14, a: "x", text: "Sie suchen ein Geschenk für Ihre Mutter: Karten für ein klassisches Konzert.", src: "x: j ist ein Rockkonzert – und ausverkauft." },
        { n: 15, a: "i", text: "Sie möchten lernen, vegetarisch zu kochen – am liebsten am Wochenende.", src: "i: Kochkurse ganz ohne Fleisch … samstags (d ist ein Restaurant, kein Kurs)" },
        { n: 16, a: "l", text: "Ihr Sohn ist 14 Jahre alt, hat Probleme in Mathematik und braucht Nachhilfe.", src: "l: Mathe-Hilfe für die Klassen 5 bis 10" },
        { n: 17, a: "c", text: "Ein Freund zieht nächsten Monat um und braucht Hilfe beim Transport seiner Möbel.", src: "c: Wir transportieren Ihre Möbel" },
        { n: 18, a: "x", text: "Ihr Vater möchte lernen, wie man mit dem Smartphone Fotos macht und an die Familie schickt.", src: "x: Kein Kurs für Smartphones in den Anzeigen." },
        { n: 19, a: "g", text: "Sie möchten mit Yoga anfangen und haben noch nie einen Kurs besucht.", src: "g: Yoga für Einsteiger … keine Vorkenntnisse nötig" },
        { n: 20, a: "f", text: "Ihre Schwester zieht im Juni für ihr Studium in die Stadt und sucht ein Zimmer in einer Wohngemeinschaft nahe der Universität.", src: "f: WG-Zimmer frei … 5 Minuten zur Uni, ab 1. Juni" }
      ] },

    { id: "sb1", type: "mcgap", name: "Sprachbausteine · Teil 1", points: 15, perItem: 1.5,
      instr: "Lesen Sie den Text und entscheiden Sie, welches Wort (a, b oder c) in die Lücken 21–30 passt.",
      tip: { it: "Qui conta la grammatica: guarda dove sta il verbo (fine frase = subordinata), il caso dopo la preposizione e la reggenza del verbo (sich erinnern an…).",
             en: "Grammar is what counts here: check where the verb goes (end = subordinate clause), the case after the preposition and verb government (sich erinnern an…)." },
      text: "Liebe Julia,\n\nvielen Dank für deine Einladung zu deinem Geburtstag! Leider kann ich nicht kommen, {21} ich an diesem Wochenende in Hamburg bin. Meine Cousine heiratet, und die ganze Familie {22} dabei sein. Ich freue mich schon sehr auf die Feier, {23} ich habe keine große Lust auf die lange Zugfahrt.\n\nWie geht es dir eigentlich in deiner neuen Wohnung? Hast du schon alle Möbel aufgebaut? Ich erinnere mich noch gut {24} meinen eigenen Umzug letztes Jahr – das war wirklich anstrengend!\n\nIch würde dich gern bald besuchen. {25} du am übernächsten Samstag Zeit? Dann könnten wir zusammen ins neue Café gehen, {26} du mir am Telefon erzählt hast. Ich bringe dir auch das Buch zurück, {27} du mir im Sommer geliehen hast. Entschuldige, dass es so lange gedauert hat!\n\nIch wünsche dir schon jetzt einen schönen Geburtstag und hoffe, {28} ihr viel Spaß habt. Schick mir doch ein paar Fotos! Ich bin gespannt, {29} viele Leute kommen.\n\n{30} Grüße\ndeine Lena",
      items: [
        { n: 21, opts: ["weil", "denn", "deshalb"], a: "a", src: "…, weil ich … in Hamburg bin. (Verb am Ende → Nebensatz)" },
        { n: 22, opts: ["möchte", "möchtet", "möchten"], a: "a", src: "die ganze Familie (= sie, Singular) möchte" },
        { n: 23, opts: ["obwohl", "trotzdem", "aber"], a: "c", src: "…, aber ich habe … (aber: Position 0, das Verb bleibt auf Position 2)" },
        { n: 24, opts: ["über", "an", "auf"], a: "b", src: "sich erinnern an + Akk." },
        { n: 25, opts: ["Bist", "Hat", "Hast"], a: "c", src: "Zeit haben → Hast du Zeit?" },
        { n: 26, opts: ["von das", "von dem", "von den"], a: "b", src: "das Café → erzählen von + Dativ → von dem" },
        { n: 27, opts: ["das", "den", "dem"], a: "a", src: "das Buch → leihen + Akk. → das" },
        { n: 28, opts: ["ob", "wenn", "dass"], a: "c", src: "ich hoffe, dass …" },
        { n: 29, opts: ["dass", "wie", "was"], a: "b", src: "gespannt, wie viele Leute kommen (indirekte Frage)" },
        { n: 30, opts: ["Vieler lieber", "Vielen lieben", "Viele liebe"], a: "c", src: "Viele liebe Grüße (Akkusativ Plural)" }
      ] },

    { id: "sb2", type: "bank", name: "Sprachbausteine · Teil 2", points: 15, perItem: 1.5,
      instr: "Lesen Sie den Text und entscheiden Sie, welches Wort (a–o) in die Lücken 31–40 passt. Jedes Wort passt nur einmal.",
      tip: { it: "Le parole sono 15 per 10 buchi: 5 sono di troppo. Prima riempi i buchi sicuri e cancella mentalmente le parole usate.",
             en: "There are 15 words for 10 gaps: 5 are extra. Fill the gaps you are sure of first and mentally cross off the words you used." },
      options: [
        ["a", "am"], ["b", "anzumelden"], ["c", "bringen"], ["d", "Erfolg"], ["e", "freuen"],
        ["f", "Glück"], ["g", "im"], ["h", "mit"], ["i", "ob"], ["j", "seit"],
        ["k", "statt"], ["l", "unterstützen"], ["m", "währenddessen"], ["n", "weil"], ["o", "zwischen"]
      ],
      text: "Liebe Mitglieder,\n\nwie jedes Jahr findet auch in diesem Sommer unser Vereinsfest statt, und zwar {31} Samstag, dem 11. Juli. Wir beginnen um 14 Uhr mit einem Fußballturnier für Kinder. {32} gibt es Kaffee und Kuchen auf der Terrasse. Am Abend spielt eine Band, die schon letztes Jahr großen {33} hatte.\n\nDamit wir besser planen können, bitten wir Sie, sich bis zum 30. Juni {34}. Bitte teilen Sie uns auch mit, {35} Sie einen Salat oder einen Kuchen mitbringen können. Für Getränke sorgt der Verein.\n\nWir suchen außerdem noch Helferinnen und Helfer für den Auf- und Abbau. Wer Lust hat, uns zu {36}, meldet sich bitte bei Herrn Weber im Büro. Das Büro ist montags bis freitags {37} 9 und 12 Uhr geöffnet.\n\nBei schlechtem Wetter findet das Fest in der Sporthalle {38}. Den aktuellen Stand finden Sie ab Freitagmittag auf unserer Internetseite.\n\nWir {39} uns auf viele Gäste und einen schönen Tag {40} Ihnen!\n\nMit freundlichen Grüßen\nDer Vorstand des TSV Grünwald",
      items: [
        { n: 31, a: "a", src: "am Samstag (Wochentage: am)" },
        { n: 32, a: "m", src: "Währenddessen gibt es … (= gleichzeitig; Verb auf Position 2)" },
        { n: 33, a: "d", src: "großen Erfolg haben" },
        { n: 34, a: "b", src: "bitten, sich … anzumelden (zu + Infinitiv)" },
        { n: 35, a: "i", src: "mitteilen, ob … (ja oder nein?)" },
        { n: 36, a: "l", src: "uns zu unterstützen (= uns helfen)" },
        { n: 37, a: "o", src: "zwischen 9 und 12 Uhr" },
        { n: 38, a: "k", src: "stattfinden → findet … statt" },
        { n: 39, a: "e", src: "sich freuen auf → Wir freuen uns auf …" },
        { n: 40, a: "h", src: "mit Ihnen" }
      ] }
  ] },

  hoeren: { minutes: 30, max: 75, teile: [

    { id: "hv1", type: "tf", name: "Hörverstehen · Teil 1", points: 25, perItem: 5, plays: 1,
      instr: "Sie hören fünf kurze Nachrichten. Sie hören jede Nachricht nur einmal. Entscheiden Sie: Ist die Aussage richtig oder falsch?",
      tip: { it: "Leggi l'affermazione PRIMA di ascoltare: sai già cosa cercare. Qui si ascolta una volta sola, come all'esame.",
             en: "Read the statement BEFORE listening: you know what to listen for. You hear it only once here, as in the exam." },
      items: [
        { n: 41, a: "r", q: "Zwischen Hauptbahnhof und Nordpark fahren drei Wochen lang Busse statt der S-Bahn.",
          audio: [["A", "Wegen Bauarbeiten fährt die S-Bahn-Linie 7 ab Montag drei Wochen lang nicht zwischen Hauptbahnhof und Nordpark. Stattdessen fahren Ersatzbusse, und zwar alle zehn Minuten. Die Bahn bittet die Fahrgäste, etwa fünfzehn Minuten mehr Zeit einzuplanen."]],
          src: "… drei Wochen lang nicht zwischen Hauptbahnhof und Nordpark. Stattdessen fahren Ersatzbusse …" },
        { n: 42, a: "f", q: "Das Feuerwerk findet wie geplant am Samstag statt.",
          audio: [["B", "Das große Stadtfest am Wochenende findet trotz des angekündigten Regens statt. Die Veranstalter haben zusätzliche Zelte aufgebaut. Nur das Feuerwerk am Samstagabend wird auf Sonntag verschoben."]],
          src: "Nur das Feuerwerk am Samstagabend wird auf Sonntag verschoben." },
        { n: 43, a: "r", q: "Die Stadt sucht Jugendliche für einen bezahlten Ferienjob.",
          audio: [["A", "Die Stadtverwaltung sucht für die Sommerferien Jugendliche ab 16 Jahren, die in den Parks bei der Pflege der Blumen helfen. Die Arbeit wird bezahlt. Bewerbungen sind bis Ende Mai möglich."]],
          src: "… für die Sommerferien Jugendliche ab 16 Jahren … Die Arbeit wird bezahlt." },
        { n: 44, a: "f", q: "Am Tag der offenen Tür kann man sofort einen Hund mitnehmen.",
          audio: [["B", "Im Tierheim Süd gibt es am Sonntag einen Tag der offenen Tür. Besucher können sich die Tiere ansehen und mit den Pflegern sprechen. Wer einen Hund adoptieren möchte, muss allerdings einen eigenen Termin vereinbaren."]],
          src: "Wer einen Hund adoptieren möchte, muss allerdings einen eigenen Termin vereinbaren." },
        { n: 45, a: "r", q: "Schüler müssen für ihre Monatskarte nicht mehr bezahlen als jetzt.",
          audio: [["A", "Die Preise für Bus und Bahn steigen ab Januar um durchschnittlich drei Prozent. Die Monatskarte für Schüler bleibt aber genauso teuer wie bisher."]],
          src: "Die Monatskarte für Schüler bleibt aber genauso teuer wie bisher." }
      ] },

    { id: "hv2", type: "tf", name: "Hörverstehen · Teil 2", points: 25, perItem: 2.5, plays: 2,
      instr: "Sie hören ein Interview. Sie hören das Interview zweimal. Entscheiden Sie bei den Aufgaben 46–55: Ist die Aussage richtig oder falsch?",
      tip: { it: "Le affermazioni seguono l'ordine dell'intervista. Al primo ascolto segna quello che sei sicuro di aver capito, al secondo controlla i dubbi.",
             en: "The statements follow the order of the interview. On the first listen mark what you are sure of; use the second to check the doubtful ones." },
      audio: [
        ["A", "Herzlich willkommen zu „Leute von heute“. Mein Gast ist heute Katrin Petersen. Sie ist Hundetrainerin und hat vor sechs Jahren ihre eigene Hundeschule gegründet. Guten Tag, Frau Petersen."],
        ["B", "Guten Tag, und danke für die Einladung."],
        ["A", "Frau Petersen, wie sind Sie zu diesem Beruf gekommen?"],
        ["B", "Eigentlich hatte ich zuerst einen ganz anderen Beruf. Ich habe eine Ausbildung zur Bankkauffrau gemacht und acht Jahre in einer Bank gearbeitet. Die Arbeit war in Ordnung, aber ich saß den ganzen Tag am Schreibtisch. Dann habe ich einen Hund aus dem Tierheim geholt, Bruno. Er hatte große Angst vor anderen Hunden, und ich wusste nicht, wie ich ihm helfen konnte. Also habe ich mit ihm einen Kurs besucht. Und da habe ich gemerkt: Das will ich auch machen."],
        ["A", "Und dann haben Sie sofort bei der Bank gekündigt?"],
        ["B", "Nein, nein, so mutig war ich nicht. Ich habe zwei Jahre lang neben der Arbeit eine Ausbildung zur Hundetrainerin gemacht, abends und am Wochenende. Erst danach habe ich gekündigt."],
        ["A", "Braucht man in Deutschland eigentlich eine Erlaubnis, wenn man als Hundetrainerin arbeiten will?"],
        ["B", "Ja. Man braucht eine Erlaubnis vom Veterinäramt. Dafür muss man zeigen, dass man genug über Hunde weiß. Bei mir gab es ein Fachgespräch und eine praktische Prüfung."],
        ["A", "Wer kommt denn zu Ihnen in die Hundeschule?"],
        ["B", "Ganz unterschiedliche Leute. Viele haben zum ersten Mal einen Hund, oft einen Welpen. Die wollen lernen, wie man richtig mit dem Tier umgeht. Aber es kommen auch Leute mit älteren Hunden, die zum Beispiel an der Leine ziehen oder Besucher anbellen."],
        ["A", "Was ist der häufigste Fehler, den Hundebesitzer machen?"],
        ["B", "Ich glaube, sie sind nicht konsequent. Heute darf der Hund aufs Sofa, morgen nicht. Das versteht kein Hund. Regeln müssen immer gelten, und zwar für alle in der Familie."],
        ["A", "Wie sieht ein typischer Arbeitstag bei Ihnen aus?"],
        ["B", "Vormittags habe ich meistens Einzeltrainings, oft bei den Leuten zu Hause. Am Nachmittag und am Abend sind die Gruppenkurse, weil die meisten Leute dann nicht mehr arbeiten. Und dazwischen muss ich noch Rechnungen schreiben und Termine planen. Das Büro ist ehrlich gesagt der Teil, den ich am wenigsten mag."],
        ["A", "Und Bruno, ist der noch dabei?"],
        ["B", "Ja! Er ist jetzt elf Jahre alt und kommt immer noch mit in die Kurse. Für die jungen Hunde ist er ein gutes Vorbild, weil er so ruhig ist. Kaum zu glauben, dass er früher solche Angst hatte."],
        ["A", "Frau Petersen, vielen Dank für das Gespräch."]
      ],
      items: [
        { n: 46, a: "r", q: "Frau Petersen hat früher in einer Bank gearbeitet.", src: "… acht Jahre in einer Bank gearbeitet." },
        { n: 47, a: "r", q: "Ihr Hund Bruno hatte am Anfang Angst vor anderen Hunden.", src: "Er hatte große Angst vor anderen Hunden …" },
        { n: 48, a: "f", q: "Nach dem ersten Kurs hat sie sofort bei der Bank gekündigt.", src: "Nein, nein, so mutig war ich nicht. … Erst danach habe ich gekündigt." },
        { n: 49, a: "r", q: "Die Ausbildung zur Hundetrainerin hat sie neben ihrer Arbeit gemacht.", src: "… zwei Jahre lang neben der Arbeit eine Ausbildung …, abends und am Wochenende." },
        { n: 50, a: "f", q: "Als Hundetrainerin braucht man in Deutschland keine besondere Erlaubnis.", src: "Man braucht eine Erlaubnis vom Veterinäramt." },
        { n: 51, a: "f", q: "In ihre Hundeschule kommen nur Menschen mit jungen Hunden.", src: "Aber es kommen auch Leute mit älteren Hunden …" },
        { n: 52, a: "r", q: "Viele Hundebesitzer ändern ihre Regeln immer wieder.", src: "Heute darf der Hund aufs Sofa, morgen nicht." },
        { n: 53, a: "f", q: "Die Gruppenkurse finden meistens am Vormittag statt.", src: "Vormittags … Einzeltrainings. Am Nachmittag und am Abend sind die Gruppenkurse." },
        { n: 54, a: "f", q: "Die Büroarbeit macht ihr am meisten Spaß.", src: "Das Büro ist … der Teil, den ich am wenigsten mag." },
        { n: 55, a: "r", q: "Bruno kommt heute noch mit in die Kurse.", src: "… kommt immer noch mit in die Kurse." }
      ] },

    { id: "hv3", type: "tf", name: "Hörverstehen · Teil 3", points: 25, perItem: 5, plays: 2,
      instr: "Sie hören fünf kurze Texte. Sie hören jeden Text zweimal. Entscheiden Sie bei den Aufgaben 56–60: Ist die Aussage richtig oder falsch?",
      tip: { it: "Sono messaggi della vita quotidiana: segreterie, annunci, radio. Concentrati su orari, luoghi e cambi di programma.",
             en: "These are everyday messages: voicemail, announcements, radio. Focus on times, places and changes of plan." },
      items: [
        { n: 56, a: "r", q: "Herr Moretti soll die Praxis zurückrufen.",
          audio: [["B", "Guten Tag, Herr Moretti, hier ist die Praxis Doktor Lang. Wir müssen Ihren Termin am Donnerstag leider absagen, weil die Ärztin krank ist. Können Sie stattdessen am Montag um neun Uhr kommen? Bitte rufen Sie uns kurz zurück. Vielen Dank!"]],
          src: "Bitte rufen Sie uns kurz zurück." },
        { n: 57, a: "f", q: "Der Supermarkt ist heute bis 22 Uhr geöffnet.",
          audio: [["A", "Liebe Kundinnen und Kunden, heute ab 18 Uhr bekommen Sie alle Backwaren an unserer Brottheke zum halben Preis. Bitte beachten Sie: Unser Markt schließt heute bereits um 20 Uhr."]],
          src: "Unser Markt schließt heute bereits um 20 Uhr." },
        { n: 58, a: "r", q: "Der Zug nach Potsdam fährt heute von einem anderen Gleis ab.",
          audio: [["B", "Achtung an Gleis 4: Der Regionalexpress nach Potsdam, planmäßige Abfahrt 14 Uhr 12, fährt heute von Gleis 6. Ich wiederhole: Der Regionalexpress nach Potsdam fährt heute von Gleis 6."]],
          src: "… fährt heute von Gleis 6 (nicht von Gleis 4)." },
        { n: 59, a: "f", q: "Auf der Autobahn gibt es wegen einer Baustelle Stau.",
          audio: [["A", "Und jetzt die Verkehrsmeldungen. Auf der A 7 zwischen den Ausfahrten Nord und Mitte gibt es nach einem Unfall zehn Kilometer Stau. Bitte fahren Sie vorsichtig."]],
          src: "… nach einem Unfall zehn Kilometer Stau." },
        { n: 60, a: "r", q: "Tom möchte sich um sieben Uhr vor dem Restaurant treffen.",
          audio: [["A", "Hallo, ich bin's, Tom. Das mit dem Kino heute Abend klappt leider nicht, die Vorstellung ist ausverkauft. Wollen wir stattdessen essen gehen? Ich warte um sieben vor dem Restaurant am Markt. Bis später!"]],
          src: "Ich warte um sieben vor dem Restaurant am Markt." }
      ] }
  ] },

  schreiben: { minutes: 30, max: 45,
    instr: "Schreiben Sie einen Brief bzw. eine E-Mail. Schreiben Sie etwas zu allen vier Punkten. Achten Sie auf den Textaufbau (Anrede, Einleitung, Reihenfolge der Inhaltspunkte, Schluss, Gruß).",
    tasks: [
      { id: "A", label: { it: "Lettera personale (du)", en: "Personal letter (du)" },
        input: "Sie haben diese E-Mail von Ihrem Freund Paul bekommen:\n\n„Hallo! Große Neuigkeiten: Ich habe einen neuen Job – in deiner Stadt! Im September ziehe ich um. Ich kenne dort aber niemanden außer dir. Kannst du mir ein bisschen helfen? Liebe Grüße, Paul“",
        points: [
          "Wie Ihnen die Stadt gefällt",
          "In welchem Stadtteil man gut wohnen kann",
          "Wie man eine Wohnung findet",
          "Ein Treffen vorschlagen"
        ],
        model: "Lieber Paul,\n\nvielen Dank für deine E-Mail! Herzlichen Glückwunsch zum neuen Job – ich freue mich sehr, dass du bald hier wohnst.\n\nMir gefällt die Stadt sehr gut. Sie ist nicht zu groß, es gibt viele Parks, und am Wochenende ist immer etwas los. Nur die Mieten sind leider ziemlich hoch.\n\nAm besten wohnst du im Westviertel. Dort ist es ruhig, aber trotzdem nah am Zentrum, und es gibt gute Busverbindungen. Ich wohne auch dort.\n\nEine Wohnung findest du am schnellsten im Internet. Du kannst aber auch Freunde und Kollegen fragen, denn viele Wohnungen werden nie in einer Anzeige angeboten. Ich höre mich gern für dich um.\n\nWenn du im August zur Wohnungssuche kommst, können wir uns treffen. Ich zeige dir dann das Viertel, und danach gehen wir in mein Lieblingscafé. Passt dir der 15. August?\n\nViele Grüße\ndein Marco" },
      { id: "B", label: { it: "Lettera semiformale (Sie)", en: "Semi-formal letter (Sie)" },
        input: "Sie haben diese Anzeige gelesen:\n\n„Sprachschule Lingua – Deutschkurse B1 und B2: intensiv am Vormittag oder zweimal pro Woche am Abend. Prüfungsvorbereitung telc. Infos: info@sprachschule-lingua.example“",
        points: [
          "Ihre Deutschkenntnisse",
          "Welche Kurszeiten für Sie passen",
          "Preis und Ermäßigung",
          "Prüfung am Ende des Kurses"
        ],
        model: "Sehr geehrte Damen und Herren,\n\nich habe Ihre Anzeige gelesen und interessiere mich für einen Deutschkurs auf dem Niveau B1.\n\nIch lerne seit einem Jahr Deutsch und habe einen A2-Kurs an der Volkshochschule abgeschlossen. Im Alltag verstehe ich schon viel, aber beim Schreiben mache ich noch viele Fehler.\n\nDa ich tagsüber arbeite, kann ich nur am Abend lernen. Könnten Sie mir bitte mitteilen, an welchen Tagen der Abendkurs stattfindet?\n\nAußerdem möchte ich wissen, wie viel der Kurs kostet. Gibt es eine Ermäßigung, wenn man den Kurs im Voraus bezahlt?\n\nMein Ziel ist die Prüfung telc Deutsch B1. Kann ich die Prüfung am Ende des Kurses direkt bei Ihnen in der Schule machen?\n\nIch freue mich auf Ihre Antwort.\n\nMit freundlichen Grüßen\nMarco Rossi" }
    ],
    /* Criteri del modello ufficiale telc: A = 5, B = 3, C = 1, D = 0 punti, × 3 → max 15 per criterio.
       Se il criterio I o III è D, la lettera vale 0. (I 2 punti bonus per varietà/lunghezza non sono inclusi.) */
    criteria: [
      { id: "I", de: "Aufgabenbewältigung", it: "Contenuto: i 4 punti", en: "Content: the 4 points",
        lv: { A: { it: "Ho trattato tutti e 4 i punti in modo chiaro.", en: "I covered all 4 points clearly." },
              B: { it: "3 punti bene, oppure 4 ma uno solo accennato.", en: "3 points well, or 4 with one only touched on." },
              C: { it: "Solo 2 punti trattati davvero.", en: "Only 2 points really covered." },
              D: { it: "Un punto o nessuno.", en: "One point or none." } } },
      { id: "II", de: "Kommunikative Gestaltung", it: "Struttura e registro", en: "Structure and register",
        lv: { A: { it: "Saluto e chiusura giusti, du/Sie coerente, frasi collegate (denn, deshalb, außerdem…).", en: "Correct greeting and closing, consistent du/Sie, linked sentences (denn, deshalb, außerdem…)." },
              B: { it: "Qualche passaggio poco collegato o un errore di registro.", en: "Some parts not well linked or one register slip." },
              C: { it: "Frasi slegate, manca saluto o chiusura.", en: "Disconnected sentences, greeting or closing missing." },
              D: { it: "Il testo non funziona come lettera.", en: "The text does not work as a letter." } } },
      { id: "III", de: "Formale Richtigkeit", it: "Correttezza", en: "Accuracy",
        lv: { A: { it: "Pochi errori, non disturbano la lettura.", en: "Few mistakes, they don't disturb reading." },
              B: { it: "Alcuni errori, ma si capisce tutto.", en: "Some mistakes, but everything is clear." },
              C: { it: "Molti errori, a volte non si capisce.", en: "Many mistakes, sometimes unclear." },
              D: { it: "Si capisce pochissimo.", en: "Very little can be understood." } } }
    ] },

  sprechen: { minutes: 20, max: 75,
    instr: "Die mündliche Prüfung machen Sie zu zweit. Vorher haben Sie 20 Minuten Zeit zur Vorbereitung (für Teil 2 und 3).",
    teile: [
      { id: "sp1", name: "Teil 1 · Kontaktaufnahme", points: 15,
        task: "Sie lernen Ihre Partnerin / Ihren Partner kennen. Stellen Sie Fragen und erzählen Sie von sich.",
        list: ["Name", "Herkunft", "Wohnort", "Familie", "Beruf oder Ausbildung", "Sprachen", "Freizeit und Hobbys", "Reisen"],
        phrases: ["Woher kommst du?", "Wie lange wohnst du schon hier?", "Was machst du beruflich?", "Welche Sprachen sprichst du?", "Was machst du gern in deiner Freizeit?", "Und du? Wie ist das bei dir?"],
        model: "Hallo, ich heiße Marco und komme aus Italien, aus Bologna. Seit zwei Jahren wohne ich in Berlin. Ich arbeite mit Hunden: Ich bin Hundesitter. In meiner Freizeit fotografiere ich gern und gehe ins Kino. Und du? Woher kommst du?" },
      { id: "sp2", name: "Teil 2 · Über ein Thema sprechen", points: 30,
        task: "Sie und Ihr Partner haben zwei verschiedene kurze Texte zum gleichen Thema. Berichten Sie, worum es in Ihrem Text geht. Sprechen Sie dann über Ihre eigenen Erfahrungen und Ihre Meinung, und reagieren Sie auf Ihren Partner.",
        texts: [
          { label: "Text A", text: "Arbeiten von zu Hause: Immer mehr Firmen erlauben ihren Mitarbeitern, ein bis drei Tage pro Woche im Homeoffice zu arbeiten. Viele Beschäftigte sind zufrieden: Sie sparen den Weg zur Arbeit und können sich die Zeit besser einteilen." },
          { label: "Text B", text: "Allein im Homeoffice: Eine Umfrage zeigt, dass sich jeder dritte Beschäftigte im Homeoffice manchmal einsam fühlt. Viele vermissen die Gespräche mit den Kollegen. Außerdem fällt es manchen schwer, nach der Arbeit wirklich abzuschalten." }
        ],
        list: ["Worum geht es in Ihrem Text?", "Wie ist das in Ihrem Heimatland?", "Welche Erfahrungen haben Sie gemacht?", "Was ist Ihre Meinung?"],
        phrases: ["In meinem Text geht es um …", "Der Text berichtet, dass …", "In Italien ist das ein bisschen anders: …", "Ich habe die Erfahrung gemacht, dass …", "Meiner Meinung nach …", "Da hast du recht, aber …"],
        model: "In meinem Text geht es um das Homeoffice. Viele Firmen erlauben ihren Mitarbeitern, ein paar Tage pro Woche zu Hause zu arbeiten, und die meisten finden das gut, weil sie keine Zeit im Verkehr verlieren. In Italien ist das in den letzten Jahren auch normaler geworden. Meiner Meinung nach ist eine Mischung am besten: zwei Tage zu Hause, drei Tage im Büro. Was steht in deinem Text?" },
      { id: "sp3", name: "Teil 3 · Gemeinsam etwas planen", points: 30,
        task: "Eine Kollegin aus Ihrem Deutschkurs zieht in eine andere Stadt. Sie möchten zusammen ein kleines Abschiedsfest für sie organisieren. Machen Sie Vorschläge, reagieren Sie auf die Vorschläge Ihres Partners und einigen Sie sich.",
        list: ["Wann?", "Wo?", "Essen und Getränke?", "Geschenk?", "Wer macht was?"],
        phrases: ["Wie wäre es, wenn wir …?", "Ich schlage vor, dass …", "Das ist eine gute Idee!", "Ich weiß nicht, ich finde …", "Lieber nicht, denn …", "Also, dann machen wir es so: …"],
        model: "A: Wie wäre es, wenn wir das Fest am Freitag nach dem Kurs machen?\nB: Gute Idee, da haben alle Zeit. Wo sollen wir feiern?\nA: Ich schlage vor, dass wir im Kursraum feiern. Das kostet nichts.\nB: Hm, ich weiß nicht. Ein Café wäre gemütlicher. Was meinst du?\nA: Einverstanden. Und als Geschenk? Vielleicht ein Buch über ihre neue Stadt?\nB: Und was machen wir mit Essen und Getränken?\nA: Jeder bringt etwas zu essen mit, und die Getränke bestellen wir im Café.\nB: Super. Ich kaufe das Buch, und du reservierst einen Tisch im Café.\nA: Gut, dann machen wir es so!" }
    ],
    /* Criteri ufficiali telc per ogni parte (modello ufficiale Zertifikat Deutsch):
       Teil 1: tre criteri 4/3/1/0 + Aussprache 3/2/1/0 = 15 · Teil 2 e 3: tre criteri 8/6/2/0 + Aussprache 6/4/2/0 = 30 */
    scales: { sp1: [[4, 3, 1, 0], [3, 2, 1, 0]], sp2: [[8, 6, 2, 0], [6, 4, 2, 0]], sp3: [[8, 6, 2, 0], [6, 4, 2, 0]] },
    criteria: [
      { id: "aus", de: "Ausdrucksfähigkeit", it: "ricchezza e adeguatezza della lingua", en: "range and appropriateness",
        lv: { A: "voll angemessen", B: "im Großen und Ganzen angemessen", C: "kaum noch akzeptabel", D: "durchgehend nicht ausreichend" } },
      { id: "auf", de: "Aufgabenbewältigung", it: "svolgere il compito, interagire con il partner", en: "task completion, interaction",
        lv: { A: "voll angemessen", B: "im Großen und Ganzen angemessen", C: "kaum noch akzeptabel", D: "durchgehend nicht ausreichend" } },
      { id: "for", de: "Formale Richtigkeit", it: "correttezza grammaticale", en: "grammatical accuracy",
        lv: { A: "keine oder nur vereinzelte Fehler", B: "Fehler, die das Verständnis nicht beeinträchtigen", C: "Fehler an zentralen Stellen, die das Verständnis erheblich beeinträchtigen", D: "so viele Fehler, dass die Kommunikation scheitert" } },
      { id: "ton", de: "Aussprache / Intonation", it: "pronuncia e intonazione", en: "pronunciation and intonation", aussp: true,
        lv: { A: "beeinträchtigen das Verständnis nicht", B: "erschweren gelegentlich das Verständnis", C: "erschweren das Verständnis erheblich", D: "machen das Verständnis (nahezu) unmöglich" } }
    ]
  }
};
