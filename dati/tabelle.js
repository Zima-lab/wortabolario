/* Wortabolario — TABELLE DI GRAMMATICA (casi × genere, come nel Bignami)
   Chiave = titolo "de" della scheda di GRAMMATICA a cui appartiene la tabella.
   La scheda mostra prima le tabelle, poi le sue regole (rows) e la sua nota.
   Celle: {x} = forma che cambia (evidenziata) · *x* = grassetto. */

const GRAM_TABLES = {
  "Der/die/das — Artikel nach Kasus": {
    tables: [
      {cols: [["m","der · m"],["f","die · f"],["n","das · n"],["pl","die · Pl"]],
       rows: [
        ["Nominativ","der","die","das","die"],
        ["Akkusativ","{den}","die","das","die"],
        ["Dativ","{dem}","{der}","{dem}","{den} …-n"],
        ["Genitiv","{des} …-s","{der}","{des} …-s","{der}"]]}]
  },
  "Personalpronomen nei casi": {
    tables: [
      {cols: [["x","ich"],["x","du"],["m","er"],["f","sie"],["n","es"],["x","wir"],["x","ihr"],["pl","sie"],["x","Sie"]],
       rows: [
        ["Nominativ","ich","du","er","sie","es","wir","ihr","sie","Sie"],
        ["Akkusativ","{mich}","{dich}","{ihn}","sie","es","uns","euch","sie","Sie"],
        ["Dativ","{mir}","{dir}","{ihm}","{ihr}","{ihm}","uns","euch","{ihnen}","{Ihnen}"],
        [["Reflexiv (Akk.)","Reflexive (Akk.)"],"mich","dich","{sich}","{sich}","{sich}","uns","euch","{sich}","{sich}"],
        [["Possessiv","Possessive"],"mein","dein","sein","ihr","sein","unser","euer","ihr","Ihr"]]}]
  },
  "Possessivpronomen": {
    tables: [
      {cols: [["m","der · m"],["f","die · f"],["n","das · n"],["pl","die · Pl"]],
       rows: [
        ["Nominativ","mein","mein{e}","mein","mein{e}"],
        ["Akkusativ","mein{en}","mein{e}","mein","mein{e}"],
        ["Dativ","mein{em}","mein{er}","mein{em}","mein{en}"],
        ["Genitiv","mein{es}","mein{er}","mein{es}","mein{er}"]]},
      {caption: ["Chi possiede → quale possessivo","Who owns → which possessive"],
       head: ["",""],
       cols: [["x","ich"],["x","du"],["m","er"],["f","sie"],["n","es"],["x","wir"],["x","ihr"],["pl","sie"],["x","Sie"]],
       rows: [
        [["Possessiv","Possessive"],"mein","dein","sein","ihr","sein","unser","euer","ihr","Ihr"]]}]
  },
  "Relativpronomen": {
    tables: [
      {cols: [["m","der · m"],["f","die · f"],["n","das · n"],["pl","die · Pl"]],
       rows: [
        ["Nominativ","der","die","das","die"],
        ["Akkusativ","den","die","das","die"],
        ["Dativ","dem","der","dem","{denen}"],
        ["Genitiv","{dessen}","{deren}","{dessen}","{deren}"]]}]
  },
  "Reflexivpronomen (Akk./Dat.)": {
    tables: [
      {cols: [["x","ich"],["x","du"],["m","er · sie · es"],["x","wir"],["x","ihr"],["pl","sie · Sie"]],
       rows: [
        ["Nominativ","ich","du","er / sie / es","wir","ihr","sie / Sie"],
        ["Akkusativ","mich","dich","{sich}","uns","euch","{sich}"],
        ["Dativ","mir","dir","{sich}","uns","euch","{sich}"]]}]
  },
  "Interrogativpronomen": {
    tables: [
      {caption: ["welcher / welche / welches — quale?","welcher / welche / welches — which?"],
       cols: [["m","der · m"],["f","die · f"],["n","das · n"],["pl","die · Pl"]],
       rows: [
        ["Nominativ","welcher","welche","welches","welche"],
        ["Akkusativ","{welchen}","welche","welches","welche"],
        ["Dativ","{welchem}","{welcher}","{welchem}","{welchen}"],
        ["Genitiv","{welches}","{welcher}","{welches}","{welcher}"]]}]
  },
  "Adjektivdeklination — le desinenze": {
    tables: [
      {caption: ["Dopo der / die / das — solo -e o -en","After der / die / das — only -e or -en"],
       cols: [["m","der · m"],["f","die · f"],["n","das · n"],["pl","die · Pl"]],
       rows: [
        ["Nominativ","-e","-e","-e","-en"],
        ["Akkusativ","{-en}","-e","-e","-en"],
        ["Dativ","{-en}","{-en}","{-en}","-en"]]},
      {caption: ["Dopo ein / kein / mein — l'aggettivo dice il genere","After ein / kein / mein — the adjective shows the gender"],
       cols: [["m","ein · m"],["f","eine · f"],["n","ein · n"],["pl","meine · Pl"]],
       rows: [
        ["Nominativ","{-er}","-e","{-es}","-en"],
        ["Akkusativ","-en","-e","{-es}","-en"],
        ["Dativ","-en","-en","-en","-en"]]}]
  },
  "Indefinitpronomen": {
    tables: [
      {cols: [["m","der · m"],["f","die · f"],["n","das · n"],["pl","die · Pl"]],
       rows: [
        ["Nominativ","einer / keiner","eine / keine","eins / keins","welche / keine"],
        ["Akkusativ","{einen} / {keinen}","eine / keine","eins / keins","welche / keine"],
        ["Dativ","{einem} / {keinem}","{einer} / {keiner}","{einem} / {keinem}","{welchen} / {keinen}"]]}]
  },
  "Adjektivendungen im Genitiv": {
    tables: [
      {head: ["Genitiv con…","Genitiv with…"],
       cols: [["m","der · m"],["f","die · f"],["n","das · n"],["pl","die · Pl"]],
       rows: [
        [["articolo det.","definite article"],"des klein{en} Jungen","der klein{en} Tasse","des klein{en} Hauses","der klein{en} Tassen"],
        [["ein- / mein- / kein-","ein- / mein- / kein-"],"eines gut{en} Freundes","einer gut{en} Idee","eines neu{en} Projekts","meiner alt{en} Freunde"]]}]
  },
  "Adjektive ohne Artikel — Nullartikel": {
    tables: [
      {cols: [["m","der · m"],["f","die · f"],["n","das · n"],["pl","die · Pl"]],
       rows: [
        ["Nominativ","{-er}","-e","{-es}","-e"],
        ["Akkusativ","{-en}","-e","{-es}","-e"],
        ["Dativ","{-em}","{-er}","{-em}","{-en}"],
        ["Genitiv","{-en}","{-er}","{-en}","{-er}"]]}]
  },
  "Adjektivdeklination + Komparativ/Superlativ": {
    tables: [
      {caption: ["Dopo der / die / das / dies-","After der / die / das / dies-"],
       cols: [["m","der · m"],["f","die · f"],["n","das · n"],["pl","die · Pl"]],
       rows: [
        ["Nominativ","-e","-e","-e","-en"],
        ["Akkusativ","{-en}","-e","-e","-en"],
        ["Dativ","{-en}","{-en}","{-en}","-en"]]},
      {caption: ["Dopo ein- / kein- / mein-","After ein- / kein- / mein-"],
       cols: [["m","ein · m"],["f","eine · f"],["n","ein · n"],["pl","meine · Pl"]],
       rows: [
        ["Nominativ","{-er}","-e","{-es}","-en"],
        ["Akkusativ","-en","-e","{-es}","-en"],
        ["Dativ","-en","-en","-en","-en"]]}]
  },
  "Relativsätze: Präposition, wo, was": {
    tables: [
      {caption: ["Il relativo dopo la preposizione","The relative pronoun after a preposition"],
       cols: [["m","der · m"],["f","die · f"],["n","das · n"],["pl","die · Pl"]],
       rows: [
        ["Akkusativ","den","die","das","die"],
        ["Dativ","dem","der","dem","{denen}"]]}]
  },
  "n-Deklination": {
    tables: [
      {cols: [["m","der Student"],["m","ein Student"],["m","der Kollege"],["pl","Plural"]],
       rows: [
        ["Nominativ","der Student","ein Student","der Kollege","die Student{en}"],
        ["Akkusativ","den Student{en}","einen Student{en}","den Kolleg{en}","die Student{en}"],
        ["Dativ","dem Student{en}","einem Student{en}","dem Kolleg{en}","den Student{en}"],
        ["Genitiv","des Student{en}","eines Student{en}","des Kolleg{en}","der Student{en}"]]}]
  },
  "ein / kein — Artikel nach Kasus": {
    tables: [
      {cols: [["m","der · m"],["f","die · f"],["n","das · n"],["pl","die · Pl"]],
       rows: [
        ["Nominativ","ein / kein","eine / keine","ein / kein","— / keine"],
        ["Akkusativ","{einen} / {keinen}","eine / keine","ein / kein","— / keine"],
        ["Dativ","{einem} / {keinem}","{einer} / {keiner}","{einem} / {keinem}","— / {keinen}"],
        ["Genitiv","{eines} / {keines}","{einer} / {keiner}","{eines} / {keines}","— / {keiner}"]]}]
  },
  "der, die oder das? — il genere del nome": {
    tables: [
      {head: ["Regola","Rule"],
       cols: [["m","der"],["f","die"],["n","das"]],
       rows: [
        [["Persone","People"],"der Mann, der Lehrer","die Frau, die Lehrer{in}","das Kind, das Baby"],
        [["Desinenze","Endings"],"-ig · -ling · -ismus · -ant","-ung · -heit · -keit · -schaft · -ion · -e","-chen · -lein · -ment · -um"],
        [["Altro","Other"],"giorni, mesi, meteo","fiori, frutti","infinito come nome"]]}]
  },
  "Präposition + Artikel — am, im, ins, zum, zur": {
    tables: [
      {head: ["",""],
       cols: [["m","+ dem (Dat. m/n)"],["f","+ der (Dat. f)"],["n","+ das (Akk. n)"]],
       rows: [
        [["an","an"],"an dem → *am*","—","an das → *ans*"],
        [["in","in"],"in dem → *im*","—","in das → *ins*"],
        [["bei","bei"],"bei dem → *beim*","—","—"],
        [["von","von"],"von dem → *vom*","—","—"],
        [["zu","zu"],"zu dem → *zum*","zu der → *zur*","—"]]}]
  },
  "Modalverben — Präsens und Präteritum": {
    tables: [
      {caption: ["Präsens","Präsens"],
       head: ["",""],
       cols: [["x","können"],["x","dürfen"],["x","müssen"],["x","sollen"],["x","wollen"],["pl","möchten"],["x","mögen"]],
       rows: [
        [["ich","ich"],"{kann}","{darf}","{muss}","{soll}","{will}","möchte","{mag}"],
        [["du","du"],"kannst","darfst","musst","sollst","willst","möchtest","magst"],
        [["er/sie/es","er/sie/es"],"{kann}","{darf}","{muss}","{soll}","{will}","möchte","{mag}"],
        [["wir","wir"],"können","dürfen","müssen","sollen","wollen","möchten","mögen"],
        [["ihr","ihr"],"könnt","dürft","müsst","sollt","wollt","möchtet","mögt"],
        [["sie/Sie","sie/Sie"],"können","dürfen","müssen","sollen","wollen","möchten","mögen"]]},
      {caption: ["Präteritum · Partizip II · Konjunktiv II","Präteritum · Partizip II · Konjunktiv II"],
       head: ["",""],
       cols: [["x","können"],["x","dürfen"],["x","müssen"],["x","sollen"],["x","wollen"],["pl","möchten"],["x","mögen"]],
       rows: [
        [["ich / er","ich / er"],"konnte","durfte","musste","sollte","wollte","→ wollte","mochte"],
        [["du","du"],"konntest","durftest","musstest","solltest","wolltest","→ wolltest","mochtest"],
        [["wir / sie","wir / sie"],"konnten","durften","mussten","sollten","wollten","→ wollten","mochten"],
        [["ihr","ihr"],"konntet","durftet","musstet","solltet","wolltet","→ wolltet","mochtet"],
        [["Partizip II","Partizip II"],"gekonnt","gedurft","gemusst","gesollt","gewollt","—","gemocht"],
        [["Konjunktiv II","Konjunktiv II"],"{könnte}","{dürfte}","{müsste}","sollte","wollte","—","{möchte}"]]}]
  },
  "Der Plural — come si forma il plurale": {
    tables: [
      {head: ["Singolare","Singular"],
       cols: [["m","der · m"],["f","die · f"],["n","das · n"],["pl","Plural"]],
       rows: [
        [["-e","-e"],"der Tag","—","das Jahr","die Tag{e} · die Jahr{e}"],
        [["-(e)n","-(e)n"],"der Junge","die Frau","das Auge","die Frau{en} · die Auge{n}"],
        [["-er","-er"],"der Mann","—","das Kind","die M{ä}nn{er} · die Kind{er}"],
        [["— / ¨","— / ¨"],"der Lehrer","die Mutter","das Mädchen","die Lehrer · die M{ü}tter"],
        [["-s","-s"],"der Park","die Oma","das Auto","die Park{s} · die Auto{s}"]]}]
  }
};
