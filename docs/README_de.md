# templural 🍤

**Schablonenfunktion für pluralabhängige Formatierung.**

[![CI](https://github.com/nlepage/templural/actions/workflows/ci.yml/badge.svg)](https://github.com/nlepage/templural/actions)
[![Version](https://img.shields.io/npm/v/templural.svg)](https://www.npmjs.com/package/templural)
[![Lizenz: Apache-2.0](https://img.shields.io/badge/License-Apache2.0-yellow.svg)](https://spdx.org/licenses/Apache-2.0.html)

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-5-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

[![English README](https://img.shields.io/badge/🇬🇧-README-blue)](https://github.com/nlepage/templural#readme)
[![README en Français](https://img.shields.io/badge/🇫🇷-README-blue)](https://github.com/nlepage/templural/blob/main/docs/README_fr.md)

## Verwendung

### Installation

```sh
yarn add templural
```

oder

```sh
npm install templural
```

### Importieren

```js
import { templural } from 'templural'
```

oder

```js
const { templural } = require('templural')
```

### Wählen Sie locale

templural verwendet [Intl.PluralRules](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules), um zu wissen, welche Pluralregel für eine bestimmte Zahl anzuwenden ist, und die Pluralregeln variieren je nach Sprache. 

Das bedeutet, **dass Sie das von templural** verwendete Gebietsschema einstellen müssen, um korrekte Sätze zu formatieren.

Entweder stellen Sie das Standardgebietsschema ein:

```js
templural.setLocales('fr_BE') // Französisch (Belgien)
```

oder erhalten Sie eine neue Vorlagenfunktion für ein bestimmtes Gebietsschema:

```js
import { forLocales } from 'templural'

const templuralDeCH = forLocales('de_CH') // Deutsch (Schweiz)
```

Für weitere Informationen über die Werte, die von `templural.setLocales()` und `forLocales()` siehe [locales argument](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Intl#locales_argument).

Die folgenden Beispiele sind spezifisch für die deutsche Sprache, siehe [Internationalisierung](#%EF%B8%8F-internationalisierung) für Informationen über andere Sprachen.

### Einem Wort eine vorangehende Zahl zuordnen

```js
templural`Yoann und Valentin hatten ${nbIdeen} interessante Idee{n}`

// nbIdeen = 1  ➔ "Yoann und Valentin hatten 1 interessante Idee"
// nbIdeen = 2  ➔ "Yoann und Valentin hatten 2 interessante Ideen"
// nbIdeen = 42 ➔ "Yoann und Valentin hatten 42 interessante Ideen"
// nbIdeen = 0  ➔ "Yoann und Valentin hatten 0 interessante Ideen"
```

### Beliebiger anderer Werte in den Text einfügen

```js
templural`${benutzerName} hat ${nbPunkten} Punkt{e}`

// benutzerName = "Joe",   nbPunkte = 1    ➔ "Joe hat 1 Punkt"
// benutzerName = "Mario", nbPunkte = 1000 ➔ "Mario hat 1000 Punkte"
```

### Mehrere Wörter der gleichen vorangehenden Zahl zuordnen

```js
templural`Ich hatte nur ${nbBiere} Bier{e}, Liebling{e}, ich schwöre{n}`

// nbBiere = 1 ➔ "Ich hatte nur 1 Bier, Liebling, ich schwöre"
// nbBiere = 2 ➔ "Ich hatte nur 2 Biere, Lieblinge, ich schwören"
// nbBiere = 6 ➔ "Ich hatte nur 6 Biere, Lieblinge, ich schwören"
```

### Mehrere Wörter jeweils einer anderen vorangehenden Zahl zuordnen

```js
templural`Ich habe ${nbKarotten} Karotte{n} und ${nbKartoffeln} Kartoffel{n} gekauft`

// nbKarotten = 1, nbKartoffeln = 1 ➔ "Ich habe 1 Karotte und 1 Kartoffel gekauft."
// nbKarotten = 1, nbKartoffeln = 3 ➔ "Ich habe 1 Karotte und 3 Kartoffeln gekauft."
// nbKarotten = 2, nbKartoffeln = 1 ➔ "Ich habe 2 Karotten und 1 Kartoffel gekauft."
// nbKarotten = 2, nbKartoffeln = 3 ➔ "Ich habe 2 Karotten und 3 Kartoffeln gekauft."
```

### Wörter mit einer anderen Form im Singular und Plural

```js
templural`${nbVerbunden} Person{en} {ist;sind} verbunden`

// nbVerbunden = 1   ➔ "1 Person ist verbunden"
// nbVerbunden = 2   ➔ "2 Personen sind verbunden"
// nbVerbunden = 666 ➔ "666 Personen sind verbunden"
```

### Mischen Sie alle vorherigen Beispiele

```js
templural`${nbHunde} Hund{e} bell{t;en} und ${nbKatzen} Katze{n} miau{t;en}`

// nbHunde = 1, nbKatzen = 1 ➔ "1 Hund bellt und 1 Katze miaut"
// nbHunde = 2, nbKatzen = 1 ➔ "2 Hunde bellen und 1 Katze miaut"
// nbHunde = 1, nbKatzen = 2 ➔ "1 Hund bellt und 2 Katzen miauen"
// nbHunde = 2, nbKatzen = 2 ➔ "2 Hunde bellen und 2 Katzen miauen"
```

### Einem Wort eine *nicht vorangehende* Zahl zuordnen

```js
templural`Die ${nbFrauen} nette{$1;n} Frau{en}`

// nbFrauen = 1 ➔ "Die 1 nette Frau"
// nbFrauen = 2 ➔ "Die 2 netten Frauen"
```

`$1` verweist auf den ersten interpolierten Ausdruck.

Verwende `$2`, `$3` or `$n` um auf den zweiten, den dritten oder den n-ten interpolierten Ausdruck zu verweisen.

### Assoziative Syntax

In einigen Fällen kann eine assoziative Syntax verwendet werden, um leere Werte zu vermeiden:

```js
templural`${nbHunde} Hund{e} bell{t;en} und ${nbKatzen} Katze{n} miau{t;en}`

// kann ersetzt werden durch

templural`${nbHunde} Hund{e} bell{one:t;other:en} und ${nbKatzen} Katze{n} miau{one:t;other:en}`
```

**⚠️ Die assoziative Syntax darf nicht mit der geordneten Syntax vermischt werden:**

```js
// das ist OK:

templural`${nbVerbunden} {one:Person;other:Personen} verbunden`

// das ist NICHT OK:
templural`${nbVerbunden} {one:Person;Personen} verbunden`
```

## 🗣️ Internationalisierung

templural ist auf [Intl.PluralRules](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules) basiert und kann zur Formatierung von Sätzen in jeder Sprache verwendet werden.

Diese README ist in den folgenden anderen Sprachen verfügbar:

 - [🇬🇧 English](https://github.com/nlepage/templural#readme)
 - [🇫🇷 Français](https://github.com/nlepage/templural/blob/main/docs/README_fr.md)
 
### Pluralregeln

Jede Sprache hat unterschiedliche Pluralregeln.

Im Deutschen gibt es zum Beispiel zwei Plural-Kategorien, `"one"` für den Singular und `"other"` für den Plural.

```js
templural.setLocales('de')

templural`${n} ist in der Kategorie {one;other}`

// n = 1       ➔ "1 ist in der Kategorie one"
// n = 2       ➔ "2 ist in der Kategorie other"
// n = 1000000 ➔ "1000000 ist in der Kategorie other"
// n = 0       ➔ "0 ist in der Kategorie other"
```

Das Französische ist etwas anders als das Deutsche, es hat eine dritte Kategorie `"many"` für einige große Zahlen, und 0 ist Singular:

```js
templural.setLocales('fr')

templural`${n} ist in der Kategorie {one;other;many}`

// n = 1       ➔ "1 ist in der Kategorie one"
// n = 2       ➔ "2 ist in der Kategorie other"
// n = 1000000 ➔ "1000000 ist in der Kategorie many"
// n = 0       ➔ "0 ist in der Kategorie one"
```
Siehe [Pluralregeln der Sprachen](https://unicode-org.github.io/cldr-staging/charts/latest/supplemental/language_plural_rules.html) für Informationen über Pluralregeln in jeder Sprache.

Das Verhalten von templural kann über drei Mechanismen angepasst werden:

 - [Kategoriepriorität](#kategoriepriorit%C3%A4t)
 - [Kategoriereihenfolge](#kategoriereihenfolge)
 - [Kategorie Fallback](#kategorie-fallback)

`templural.setLocales()` und `forLocales()` akzeptieren `LocalesOptions` als zweiten Parameter, siehe [locales.ts](https://github.com/nlepage/templural/blob/main/src/locales.ts).

### Kategoriepriorität

Die Kategoriepriorität legt fest, welche Kategorien bewertet werden, wenn nicht für alle Kategorien Werte angegeben werden.

Wenn Priorität ist:

1. `many`
2. `other`
3. `one`

Dann:

```js
// die Angabe nur eines Wertes ist für die Kategorie many
templural`${n} ist {many}`

// die Angabe von zwei Werten ist für die Kategorien other und many
templural`${n} ist {other;many}`

// die Angabe von zwei Werten ist für die Kategorien one, other und many
templural`${n} ist {one;other;many}`
```

Die Standardpriorität (unabhängig vom Gebietsschema) ist:

1. `other`
2. `one`
3. `two`
4. `few`
5. `many`
6. `zero`

Diese Standardpriorität wird so gefiltert, dass sie nur Kategorien des ausgewählten Gebietsschemas enthält, z. B. im Deutschen:

1. `other`
2. `one`

Einige Sprachen haben möglicherweise eine andere Standardpriorität, siehe [locales.ts](https://github.com/nlepage/templural/blob/main/src/locales.ts).

### Kategoriereihenfolge

Die Kategoriereihenfolge legt die Reihenfolge fest, in der die Kategorien bewertet werden (unabhängig von ihrer Priorität).

Wenn die Reihenfolge:

1. `many`
2. `other`
3. `one`

Dann:

```js
// mit zwei Werten ist other dann one (many hat eine niedrigere Priorität)
templural`${n} ist {other;one}`

// mit drei Werten ist many dann other danach one
templural`${n} ist {many;other;one}`
```

Die Standardpriorität (unabhängig vom Gebietsschema) ist:

1. `zero`
2. `one`
3. `two`
4. `few`
5. `many`
6. `other`

Diese Standardreihenfolge wird so gefiltert, dass sie nur Kategorien des jeweiligen Gebietsschemas enthält, z. B. im Deutschen:

1. `one`
2. `other`

Einige Sprachen haben möglicherweise eine andere Standardreihenfolge, siehe [locales.ts](https://github.com/nlepage/templural/blob/main/src/locales.ts).

### Kategorie Fallback

Bestimmte Sprachen benötigen möglicherweise eine Kategorie, um auf eine andere Kategorie zurückgreifen zu können.

Zum Beispiel im Französischen, `many` verhält sich wie eine Unterkategorie von `other`, was bedeutet `many` muss zurückfallen auf `other`:

```js
templural`${1000000} ist {one;other;many} und fällt zurück auf {one;other}`
// ➔ "1000000 ist many und fällt zurück auf other"
```

Einige Sprachen können Standard-Fallbacks haben, siehe [locales.ts](https://github.com/nlepage/templural/blob/main/src/locales.ts).

## ❓ FAQ

### Was ist mit negativen Zahlen, Gleitkommazahlen oder anderen Werten?

templural kümmert sich nicht darum, es verlässt sich auf [Intl.PluralRules](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules).

### Sind neue Funktionen geplant?

Im Moment nicht.

templural ist einfach und dumm, und so wird es wahrscheinlich auch bleiben.

### Haben Sie noch Fragen?

Benutzen Sie [Discussions tab](https://github.com/nlepage/templural/discussions).

## Contributors ✨

<table>
  <tr>
    <td align="center"><a href="https://github.com/SvA1"><img src="https://avatars.githubusercontent.com/u/19571875?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Nicolas Lepage</b></sub></a><br /><a href="https://github.com/nlepage/templural/commits?author=nlepage" title="Author">✍️</a></td>
  </tr>
</table>

Danke an diese wunderbaren Menschen ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/EmrysMyrddin"><img src="https://avatars.githubusercontent.com/u/3855602?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Valentin Cocaud</b></sub></a><br /><a href="#ideas-EmrysMyrddin" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/Taranys"><img src="https://avatars.githubusercontent.com/u/4621525?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Yoann Prot</b></sub></a><br /><a href="#ideas-Taranys" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/SvA1"><img src="https://avatars.githubusercontent.com/u/41849274?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Svetlana A.</b></sub></a><br /><a href="https://github.com/nlepage/templural/commits?author=SvA1" title="Documentation">📖</a> <a href="#translation-SvA1" title="Translation">🌍</a></td>
    <td align="center"><a href="https://github.com/Mayie"><img src="https://avatars.githubusercontent.com/u/35461138?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Marie Viley</b></sub></a><br /><a href="https://github.com/nlepage/templural/commits?author=Mayie" title="Documentation">📖</a> <a href="#translation-Mayie" title="Translation">🌍</a></td>
    <td align="center"><a href="https://github.com/patou"><img src="https://avatars.githubusercontent.com/u/841858?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Patrice De Saint Steban</b></sub></a><br /><a href="https://github.com/nlepage/templural/commits?author=patou" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

Dieses Projekt folgt der Spezifikation [all-contributors](https://github.com/all-contributors/all-contributors). Beiträge jeglicher Art sind willkommen!

## 🤝 Beitragen

Beiträge, Probleme und Funktionswünsche sind willkommen! Weitere Informationen finden Sie in unserem [Contributing guide](https://github.com/nlepage/templural/blob/main/docs/CONTRIBUTING.md).

Um ein offenes und freundliches Umfeld zu fördern, haben wir [einen Verhaltenskodex](https://github.com/nlepage/templural/blob/main/docs/CODE_OF_CONDUCT.md) verabschiedet, den die Projektteilnehmer einhalten müssen. Bitte lesen Sie den vollständigen Text, damit Sie verstehen, welches Verhalten toleriert wird und welches nicht.

## Zeigen Sie Ihre Unterstützung

Geben Sie ein ⭐️ und/oder sponsern Sie, wenn dieses Projekt Ihnen geholfen hat!

## 📝 Lizenz

Copyright © 2021 [Nicolas Lepage](https://github.com/nlepage).<br />
Dieses Projekt ist [Apache-2.0](https://spdx.org/licenses/Apache-2.0.html) lizenziert.
