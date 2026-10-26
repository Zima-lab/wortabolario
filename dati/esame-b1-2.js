/* Wortabolario — dati/esame-b1-2.js
   Secondo modello d'esame ORIGINALE "telc Deutsch B1" (testi scritti per l'app).
   Struttura, istruzioni, consigli, punteggi e griglie sono quelli del Modelltest 1
   (dati/esame-b1.js, caricato prima): qui cambia solo il CONTENUTO.
   Stessa forma dei dati: item con `a` (soluzione) e `src` (la frase che dà la risposta). */

const TELC_B1_2 = (() => {
  const M1 = TELC_B1;
  const L = M1.lesen.teile, H = M1.hoeren.teile;
  return {
    id: "b1-2",
    title: "telc Deutsch B1 · Modelltest 2",

    lesen: { ...M1.lesen, teile: [

      { ...L[0],
        options: [
          ["a", "Kunst einmal im Monat gratis"],
          ["b", "Busfahrer streiken am Wochenende"],
          ["c", "Brot von gestern für Menschen in Not"],
          ["d", "Gemüse wird immer teurer"],
          ["e", "Junge Leute entdecken das Buch neu"],
          ["f", "Museum schließt für ein Jahr"],
          ["g", "Nachbarn ernten gemeinsam"],
          ["h", "Neue Bäckerei eröffnet am Markt"],
          ["i", "Am Wochenende nachts mehr Busse"],
          ["j", "Bibliotheken verkaufen alte Bücher"]
        ],
        items: [
          { n: 1, a: "g", src: "Im Gemeinschaftsgarten … gärtnern … rund 40 Nachbarinnen und Nachbarn zusammen. … Was geerntet wird, teilen die Gärtner untereinander auf.",
            text: "Wo früher ein Parkplatz war, wachsen jetzt Tomaten, Salat und Kräuter: Im Gemeinschaftsgarten „Grüne Ecke“ gärtnern seit dem Frühjahr rund 40 Nachbarinnen und Nachbarn zusammen. Jeder kann mitmachen, auch ohne Erfahrung. Werkzeug und Samen bezahlt der Bezirk. Was geerntet wird, teilen die Gärtner untereinander auf. „Hier lerne ich endlich die Leute aus meinem Haus kennen“, sagt eine Teilnehmerin. Das nächste Treffen ist am Samstag um 10 Uhr." },
          { n: 2, a: "i", src: "… in der Nacht von Freitag auf Samstag und von Samstag auf Sonntag zusätzliche Busse.",
            text: "Gute Nachricht für alle, die am Wochenende gern ausgehen: Ab dem 1. November fahren in der Nacht von Freitag auf Samstag und von Samstag auf Sonntag zusätzliche Busse. Die Nachtlinien kommen dann alle 15 statt alle 30 Minuten. Außerdem gibt es eine neue Linie, die bis in die Vororte fährt. Die Verkehrsbetriebe reagieren damit auf viele Beschwerden von Fahrgästen, die nachts lange an den Haltestellen warten mussten." },
          { n: 3, a: "a", src: "… kostet der Eintritt ab sofort an jedem ersten Sonntag im Monat nichts.",
            text: "Das Kunstmuseum möchte mehr junge Menschen und Familien erreichen. Deshalb kostet der Eintritt ab sofort an jedem ersten Sonntag im Monat nichts. An diesen Tagen gibt es auch kostenlose Führungen für Kinder um 11 und um 15 Uhr. Für die Sonderausstellungen muss man allerdings weiterhin ein Ticket kaufen. Die Museumsleitung hofft, dass so auch Menschen kommen, die noch nie im Museum waren." },
          { n: 4, a: "e", src: "… hat fast die Hälfte der 14- bis 19-Jährigen mindestens ein Buch pro Monat gelesen – deutlich mehr als vor zehn Jahren.",
            text: "Lange hieß es, dass Jugendliche kaum noch lesen. Eine neue Studie zeigt jetzt etwas anderes: Im letzten Jahr hat fast die Hälfte der 14- bis 19-Jährigen mindestens ein Buch pro Monat gelesen – deutlich mehr als vor zehn Jahren. Ein Grund dafür sind soziale Netzwerke: Dort empfehlen junge Leute einander Romane und sprechen in kurzen Videos über ihre Lieblingsbücher. Besonders beliebt sind Fantasy- und Liebesromane." },
          { n: 5, a: "c", src: "… holen Ehrenamtliche jeden Morgen das Brot und die Brötchen vom Vortag ab und bringen sie zur Tafel und in eine Obdachlosenunterkunft.",
            text: "Was am Abend in der Bäckerei Hoffmann übrig bleibt, landet nicht mehr im Müll. Seit Oktober holen Ehrenamtliche jeden Morgen das Brot und die Brötchen vom Vortag ab und bringen sie zur Tafel und in eine Obdachlosenunterkunft. „Das Brot ist ja noch gut, nur nicht mehr ganz frisch“, sagt Bäckermeister Hoffmann. Inzwischen machen auch zwei andere Bäckereien im Viertel mit." }
        ] },

      { ...L[1],
        title: "Ein Jahr ohne Auto – geht das?",
        text: "Als das alte Auto von Familie Brandt im letzten Winter kaputtging, mussten Jan und Melanie Brandt eine Entscheidung treffen: ein neues kaufen oder es ohne Auto versuchen? „Ein neues Auto war uns einfach zu teuer“, erzählt Melanie Brandt. „Also haben wir gesagt: Wir probieren es ein Jahr lang ohne.“\n\nDie Familie wohnt am Stadtrand, die beiden Kinder sind sieben und zehn Jahre alt. Am Anfang war vieles schwierig. Der Weg zum Supermarkt dauerte plötzlich doppelt so lang, und beim Großeinkauf am Samstag fehlte der Kofferraum. Die Lösung: ein Lastenrad. Damit transportiert Jan Brandt heute Getränkekisten, Einkäufe und manchmal sogar die Kinder.\n\nZur Arbeit fahren beide mit der S-Bahn. „Ich brauche jetzt zehn Minuten länger“, sagt Jan Brandt, „aber ich kann im Zug lesen oder einfach aus dem Fenster schauen. Im Stau zu stehen war viel stressiger.“ Für Ausflüge und Besuche bei den Großeltern, die 200 Kilometer entfernt wohnen, leiht sich die Familie ein Auto bei einem Carsharing-Anbieter. Das passiert etwa einmal im Monat.\n\nHaben sie Geld gespart? Melanie Brandt hat alles genau aufgeschrieben. Für Bahntickets und Carsharing hat die Familie im ersten Jahr rund 3.500 Euro ausgegeben. Das alte Auto hatte – mit Versicherung, Benzin und Reparaturen – fast doppelt so viel gekostet.\n\nNicht alles ist besser. Wenn es regnet, haben die Kinder keine Lust auf das Fahrrad, und spontane Fahrten sind schwieriger geworden. Trotzdem will die Familie kein eigenes Auto mehr kaufen. „Wir sind fitter geworden und verbringen mehr Zeit draußen“, sagt Melanie Brandt. „Das möchten wir nicht mehr hergeben.“",
        items: [
          { n: 6, q: "Warum hat Familie Brandt kein neues Auto gekauft?", a: "b",
            opts: ["Sie wollte etwas für die Umwelt tun.", "Ein neues Auto war ihr zu teuer.", "Sie hatte keinen Parkplatz mehr."],
            src: "„Ein neues Auto war uns einfach zu teuer.“" },
          { n: 7, q: "Das Lastenrad benutzt die Familie vor allem, …", a: "c",
            opts: ["um zur Arbeit zu fahren.", "um die Großeltern zu besuchen.", "um Einkäufe zu transportieren."],
            src: "Damit transportiert Jan Brandt heute Getränkekisten, Einkäufe und manchmal sogar die Kinder. (Zur Arbeit: S-Bahn; zu den Großeltern: Carsharing)" },
          { n: 8, q: "Die Fahrt zur Arbeit mit der S-Bahn findet Jan Brandt …", a: "a",
            opts: ["angenehmer als früher mit dem Auto.", "zu lang und anstrengend.", "schneller als mit dem Auto."],
            src: "„Ich brauche jetzt zehn Minuten länger, aber ich kann im Zug lesen … Im Stau zu stehen war viel stressiger.“" },
          { n: 9, q: "Ein Carsharing-Auto leiht die Familie …", a: "a",
            opts: ["ungefähr einmal im Monat.", "jedes Wochenende.", "nur im Winter."],
            src: "Das passiert etwa einmal im Monat." },
          { n: 10, q: "Nach dem ersten Jahr …", a: "c",
            opts: ["möchte die Familie wieder ein eigenes Auto kaufen.", "hat die Familie mehr Geld ausgegeben als früher.", "möchte die Familie weiter ohne eigenes Auto leben."],
            src: "Trotzdem will die Familie kein eigenes Auto mehr kaufen. (Und sie hat deutlich weniger Geld ausgegeben.)" }
        ] },

      { ...L[2],
        options: [
          ["a", "Saal zu vermieten: bis 40 Personen, mit Küche und Musikanlage – ideal für Geburtstage und Familienfeste."],
          ["b", "Zuverlässige Putzhilfe hat noch Zeit: zweimal pro Woche, Wohnungen und Büros, Referenzen vorhanden."],
          ["c", "Kletterhalle Nordwand: Familienkurse am Samstag und Sonntag – Kinder ab 5 Jahren klettern zusammen mit ihren Eltern. Ausrüstung kann man leihen."],
          ["d", "Italienisch für Anfänger: Volkshochschule, dienstags 19–20:30 Uhr, Kursbeginn am 3. März."],
          ["e", "Handy-Doktor: Displaytausch für alle gängigen Modelle – oft in nur einer Stunde! Ohne Termin."],
          ["f", "Babyschwimmen: für Babys von 3 bis 18 Monaten mit Mama oder Papa, Hallenbad Süd, freitags."],
          ["g", "Café Morgenrot: sonntags Frühstücksbuffet von 9 bis 14 Uhr – mit vielen vegetarischen und veganen Speisen."],
          ["h", "Büro aufgelöst! Gebrauchte Schreibtische, Stühle und Regale – Schreibtische schon ab 40 €. Abholung Mo–Fr."],
          ["i", "Restaurant Adria sucht Servicekräfte für Abende und Wochenenden."],
          ["j", "Schwimmen lernen ist nie zu spät: Kurse für erwachsene Nichtschwimmer, kleine Gruppen, Hallenbad Süd, mittwochs 19 Uhr."],
          ["k", "Autowerkstatt Müller: Inspektion, Reifenwechsel und Reparaturen aller Marken."],
          ["l", "Bäckerei Sonnenkorn sucht Verkäufer/in in Teilzeit, Montag bis Freitag 6–12 Uhr. Erfahrung nicht nötig."]
        ],
        items: [
          { n: 11, a: "c", text: "Ein Kollege möchte am Wochenende mit seinen Kindern (6 und 9 Jahre) etwas Sportliches unternehmen.", src: "c: Familienkurse am Samstag und Sonntag – Kinder ab 5 Jahren" },
          { n: 12, a: "h", text: "Sie brauchen einen Schreibtisch für Ihr Homeoffice. Er soll nicht viel kosten.", src: "h: Gebrauchte Schreibtische … schon ab 40 €" },
          { n: 13, a: "j", text: "Ihre Freundin ist 35 Jahre alt und kann noch gar nicht schwimmen. Sie möchte es endlich lernen.", src: "j: Kurse für erwachsene Nichtschwimmer (f ist nur für Babys)" },
          { n: 14, a: "e", text: "Das Display Ihres Smartphones ist kaputt. Sie möchten es schnell reparieren lassen.", src: "e: Displaytausch … oft in nur einer Stunde" },
          { n: 15, a: "l", text: "Ein Bekannter sucht eine Teilzeitstelle im Verkauf, aber nur am Vormittag.", src: "l: Verkäufer/in in Teilzeit, 6–12 Uhr (i: abends und am Wochenende, kein Verkauf)" },
          { n: 16, a: "a", text: "Sie möchten Ihren Geburtstag mit 30 Gästen feiern und suchen einen Raum.", src: "a: Saal … bis 40 Personen … ideal für Geburtstage" },
          { n: 17, a: "x", text: "Ihre Mutter möchte am Abend Spanisch lernen.", src: "x: d ist ein Italienischkurs." },
          { n: 18, a: "b", text: "Sie suchen jemanden, der zweimal pro Woche Ihre Wohnung putzt.", src: "b: Putzhilfe … zweimal pro Woche, Wohnungen und Büros" },
          { n: 19, a: "x", text: "Ihr Nachbar möchte ein gebrauchtes Auto kaufen.", src: "x: k repariert Autos, verkauft aber keine." },
          { n: 20, a: "g", text: "Sie möchten am Sonntag in einem Café frühstücken. Ihr Freund isst vegan.", src: "g: sonntags Frühstücksbuffet … mit vielen … veganen Speisen" }
        ] },

      { ...L[3],
        text: "Sehr geehrte Frau Schulz,\n\nich wohne seit drei Jahren in Ihrem Haus in der Gartenstraße 8 und schreibe Ihnen heute, {21} es in meiner Wohnung ein Problem gibt. Seit letzter Woche funktioniert die Heizung im Schlafzimmer nicht mehr. Ich habe schon versucht, sie selbst {22} reparieren, aber leider ohne Erfolg. Da es nachts schon sehr kalt ist, {23} ich Sie bitten, so schnell wie möglich einen Handwerker zu schicken.\n\nIch arbeite von Montag bis Freitag {24} 8 bis 16 Uhr. Am besten passt es mir deshalb am späten Nachmittag oder am Samstagvormittag. Wenn der Handwerker vormittags kommen muss, kann ihm meine Nachbarin die Tür öffnen: Frau Öztürk, {25} im Erdgeschoss wohnt, hat einen Schlüssel für meine Wohnung.\n\nAußerdem ist im Treppenhaus seit einigen Tagen die Lampe im zweiten Stock kaputt. Abends ist es dort so dunkel, {26} man kaum etwas sieht. Könnten Sie sich bitte auch {27} kümmern?\n\nIch {28} mich über eine schnelle Antwort. Vielen Dank {29} Ihre Hilfe!\n\nMit freundlichen {30}\nPaolo Ricci",
        items: [
          { n: 21, opts: ["denn", "weil", "deshalb"], a: "b", src: "…, weil es in meiner Wohnung ein Problem gibt. (Verb am Ende → Nebensatz)" },
          { n: 22, opts: ["um", "zu", "für"], a: "b", src: "versuchen, etwas zu machen (zu + Infinitiv)" },
          { n: 23, opts: ["möchte", "möchten", "mochte"], a: "a", src: "…, möchte ich Sie bitten (ich → möchte; der Nebensatz steht auf Position 1, das Verb auf Position 2)" },
          { n: 24, opts: ["zwischen", "von", "um"], a: "b", src: "von 8 bis 16 Uhr (zwischen geht nur mit und: zwischen 8 und 16 Uhr)" },
          { n: 25, opts: ["der", "deren", "die"], a: "c", src: "Frau Öztürk → die (Relativpronomen, Nominativ feminin)" },
          { n: 26, opts: ["dass", "damit", "ob"], a: "a", src: "so dunkel, dass … (Folge)" },
          { n: 27, opts: ["damit", "darum", "davon"], a: "b", src: "sich kümmern um → darum" },
          { n: 28, opts: ["freut", "freuen", "freue"], a: "c", src: "ich freue mich über …" },
          { n: 29, opts: ["über", "für", "auf"], a: "b", src: "Danke für …" },
          { n: 30, opts: ["Grüßen", "Grüße", "Gruß"], a: "a", src: "Mit freundlichen Grüßen (mit + Dativ Plural)" }
        ] },

      { ...L[4],
        options: [
          ["a", "auf"], ["b", "bezahlen"], ["c", "dann"], ["d", "Frage"], ["e", "helfen"],
          ["f", "in"], ["g", "mitbringen"], ["h", "nötig"], ["i", "ob"], ["j", "seit"],
          ["k", "Spende"], ["l", "Thema"], ["m", "von"], ["n", "wenn"], ["o", "zwischen"]
        ],
        text: "Sprachcafé im Stadtteilzentrum\n\nSie möchten Ihr Deutsch verbessern und dabei neue Leute kennenlernen? {31} sind Sie im Sprachcafé genau richtig! Jeden Donnerstag treffen sich hier Menschen aus vielen Ländern, um {32} lockerer Atmosphäre Deutsch zu sprechen. Ehrenamtliche Helferinnen und Helfer, die Deutsch als Muttersprache sprechen, sitzen mit an den Tischen und {33} bei Fragen.\n\nEine Anmeldung ist nicht {34}. Sie können einfach vorbeikommen, auch wenn Sie erst seit kurzer Zeit Deutsch lernen. Die Teilnahme ist kostenlos; nur für Kaffee und Kuchen bitten wir um eine kleine {35}.\n\nJede Woche gibt es ein anderes {36}: Mal sprechen wir über Reisen, mal über Essen oder über Feste in den Heimatländern der Teilnehmer. Wer möchte, kann auch eigene Ideen {37}.\n\nDas Sprachcafé findet {38} 18 bis 20 Uhr im ersten Stock statt. {39} Sie Fragen haben, schreiben Sie uns einfach eine E-Mail.\n\nWir freuen uns {40} Sie!",
        items: [
          { n: 31, a: "c", src: "Dann sind Sie … genau richtig! (Verb auf Position 2)" },
          { n: 32, a: "f", src: "in lockerer Atmosphäre" },
          { n: 33, a: "e", src: "… sitzen mit an den Tischen und helfen bei Fragen." },
          { n: 34, a: "h", src: "Eine Anmeldung ist nicht nötig." },
          { n: 35, a: "k", src: "um eine kleine Spende bitten (die Spende)" },
          { n: 36, a: "l", src: "ein anderes Thema (das Thema; „Frage“ ist feminin)" },
          { n: 37, a: "g", src: "eigene Ideen mitbringen" },
          { n: 38, a: "m", src: "von 18 bis 20 Uhr" },
          { n: 39, a: "n", src: "Wenn Sie Fragen haben, … (Bedingung; Verb am Ende)" },
          { n: 40, a: "a", src: "sich freuen auf → Wir freuen uns auf Sie!" }
        ] }
    ] },

    hoeren: { ...M1.hoeren, teile: [

      { ...H[0],
        items: [
          { n: 41, a: "r", q: "Das Bürgeramt ist morgen wieder geöffnet.",
            audio: [["A", "Heute Nachmittag bleibt das Rathaus wegen einer Veranstaltung geschlossen. Termine im Bürgeramt finden morgen ab 8 Uhr wieder ganz normal statt."]],
            src: "Termine im Bürgeramt finden morgen ab 8 Uhr wieder ganz normal statt." },
          { n: 42, a: "f", q: "Am Samstag regnet es.",
            audio: [["B", "Und nun das Wetter: Am Wochenende wird es sonnig und warm, mit Temperaturen bis 24 Grad. Erst am Montag ziehen von Westen Wolken auf, dann kann es auch regnen."]],
            src: "Am Wochenende wird es sonnig und warm … Erst am Montag … kann es auch regnen." },
          { n: 43, a: "f", q: "Besucher können den jungen Elefanten ab sofort sehen.",
            audio: [["A", "Der Zoo hat Nachwuchs: Im Elefantenhaus wurde in der Nacht zu Dienstag ein kleiner Elefant geboren. Besucher können das Jungtier aber erst in zwei Wochen sehen, weil es noch Ruhe braucht."]],
            src: "Besucher können das Jungtier aber erst in zwei Wochen sehen …" },
          { n: 44, a: "r", q: "Die Bücherei sucht Menschen, die Kindern vorlesen.",
            audio: [["B", "Die Stadtbücherei sucht Freiwillige, die Kindern am Samstagvormittag Geschichten vorlesen. Wer Interesse hat, meldet sich bitte an der Information im Erdgeschoss."]],
            src: "Die Stadtbücherei sucht Freiwillige, die Kindern … Geschichten vorlesen." },
          { n: 45, a: "r", q: "Die Busse fahren am Sonntagvormittag nicht auf ihrer normalen Strecke.",
            audio: [["A", "Wegen des Stadtlaufs sind am Sonntag von 7 bis 12 Uhr mehrere Straßen in der Innenstadt gesperrt. Autofahrer sollen die Innenstadt umfahren. Die Busse fahren in dieser Zeit mit Umleitungen."]],
            src: "Die Busse fahren in dieser Zeit (7–12 Uhr) mit Umleitungen." }
        ] },

      { ...H[1],
        audio: [
          ["A", "Willkommen bei unserer Sendung „Neu in Deutschland“. Heute ist Tomás Herrera bei uns. Er kommt aus Spanien und arbeitet seit vier Jahren in einem Krankenhaus in Stuttgart, heute als Krankenpfleger. Hallo, Herr Herrera!"],
          ["B", "Hallo, schön, dass ich hier sein darf."],
          ["A", "Warum sind Sie nach Deutschland gekommen?"],
          ["B", "In Spanien habe ich nach meiner Ausbildung lange keine feste Stelle gefunden. Ich hatte immer nur Verträge für ein paar Monate. Ein Freund von mir hat schon in Deutschland gearbeitet, und er hat gesagt: Hier suchen sie dringend Pflegekräfte. Da habe ich mich beworben."],
          ["A", "Konnten Sie damals schon Deutsch?"],
          ["B", "Ja, aber noch nicht sehr gut. In der Schule hatte ich Englisch und Französisch. Mit Deutsch habe ich erst mit 27 angefangen, in einem Intensivkurs in Madrid. Der Kurs war acht Monate lang, jeden Tag vier Stunden. Das war sehr hart, aber auch gut."],
          ["A", "Und wie war der Anfang im Krankenhaus?"],
          ["B", "Ehrlich gesagt: schwierig. Die Kollegen haben schnell gesprochen, und viele Patienten sprechen Dialekt. Am Telefon habe ich am Anfang fast nichts verstanden. Aber meine Kollegen waren sehr geduldig und haben mir viel erklärt."],
          ["A", "Mussten Sie Ihre Ausbildung in Deutschland anerkennen lassen?"],
          ["B", "Ja. Ich habe zuerst ein Jahr als Pflegehelfer gearbeitet und weiter Deutsch gelernt. Erst mit dem B2-Zertifikat habe ich die Anerkennung als Pflegefachmann bekommen."],
          ["A", "Was gefällt Ihnen an Ihrer Arbeit hier?"],
          ["B", "Die Arbeit im Team. Und dass man hier viele Weiterbildungen machen kann. Im Moment mache ich gerade eine Weiterbildung für die Intensivstation."],
          ["A", "Und was vermissen Sie?"],
          ["B", "Das Meer natürlich! Und das Essen meiner Mutter. Aber ich fliege zweimal im Jahr nach Hause, im Sommer und an Weihnachten."],
          ["A", "Können Sie sich vorstellen, für immer in Deutschland zu bleiben?"],
          ["B", "Ja, inzwischen schon. Meine Freundin ist Deutsche, und wir sind gerade in eine größere Wohnung gezogen. Im Moment sieht es also so aus, dass ich bleibe."],
          ["A", "Herr Herrera, vielen Dank für das Gespräch."]
        ],
        items: [
          { n: 46, a: "r", q: "Herr Herrera arbeitet seit vier Jahren in einem deutschen Krankenhaus.", src: "… arbeitet seit vier Jahren in einem Krankenhaus in Stuttgart …" },
          { n: 47, a: "f", q: "In Spanien hatte er nach der Ausbildung sofort eine feste Stelle.", src: "… lange keine feste Stelle gefunden. Ich hatte immer nur Verträge für ein paar Monate." },
          { n: 48, a: "r", q: "Ein Freund hat ihm von der Arbeit in Deutschland erzählt.", src: "Ein Freund … hat gesagt: Hier suchen sie dringend Pflegekräfte." },
          { n: 49, a: "f", q: "Deutsch hat er schon in der Schule gelernt.", src: "In der Schule hatte ich Englisch und Französisch. Mit Deutsch habe ich erst mit 27 angefangen …" },
          { n: 50, a: "r", q: "Am Anfang war das Telefonieren für ihn besonders schwer.", src: "Am Telefon habe ich am Anfang fast nichts verstanden." },
          { n: 51, a: "f", q: "Seine Kollegen hatten wenig Geduld mit ihm.", src: "… meine Kollegen waren sehr geduldig …" },
          { n: 52, a: "r", q: "Für die Anerkennung brauchte er ein Sprachzertifikat.", src: "Erst mit dem B2-Zertifikat habe ich die Anerkennung … bekommen." },
          { n: 53, a: "r", q: "Zurzeit macht er eine Weiterbildung.", src: "Im Moment mache ich gerade eine Weiterbildung für die Intensivstation." },
          { n: 54, a: "f", q: "Er fliegt nur an Weihnachten nach Spanien.", src: "… zweimal im Jahr nach Hause, im Sommer und an Weihnachten." },
          { n: 55, a: "f", q: "Er möchte bald nach Spanien zurückgehen.", src: "Im Moment sieht es also so aus, dass ich bleibe." }
        ] },

      { ...H[2],
        items: [
          { n: 56, a: "f", q: "Frau Neumann kann ihr Auto morgen abholen.",
            audio: [["A", "Guten Tag, Frau Neumann, hier ist die Autowerkstatt Becker. Ihr Auto ist fertig. Sie können es heute bis 18 Uhr abholen. Morgen haben wir leider geschlossen."]],
            src: "Sie können es heute bis 18 Uhr abholen. Morgen haben wir leider geschlossen." },
          { n: 57, a: "r", q: "Laufschuhe sind heute billiger.",
            audio: [["B", "Liebe Kundinnen und Kunden, nur heute: In unserer Sportabteilung im dritten Stock bekommen Sie alle Laufschuhe 30 Prozent günstiger."]],
            src: "… alle Laufschuhe 30 Prozent günstiger." },
          { n: 58, a: "r", q: "Das Boarding beginnt später als geplant.",
            audio: [["A", "Information zu Flug 482 nach Rom: Der Flug hat etwa 40 Minuten Verspätung. Das Boarding beginnt nicht um 10 Uhr 15, sondern erst um 10 Uhr 55 an Gate B 12."]],
            src: "Das Boarding beginnt nicht um 10 Uhr 15, sondern erst um 10 Uhr 55." },
          { n: 59, a: "f", q: "In dringenden Fällen soll man während des Urlaubs den Notruf wählen.",
            audio: [["B", "Sie sind verbunden mit der Praxis Doktor Seidel. Unsere Praxis ist vom 2. bis zum 13. August wegen Urlaub geschlossen. In dringenden Fällen wenden Sie sich bitte an Doktor Kaiser in der Bahnhofstraße 5."]],
            src: "In dringenden Fällen wenden Sie sich bitte an Doktor Kaiser …" },
          { n: 60, a: "r", q: "Mia bittet Sara, sich um ihre Katze zu kümmern.",
            audio: [["B", "Hallo Sara, hier ist Mia. Kannst du morgen und übermorgen meine Katze füttern? Ich muss für zwei Tage nach Köln. Den Schlüssel bekommst du bei Frau Wolf im Erdgeschoss. Danke dir!"]],
            src: "Kannst du morgen und übermorgen meine Katze füttern?" }
        ] }
    ] },

    schreiben: { ...M1.schreiben, tasks: [
      { id: "A", label: { it: "Lettera personale (du)", en: "Personal letter (du)" },
        input: "Sie haben diese E-Mail von Ihrer Freundin Anna bekommen:\n\n„Ich habe eine wunderbare Nachricht: Thomas und ich heiraten am 12. Juni! Wir feiern im Garten meiner Eltern und würden uns sehr freuen, wenn du kommst. Bitte sag mir bis Ende April Bescheid. Deine Anna“\n\nSie können leider nicht kommen.",
        points: [
          "Glückwunsch zur Hochzeit",
          "Grund, warum Sie nicht kommen können",
          "Vorschlag für ein Treffen nach der Hochzeit",
          "Was sich das Paar wünscht"
        ],
        model: "Liebe Anna,\n\nvielen Dank für deine E-Mail und die Einladung! Herzlichen Glückwunsch, ich freue mich so für euch beide!\n\nLeider kann ich am 12. Juni nicht kommen. Mein Bruder heiratet nämlich am gleichen Tag in Italien, und ich fliege schon am Donnerstag nach Hause. Das tut mir wirklich leid.\n\nAber ich möchte natürlich trotzdem mit euch feiern. Wie wäre es, wenn wir uns nach eurer Hochzeitsreise treffen? Ich lade euch zum Essen ein, und ihr erzählt mir alles und zeigt mir die Fotos.\n\nSag mal, habt ihr einen besonderen Wunsch? Braucht ihr etwas für die Wohnung, oder sammelt ihr lieber Geld für die Reise? Schreib es mir einfach.\n\nIch wünsche euch einen wunderschönen Tag!\n\nLiebe Grüße\ndein Marco" },
      { id: "B", label: { it: "Reclamo semiformale (Sie)", en: "Semi-formal complaint (Sie)" },
        input: "Sie haben beim Reisebüro Sonnenschein eine Wochenendreise nach Hamburg gebucht. Im Prospekt stand: „Zentrales Hotel mit Frühstück – Stadtrundfahrt inklusive“. Leider war vieles anders. Schreiben Sie an das Reisebüro.",
        points: [
          "Was Sie gebucht haben",
          "Was nicht in Ordnung war",
          "Was Sie jetzt erwarten",
          "Bis wann Sie eine Antwort möchten"
        ],
        model: "Sehr geehrte Damen und Herren,\n\nich habe bei Ihnen eine Wochenendreise nach Hamburg vom 3. bis 5. Mai gebucht. Leider war ich mit der Reise gar nicht zufrieden.\n\nIn Ihrem Prospekt stand, dass das Hotel zentral liegt. Tatsächlich brauchte ich mit dem Bus 40 Minuten bis ins Zentrum. Außerdem gab es nur am ersten Tag Frühstück, weil die Küche danach geschlossen war. Die Stadtrundfahrt hat gar nicht stattgefunden, und niemand konnte mir sagen, warum.\n\nDeshalb erwarte ich, dass Sie mir einen Teil des Preises zurückzahlen, mindestens 100 Euro.\n\nBitte antworten Sie mir bis zum 31. Mai. Sonst muss ich mich an die Verbraucherzentrale wenden.\n\nMit freundlichen Grüßen\nMarco Rossi" }
    ] },

    sprechen: { ...M1.sprechen, teile: [
      { ...M1.sprechen.teile[0],
        list: ["Name", "Herkunft", "Wohnort und Wohnung", "Familie", "Arbeit oder Studium", "Deutsch lernen: seit wann? warum?", "Freizeit", "Pläne für die Zukunft"],
        phrases: ["Wo wohnst du genau?", "Wie lange lernst du schon Deutsch?", "Warum lernst du Deutsch?", "Was machst du am Wochenende?", "Was hast du für Pläne?", "Das ist ja interessant! Erzähl mal mehr."],
        model: "Ich heiße Marco, ich bin 31 und komme aus Bologna. Ich lerne seit zwei Jahren Deutsch, weil ich in Berlin arbeiten möchte. Am Wochenende gehe ich gern mit Freunden in den Park oder ins Kino. Mein Plan ist, im nächsten Jahr die B2-Prüfung zu machen. Und du? Wie lange lernst du schon Deutsch?" },
      { ...M1.sprechen.teile[1],
        texts: [
          { label: "Text A", text: "Hunde in der Stadt: Immer mehr Stadtbewohner haben einen Hund. In vielen Städten gibt es inzwischen spezielle Hundewiesen, wo die Tiere ohne Leine laufen dürfen. Viele Hundebesitzer sagen, dass ihr Tier ihnen hilft, gesund und aktiv zu bleiben." },
          { label: "Text B", text: "Ärger um Hunde: Nicht alle freuen sich über die vielen Hunde. In Umfragen beschweren sich Anwohner über Lärm und Hundekot auf den Gehwegen. Außerdem finden Mieter mit Hund oft nur schwer eine Wohnung, weil viele Vermieter lieber an Mieter ohne Tiere vermieten." }
        ],
        phrases: ["In meinem Text steht, dass …", "Es geht um das Thema …", "Bei uns in Italien …", "Ich selbst habe gute / schlechte Erfahrungen mit … gemacht.", "Ich finde, dass …", "Das sehe ich anders, weil …"],
        model: "In meinem Text geht es um Hunde in der Stadt. Immer mehr Menschen haben einen Hund, und es gibt jetzt spezielle Wiesen, wo die Hunde frei laufen dürfen. Die Besitzer sagen, dass sie durch den Hund aktiver sind. In Italien ist es ähnlich: Bei uns haben auch viele Leute in der Stadt einen Hund. Ich arbeite selbst mit Hunden, deshalb finde ich das natürlich gut. Aber die Besitzer müssen sich auch an die Regeln halten. Was steht in deinem Text?" },
      { ...M1.sprechen.teile[2],
        task: "Ihr Deutschkurs möchte am Wochenende zusammen einen Ausflug machen. Sie und Ihr Partner sollen den Ausflug planen. Machen Sie Vorschläge, reagieren Sie auf die Vorschläge Ihres Partners und einigen Sie sich.",
        list: ["Wohin?", "Wann und wo treffen?", "Wie hinfahren?", "Essen?", "Was kostet es?"],
        phrases: ["Was hältst du von …?", "Wir könnten doch …", "Gute Idee, und außerdem …", "Das ist mir ein bisschen zu teuer.", "Lieber nicht, weil …", "Dann sind wir uns einig: …"],
        model: "A: Was hältst du von einem Ausflug an einen See?\nB: Gute Idee! Wir könnten doch an den Wannsee fahren. Das geht mit der S-Bahn.\nA: Prima, dann brauchen wir kein Auto. Wann sollen wir uns treffen?\nB: Vielleicht am Samstag um zehn Uhr am Hauptbahnhof?\nA: Zehn ist mir ein bisschen früh. Lieber um elf?\nB: Einverstanden. Und was machen wir mit dem Essen?\nA: Jeder bringt etwas für ein Picknick mit. Dann kostet es fast nichts, nur das Ticket.\nB: Super. Dann sind wir uns einig: Samstag, elf Uhr, Hauptbahnhof, mit Picknick!" }
    ] }
  };
})();
