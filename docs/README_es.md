# templural 🍤

**Función de plantilla para formatear texto sensible a los acordes plurales.**

[![CI](https://github.com/nlepage/templural/actions/workflows/ci.yml/badge.svg)](https://github.com/nlepage/templural/actions)
[![Version](https://img.shields.io/npm/v/templural.svg)](https://www.npmjs.com/package/templural)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache2.0-yellow.svg)](https://spdx.org/licenses/Apache-2.0.html)

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-4-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

[![English README](https://img.shields.io/badge/🇬🇧-README-blue)](https://github.com/nlepage/templural#readme)
[![README en Français](https://img.shields.io/badge/🇫🇷-README-blue)](https://github.com/nlepage/templural/blob/main/docs/README_fr.md)
[![README auf Deutsch](https://img.shields.io/badge/🇩🇪-README-blue)](https://github.com/nlepage/templural/blob/main/docs/README_de.md)

## El uso

### Instalación

```sh
yarn add templural
```

o

```sh
npm install templural
```

### Importación

```js
import { templural } from 'templural'
```

o

```js
const { templural } = require('templural')
```

### Elegir un locale

Templural utiliza [Intl.PluralRules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules) para saber qué regla de ajuste aplicar por un número determinado, y las reglas de ajuste varían según el idioma.

Esto significa que **debe establecer el locale utilizado por templural** para formatear las frases correctas.

Puede establecer el locale por defecto :

```js
templural.setLocales('fr_BE') // French (Belgium)
```

O crear una neuva función de plantilla para un locale especifico :

```js
import { forLocales } from 'templural'

const templuralDeCH = forLocales('de_CH') // German (Switzerland)
```
 
Para obtener más información sobre los valores aceptados por `templural.setLocales()` y `forLocales()` ver [argumento locales](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Intl#locales).

Los ejemplos siguintos estan especificos en espagnol, ver [Internacionalización](#%EF%B8%8F-internacionalización) para las informaciones sobre los otros idiomas.

### Relacionar una palabra con un número anterior

```js
templural`Yoann y Valentin tuvieron ${númerodeideas} idea{s} interesante{s}`
// númeroDeIdeas = 1  ➔ "Yoann y Valentin tuvieron 1 idea interesante"
// númeroDeIdeas = 2  ➔ "Yoann y Valentin tuvieron 2 ideas interesantes"
// númeroDeIdeas = 42 ➔ "Yoann y Valentin tuvieron 42 ideas interesantes"
// númeroDeIdeas = 0  ➔ "Yoann y Valentin tuvieron 0 ideas interesantes"
```

### Inserta cualquier otro valor en el texto

```js
templural`${userName} tiene ${nbPuntos} punto{s}`
// userName = "Joe",   nbPuntos = 1    ➔ "Joe tiene 1 punto"
// userName = "Mario", nbPuntos = 1000 ➔ "Mario tiene 1000 puntos"
```

### Relacionar varias palabras con el mismo número anterior

```js
templural`Solo bebí ${nbCervezas} cerveza{s} querida{s}, lo juro{s}`
// nbCervezas = 1 ➔ "Solo bebí 1 cerveza querida, lo juro"
// nbCervezas = 2 ➔ "Solo bebí 2 cervezas querida, lo juro"
// nbCervezas = 6 ➔ "Solo bebí 6 cervezas querida, lo juro"
```

### Relacionar varias palabras cada una con un número anterior diferente

```js
templural`Compré ${nbZanahorias} zanahoria{s} y ${nbPapas} papa{s}`
// nbZanahorias = 1, nbPapas = 1 ➔ "Compré 1 zanahoria y 1 papa"
// nbZanahorias = 1, nbPapas = 3 ➔ "Compré 1 zanahoria y 3 papas"
// nbZanahorias = 2, nbPapas = 1 ➔ "Compré 2 zanahorias y 1 papa"
// nbZanahorias = 2, nbPapas = 3 ➔ "Compré 2 zanahorias y 3 papas"
```

### Palabras con una forma diferente en singular y plural

```js
templural`${nbConnected} {person;people} {is;are} connected`
// nbConnected = 1   ➔ "1 person is connected"
// nbConnected = 2   ➔ "2 people are connected"
// nbConnected = 666 ➔ "666 people are connected"
```

### Mezclar todos los ejemplos anteriores

```js
templural`${nbDogs} dog{s} bark{s;} and ${nbCats} cat{s} meow{s;}`
// nbDogs = 1, nbCats = 1 ➔ "1 dog barks and 1 cat meows"
// nbDogs = 2, nbCats = 1 ➔ "2 dogs bark and 1 cat meows"
// nbDogs = 1, nbCats = 2 ➔ "1 dog barks and 2 cats meow"
// nbDogs = 2, nbCats = 2 ➔ "2 dogs bark and 2 cats meow"
```

### Match a word to a *non preceding* number

```js
templural`There {$1;is;are} ${nbWhales} flying whale{s}`
// nbWhales = 1 ➔ "There is 1 flying whale"
// nbWhales = 2 ➔ "There are 2 flying whales"
```

`$1` references the first interpolated expression.

Use `$2`, `$3` or `$n` to reference the second, the third or the nth interpolated expression.

### Sintaxis asociativa

En algunos casos, se puede utilizar la sintaxis asociativa para evitar valores vacíos:

```js
templural`${nbDogs} dog{s} bark{s;} and ${nbCats} cat{s} meow{s;}`
// may be replaced by
templural`${nbDogs} dog{s} bark{one:s} and ${nbCats} cat{s} meow{one:s}`
```

**⚠️ La sintaxis asociativa no debe mezclarse con la sintaxis ordenada:**

```js
// this is OK:
templural`${nbConnected} {one:person;other:people} connected`
// this is NOT OK:
templural`${nbConnected} {one:person;people} connected`
```

## 🗣️ Internacionalización

templural está construido sobre [Intl.PluralRules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules) y se puede utilizar para formatear frases en cualquier idioma.

Este README está disponible en los siguientes idiomas:

 - [🇫🇷 Français](https://github.com/nlepage/templural/blob/main/docs/README_fr.md)
 - [🇩🇪 Deutsch](https://github.com/nlepage/templural/blob/main/docs/README_de.md)

### Reglas plurales

Cada idioma tiene diferentes reglas de plural.

For example English has two plural categories, `"one"` for singular, and `"other"` for plural:

```js
templural.setLocales('en')
templural`${n} is in the {one;other} category`
// n = 1       ➔ "1 is in the one category"
// n = 2       ➔ "2 is in the other category"
// n = 1000000 ➔ "1000000 is in the other category"
// n = 0       ➔ "0 is in the other category"
```

French is a little different from English, it has a third category `"many"` for some large numbers, and 0 is singular:

```js
templural.setLocales('fr')
templural`${n} is in the {one;other;many} category`
// n = 1       ➔ "1 is in the one category"
// n = 2       ➔ "2 is in the other category"
// n = 1000000 ➔ "1000000 is in the many category"
// n = 0       ➔ "0 is in the one category"
```

See [Language Plural Rules](https://unicode-org.github.io/cldr-staging/charts/latest/supplemental/language_plural_rules.html) for information about plural rules in any language.

templural's behavior may be customized using three mechanisms:

 - [Category priority](#category-priority)
 - [Category order](#category-order)
 - [Category fallback](#category-fallback)

`templural.setLocales()` and `forLocales()` accept `LocalesOptions` as second parameter, see [locales.ts](https://github.com/nlepage/templural/blob/main/src/locales.ts).

### Category priority

Category priority defines which categories are valued when not giving values for all categories.

If priority is:

1. `many`
2. `other`
3. `one`

Then:

```js
// giving only one value is for category many
templural`${n} is {many}`
// giving two values is for categories other and many
templural`${n} is {other;many}`
// giving three values is for categories one, other and many
templural`${n} is {one;other;many}`
```

The default priority (regardless of locale) is:

1. `other`
2. `one`
3. `two`
4. `few`
5. `many`
6. `zero`

This default priority is filtered to include only categories of the selected locale, for example in English:

1. `other`
2. `one`

Some languages may have a different default priority, see [locales.ts](https://github.com/nlepage/templural/blob/main/src/locales.ts).

### Category order

Category order defines the order in which categories are valued (regardless of their priority).

If order is:

1. `many`
2. `other`
3. `one`

Then:

```js
// giving two values is other then one (many has a lower priority)
templural`${n} is {other;one}`
// giving three values is many then other then one
templural`${n} is {many;other;one}`
```

The default order (regardless of locale) is:

1. `zero`
2. `one`
3. `two`
4. `few`
5. `many`
6. `other`

This default order is filtered to include only categories of the locale, for example in English:

1. `one`
2. `other`

Some languages may have a different default order, see [locales.ts](https://github.com/nlepage/templural/blob/main/src/locales.ts).

### Category fallback

Certain languages may need a category to fallback to another category.

For example in French, `many` behaves like a sub-category of `other`, which means `many` needs to fallback to `other`:

```js
templural`${1000000} is {one;other;many} and falls back to {one;other}`
// ➔ "1000000 is many and falls back to other"
```

Some languages may have default fallbacks, see [locales.ts](https://github.com/nlepage/templural/blob/main/src/locales.ts).

## ❓ FAQ

### What about negative or floating numbers or any other value?

templural doesn't care, it relies on [Intl.PluralRules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules).

### Any new features planned?

Not for the moment.

templural is simple and dumb, and it will probably stay like this.

### Any other questions?

Use the [Discussions tab](https://github.com/nlepage/templural/discussions).

## Contributors ✨

<table>
  <tr>
    <td align="center"><a href="https://github.com/SvA1"><img src="https://avatars.githubusercontent.com/u/19571875?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Nicolas Lepage</b></sub></a><br /><a href="https://github.com/nlepage/templural/commits?author=nlepage" title="Author">✍️</a></td>
  </tr>
</table>

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

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

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## 🤝 Contributing

Contributions, issues and feature requests are welcome! Check out our [Contributing guide](https://github.com/nlepage/templural/blob/main/docs/CONTRIBUTING.md) for more information.

Para fomentar un entorno abierto y acogedor, hemos adoptado [a Code of Conduct](https://github.com/nlepage/templural/blob/main/docs/CODE_OF_CONDUCT.md) con el que esperamos que los participantes del proyecto se comprometan. Lea el texto completo para comprender qué comportamiento se tolerará o no.

## Muestre su apoyo

¡Da un ⭐️ y / o patrocinador si este proyecto te ayudó!

## 📝 licencia

Copyright © 2021 [Nicolas Lepage](https://github.com/nlepage).<br />
Este proyecto tiene [Apache-2.0](https://spdx.org/licenses/Apache-2.0.html) licencia.
