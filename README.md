# templural 🍤

**Template function for plural agreements in sentences.**

[![CI](https://github.com/nlepage/templural/actions/workflows/ci.yml/badge.svg)](https://github.com/nlepage/templural/actions)
[![Version](https://img.shields.io/npm/v/templural.svg)](https://www.npmjs.com/package/templural)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache2.0-yellow.svg)](https://spdx.org/licenses/Apache-2.0.html)

[![README en français](https://img.shields.io/badge/🇫🇷-README-blue)](https://github.com/nlepage/templural/blob/main/README_fr.md)

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

or create a new template function for a specific locale:

```js
import { forLocales } from 'templural'

const templuralDeCH = forLocales('de_CH') // German (Switzerland)
```

For more information about the values accepted by `templural.setLocales()` and `forLocales()` see [locales argument](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#locales_argument).

The following examples are specific to the English language, see [Internationalization](#%EF%B8%8F-internationalization) for information about other languages.

### Match a word to a preceding number

```js
templural`Yoann and Valentin had ${numberOfIdeas} interesting idea{s}`

// numberOfIdeas = 1 ➔ "Yoann and Valentin had 1 interesting idea"
// numberOfIdeas = 2 ➔ "Yoann and Valentin had 2 interesting ideas"
// numberOfIdeas = 42 ➔ "Yoann and Valentin had 42 interesting ideas"
// numberOfIdeas = 0 ➔ "Yoann and Valentin had 0 interesting ideas"
```

### Insert any other values in the text

```js
templural`${userName} has ${nbPoints} point{s}`

// userName = "Joe", nbPoints = 1 ➔ "Joe has 1 point"
// userName = "Mario", nbPoints = 1000 ➔ "Mario has 1000 points"
```

### Match several words to the same preceding number

```js
templural`I just had ${nbPints} bear{s} darling{s}, I swear{s}`

// nbPints = 1 ➔ "I just had 1 bear darling, I swear"
// nbPints = 2 ➔ "I just had 2 bears darlings, I swears"
// nbPints = 6 ➔ "I just had 6 bears darlings, I swears"
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

// nbConnected = 1 ➔ "1 person is connected"
// nbConnected = 2 ➔ "2 people are connected"
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

## 🗣️ Internationalization

**⚠ This section is outdated and needs to be updated! ⚠**

templural is designed to be adaptable to any language.

### Number ranges

templural uses number ranges to define what to do, from less to more explicit:

```js
templural`${n}{a}`
// ➔ Chooses "a" if n >= 2

templural`${n}{a;b}`
// ➔ Chooses "a" if 1 <= n < 2
// ➔ Chooses "b" if n >= 2

templural`${n}{a;b;c}`
// ➔ Chooses "a" if 0 <= n < 1
// ➔ Chooses "b" if 1 <= n < 2
// ➔ Chooses "c" if n >= 2
```

When using a less explicit form, templural uses [plural rules](#plural-rules) to choose what to do.

It is possible to change the number ranges used by tempural, either by setting the default ranges:

```js
templural.setRanges(...)
```

or by creating a new template function with specific ranges:

```js
import { forRanges } from 'templural'

const templuralCustom = forRanges(...)
```

The default ranges used by templural are defined in [`index.ts`](https://github.com/nlepage/templural/blob/ef1e75601049b545637ba8c2b4ce36ee3e8a6f18/src/index.ts#L8).

### Plural rules

templural uses [`Intl.PluralRules`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules) to choose what to do when not specified explicitly.

For example, zero is plural in english whereas it is singular in french:

```js
templural.setLocales('en')
templural`You have ${0} message{s}` // ➔ "You have 0 messages"

templural.setLocales('fr')
templural`Vous avez ${0} message{s}` // ➔ "Vous avez 0 message"
```

So it is preferable to set the correct locale when using templural in order to avoid mistakes.

However it is possible to specify explicitly what to do in all cases, and avoid relying on `Intl.PluralRules`:

```js
// This french sentence will be correct even if the locale is set to english
templural`Vous avez ${0} message{;;s}` // ➔ "Vous avez 0 message"
```

## ❓ FAQ

### Any new features planned?

Not for the moment.

templural is simple and dumb, and it will probably stay like this.

### What about negative or floating numbers?

🚧 FIXME

### Any other questions?

Use the [Discussions tab](https://github.com/nlepage/templural/discussions).

## Authors & Contributors

Special thanks go to [Valentin Cocaud](https://github.com/EmrysMyrddin) and [Yoann Prot](https://github.com/Taranys) for their original idea behind templural.

👤 **Nicolas Lepage**

* Twitter: [@njblepage](https://twitter.com/njblepage)
* Github: [@nlepage](https://github.com/nlepage)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/nlepage/templural/issues).

## Show your support

Give a ⭐️ and/or sponsor if this project helped you!

## 📝 License

Copyright © 2021 [Nicolas Lepage](https://github.com/nlepage).<br />
This project is [Apache-2.0](https://spdx.org/licenses/Apache-2.0.html) licensed.
