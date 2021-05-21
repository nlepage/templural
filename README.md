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
templural`${nbConnected} {person:people} {is:are} connected`

// nbConnected = 1 ➔ "1 person is connected"
// nbConnected = 2 ➔ "2 people are connected"
// nbConnected = 666 ➔ "666 people are connected"
```

### Mix all the previous examples

```js
templural`${nbDogs} dog{s} bark{s:} and ${nbCats} cat{s} meow{s:}`

// nbDogs = 1, nbCats = 1 ➔ "1 dog barks and 1 cat meows"
// nbDogs = 2, nbCats = 1 ➔ "2 dogs bark and 1 cat meows"
// nbDogs = 1, nbCats = 2 ➔ "1 dog barks and 2 cats meow"
// nbDogs = 2, nbCats = 2 ➔ "2 dogs bark and 2 cats meow"
```

### Match a word to a *non preceding* number

```js
templural`There {$1:is:are} ${nbWhales} flying whale{s}`

// nbWhales = 1 ➔ "There is 1 flying whale"
// nbWhales = 2 ➔ "There are 2 flying whales"
```

`$1` references the first interpolated expression.

Use `$2`, `$3` or `$n` to reference the second, the third or the nth interpolated expression.

### Replace numbers by text

```js
templural`You have {${nbMessages}:a:several} message{s}`

// nbMessages = 1 ➔ "You have a message"
// nbMessages = 86 ➔ "You have several messages"
```

#### Choose a different text when the number is zero

```js
templural`You have {${nbMessages}:no:a:several} message{s}`

// nbMessages = 0 ➔ "You have no messages"
// nbMessages = 1 ➔ "You have a message"
// nbMessages = 86 ➔ "You have several messages"
```

#### Mix replacing and not replacing numbers by text

```js
templural`You have {${nbMessages}:a:$1} message{s}`

// nbMessages = 1 ➔ "You have a message"
// nbMessages = 86 ➔ "You have 86 messages"
```

## ❓ FAQ

### Any new features planned?

Not for the moment.

templural is simple and dumb, and it will probably stay like this.

### What about negative or floating numbers?

templural doesn't care about these.

If a number is less than or equal to 1, the corresponding words will be in the singular.

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
