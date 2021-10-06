# templural 🍤

**Template function for plural-sensitive formatting.**

[![CI](https://github.com/nlepage/templural/actions/workflows/ci.yml/badge.svg)](https://github.com/nlepage/templural/actions)
[![Version](https://img.shields.io/npm/v/templural.svg)](https://www.npmjs.com/package/templural)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache2.0-yellow.svg)](https://spdx.org/licenses/Apache-2.0.html)

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

[![French README](https://img.shields.io/badge/🇫🇷-README-blue)](https://github.com/nlepage/templural/blob/main/docs/README_fr.md)
[![German README](https://img.shields.io/badge/🇩🇪-README-blue)](https://github.com/nlepage/templural/blob/main/docs/README_de.md)

## Usage

### Install

```sh
yarn add templural
```

or

```sh
npm install templural
```

### Import

```js
import { templural } from 'templural'
```

or

```js
const { templural } = require('templural')
```

### Choose a locale

templural uses [Intl.PluralRules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules) to know which plural rule to apply for a given number, and plural rules vary depending on the language.

This means **you have to set the locale used by templural** in order to format correct sentences.

Either set the default locale:

```js
templural.setLocales('fr_BE') // French (Belgium)
```

or get a new template function for a specific locale:

```js
import { forLocales } from 'templural'

const templuralDeCH = forLocales('de_CH') // German (Switzerland)
```

For more information about the values accepted by `templural.setLocales()` and `forLocales()` see [locales argument](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#locales_argument).

The following examples are specific to the English language, see [Internationalization](#%EF%B8%8F-internationalization) for information about other languages.

### Match a word to a preceding number

```js
templural`Yoann and Valentin had ${numberOfIdeas} interesting idea{s}`

// numberOfIdeas = 1  ➔ "Yoann and Valentin had 1 interesting idea"
// numberOfIdeas = 2  ➔ "Yoann and Valentin had 2 interesting ideas"
// numberOfIdeas = 42 ➔ "Yoann and Valentin had 42 interesting ideas"
// numberOfIdeas = 0  ➔ "Yoann and Valentin had 0 interesting ideas"
```

### Insert any other values in the text

```js
templural`${userName} has ${nbPoints} point{s}`

// userName = "Joe",   nbPoints = 1    ➔ "Joe has 1 point"
// userName = "Mario", nbPoints = 1000 ➔ "Mario has 1000 points"
```

### Match several words to the same preceding number

```js
templural`I just had ${nbPints} beer{s} darling{s}, I swear{s}`

// nbPints = 1 ➔ "I just had 1 beer darling, I swear"
// nbPints = 2 ➔ "I just had 2 beers darlings, I swears"
// nbPints = 6 ➔ "I just had 6 beers darlings, I swears"
```

### Match several words each to a different preceding number

```js
templural`I bought ${nbCarrots} carrot{s} and ${nbPotatoes} potato{es}`

// nbCarrots = 1, nbPotatoes = 1 ➔ "I bought 1 carrot and 1 potato"
// nbCarrots = 1, nbPotatoes = 3 ➔ "I bought 1 carrot and 3 potatoes"
// nbCarrots = 2, nbPotatoes = 1 ➔ "I bought 2 carrots and 1 potato"
// nbCarrots = 2, nbPotatoes = 3 ➔ "I bought 2 carrots and 3 potatoes"
```

### Words with a different form in the singular and plural

```js
templural`${nbConnected} {person;people} {is;are} connected`

// nbConnected = 1   ➔ "1 person is connected"
// nbConnected = 2   ➔ "2 people are connected"
// nbConnected = 666 ➔ "666 people are connected"
```

### Mix all the previous examples

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

### Associative syntax

In some cases, associative syntax may be used to avoid empty values:

```js
templural`${nbDogs} dog{s} bark{s;} and ${nbCats} cat{s} meow{s;}`

// may be replaced by

templural`${nbDogs} dog{s} bark{one:s} and ${nbCats} cat{s} meow{one:s}`
```

**⚠️ Associative syntax must not be mixed with ordered syntax:**

```js
// this is OK:
templural`${nbConnected} {one:person;other:people} connected`

// this is NOT OK:
templural`${nbConnected} {one:person;people} connected`
```

## 🗣️ Internationalization

templural is built on top of [Intl.PluralRules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules) and may be used to format sentences in any language.

This README is available in the following other languages:

 - [🇫🇷 French](https://github.com/nlepage/templural/blob/main/docs/README_fr.md)
 - [🇩🇪 German](https://github.com/nlepage/templural/blob/main/docs/README_de.md)

### Plural rules

Each language has different plural rules.

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
    <td align="center"><a href="https://github.com/SvA1"><img src="https://avatars.githubusercontent.com/u/41849274?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Svetlana A.</b></sub></a><br /><a href="https://github.com/nlepage/templural/commits?author=SvA1" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## 🤝 Contributing

Contributions, issues and feature requests are welcome! Check out our [Contributing guide](https://github.com/nlepage/templural/blob/main/docs/CONTRIBUTING.md) for more information.

In the interest of fostering an open and welcoming environment, we have adopted [a Code of Conduct](https://github.com/nlepage/templural/blob/main/docs/CODE_OF_CONDUCT.md) that we expect project participants to commit to. Please read the full text so that you can understand what behavior will and will not be tolerated.

## Show your support

Give a ⭐️ and/or sponsor if this project helped you!

## 📝 License

Copyright © 2021 [Nicolas Lepage](https://github.com/nlepage).<br />
This project is [Apache-2.0](https://spdx.org/licenses/Apache-2.0.html) licensed.
